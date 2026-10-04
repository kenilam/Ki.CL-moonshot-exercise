# The dev server's port, from .env; whatever already holds it is stopped first.
DEV_PORT := $(or $(shell grep -E '^PORT=' .env 2>/dev/null | cut -d= -f2),3300)

build:
	@echo ⌛ building...
	yarn run build
	@echo done

install:
	@echo ⌛ installing...
	yarn
	@echo done

lint:
	@echo ⌛ linting...
	yarn run lint
	@echo done

run:
	@scripts/free-port.sh $(DEV_PORT)
	@echo ⌛ running development...
	yarn run development

run.production:
	@scripts/free-port.sh $(DEV_PORT)
	@echo ⌛ running production...
	yarn run production

start:
	@echo ⌛ starting...
	@test -f .env || cp .env.template .env
	yarn install
	@$(MAKE) run

typecheck:
	@echo ⌛ type checking...
	yarn run typecheck
	@echo done

types:
	@echo ⌛ fetching remote types...
	yarn run types
	@echo done

run.server:
	@echo ⌛ running the server...
	yarn run server

test:
	@echo ⌛ testing...
	yarn run test
	@echo done

eval:
	@echo ⌛ running the eval against the model...
	yarn run eval
