# Moonshot image for Cloud Run, built the same way as the design system's.
#
# Serves the built remote at /moonshot and the review API at /moonshot/api.
# Ki.CL's server is the only caller: the service has no public invoker.

FROM node:24-slim

WORKDIR /src

RUN corepack enable

# Manifests first, so a dependency install is only redone when they change.
COPY package.json yarn.lock .yarnrc.yml ./
COPY Client/package.json ./Client/
COPY Server/package.json ./Server/

# Dev dependencies are needed: the build uses Vite and the server runs on tsx.
RUN yarn install --immutable

COPY . .

RUN yarn build

ENV NODE_ENV=production

# Cloud Run supplies PORT; this is the fallback.
EXPOSE 8080

CMD ["yarn", "tsx", "Server/index.ts"]
