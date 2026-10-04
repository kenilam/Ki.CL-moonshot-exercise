#!/usr/bin/env bash
#
# Cloud Run setup for moonshot, in the same project and network as Ki.CL.
# Each step is safe to run again.
#
#   scripts/gcp.sh secrets          Anthropic key and workspace id, from .env
#   scripts/gcp.sh deploy dev|prod  build this checkout and deploy it
#   scripts/gcp.sh triggers         deploy on push to develop and main
#   scripts/gcp.sh wire dev|prod    point Ki.CL at the service
#   scripts/gcp.sh localhost        let a standalone run on localhost use dev
#
set -euo pipefail

PROJECT=client-458617
REGION=us-central1
NUMBER=976859071481
ACCOUNT="$NUMBER-compute@developer.gserviceaccount.com"

url() { echo "https://$1-$NUMBER.$REGION.run.app"; }

service() { [ "$1" = prod ] && echo ki-cl-moonshot || echo ki-cl-moonshot-dev; }

case "${1:-}" in
  secrets)
    # The values go straight from .env to Secret Manager, never to the terminal.
    for pair in ANTHROPIC_API_KEY:anthropic-api-key ANTHROPIC_WORKSPACE_ID:anthropic-workspace-id; do
      var=${pair%%:*}
      name=${pair##*:}
      value=$(grep -E "^$var=" .env | head -1 | cut -d= -f2-)
      [ -n "$value" ] || { echo "$var is empty in .env"; exit 1; }

      gcloud secrets describe "$name" --project "$PROJECT" >/dev/null 2>&1 ||
        gcloud secrets create "$name" --project "$PROJECT" --replication-policy automatic
      printf %s "$value" | gcloud secrets versions add "$name" --project "$PROJECT" --data-file=-
      gcloud secrets add-iam-policy-binding "$name" --project "$PROJECT" \
        --member "serviceAccount:$ACCOUNT" --role roles/secretmanager.secretAccessor >/dev/null
    done
    ;;

  deploy)
    env=${2:?dev or prod}
    name=$(service "$env")
    [ "$env" = prod ] && api=ki-cl-api database=production || api=ki-cl-api-dev database=test

    # Internal and private, like the design system: only Ki.CL's server calls it,
    # with an ID token. The VPC egress reaches Ki.CL-back, which is internal too.
    gcloud run deploy "$name" --project "$PROJECT" --region "$REGION" --source . \
      --service-account "$ACCOUNT" --no-allow-unauthenticated --ingress internal \
      --network ki-cl-net --subnet ki-cl-us-central1 --vpc-egress all-traffic \
      --set-env-vars "NODE_ENV=production,KICL_BACKEND_URL=$(url "$api"),MONGODB_DATABASE=$database" \
      --set-secrets "ANTHROPIC_API_KEY=anthropic-api-key:latest,ANTHROPIC_WORKSPACE_ID=anthropic-workspace-id:latest,MONGODB_ATLAS_URI=mongodb-atlas-uri:latest"

    gcloud run services add-iam-policy-binding "$name" --project "$PROJECT" --region "$REGION" \
      --member "serviceAccount:$ACCOUNT" --role roles/run.invoker >/dev/null
    ;;

  triggers)
    # Same steps as the design system's triggers. Needs the Cloud Build GitHub
    # app installed on this repository first.
    for pair in develop:ki-cl-moonshot-dev main:ki-cl-moonshot; do
      branch=${pair%%:*}
      name=${pair##*:}
      gcloud builds triggers describe "ki-cl-moonshot-$branch" --project "$PROJECT" >/dev/null 2>&1 && continue

      config=$(mktemp)
      cat > "$config" <<EOF
steps:
  - id: Build
    name: gcr.io/cloud-builders/docker
    args: [build, --no-cache, -t, '$REGION-docker.pkg.dev/$PROJECT/cloud-run-source-deploy/ki.cl-moonshot-exercise/$name:\$COMMIT_SHA', ., -f, Dockerfile]
  - id: Push
    name: gcr.io/cloud-builders/docker
    args: [push, '$REGION-docker.pkg.dev/$PROJECT/cloud-run-source-deploy/ki.cl-moonshot-exercise/$name:\$COMMIT_SHA']
  - id: Deploy
    name: gcr.io/google.com/cloudsdktool/cloud-sdk:slim
    entrypoint: gcloud
    args: [run, services, update, $name, --platform=managed, '--image=$REGION-docker.pkg.dev/$PROJECT/cloud-run-source-deploy/ki.cl-moonshot-exercise/$name:\$COMMIT_SHA', --region=$REGION, --quiet]
options:
  logging: CLOUD_LOGGING_ONLY
EOF

      gcloud builds triggers create github --project "$PROJECT" \
        --name "ki-cl-moonshot-$branch" --repo-owner kenilam --repo-name Ki.CL-moonshot-exercise \
        --branch-pattern "^$branch$" --service-account "projects/$PROJECT/serviceAccounts/$ACCOUNT" \
        --inline-config "$config"
      rm "$config"
    done
    ;;

  wire)
    env=${2:?dev or prod}
    [ "$env" = prod ] && kicl=ki-cl || kicl=ki-cl-dev

    gcloud run services update "$kicl" --project "$PROJECT" --region "$REGION" \
      --update-env-vars "KICL_MOONSHOT_URL=$(url "$(service "$env")")"
    ;;

  localhost)
    # Dev only. The public key comes from `make client-token.keys` in Ki.CL.
    key=${KICL_CLIENT_PUBLIC_KEY:?set KICL_CLIENT_PUBLIC_KEY to the public key}

    gcloud run services update ki-cl-dev --project "$PROJECT" --region "$REGION" \
      --update-env-vars "KICL_CLIENT_PUBLIC_KEY=$key"

    # The standalone dev server's origin, and localhost for the Turnstile widget.
    # The widget also has to list localhost under Hostname Management in Cloudflare.
    origins=$(gcloud run services describe ki-cl-api-dev --project "$PROJECT" --region "$REGION" \
      --format json | python3 -c "
import json, sys
env = json.load(sys.stdin)['spec']['template']['spec']['containers'][0]['env']
print(next(e.get('value', '') for e in env if e['name'] == 'CORS_ORIGINS'))")
    case ",$origins," in *,http://localhost:3300,*) ;; *) origins="$origins,http://localhost:3300" ;; esac

    gcloud run services update ki-cl-api-dev --project "$PROJECT" --region "$REGION" \
      --update-env-vars "^|^CORS_ORIGINS=$origins|TURNSTILE_HOSTNAMES=dev.ki-cl.com,localhost"
    ;;

  *)
    sed -n '3,9p' "$0"
    exit 1
    ;;
esac
