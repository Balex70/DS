SHELL := /bin/bash

# Include variales from .env file
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

### VARIABLES ###
DOCKER_WEB_CONTAINER=$(shell docker compose ps --quiet backend)
DOCKER_POSTGRES_CONTAINER=$(shell docker compose ps --quiet db)
DOCKER_FE_CONTAINER=$(shell docker compose ps --quiet frontend)

### DOCKER ###
# Docker compose command
DOCKER_COMPOSE=docker compose
DOCKER_COMPOSE_PROD = docker compose -f docker-compose.yml -f docker-compose.prod.yml
DOCKER_COMPOSE_CI=docker compose -f docker-compose.ci.yml
DOCKER_COMPOSE_KUBE=docker-compose --env-file frontend/.env.kube -f docker-compose.kube.yml # use docker compose in local

show-config:
	$(DOCKER_COMPOSE) config

build:
	$(DOCKER_COMPOSE) build

prod-build:
	$(DOCKER_COMPOSE_PROD) build

up:
	$(DOCKER_COMPOSE) up -d

prod-up:
	$(DOCKER_COMPOSE_PROD) up -d

stop:
	$(DOCKER_COMPOSE) stop

prod-stop:
	$(DOCKER_COMPOSE_PROD) stop

restart:
	$(DOCKER_COMPOSE) restart

container:
	$(DOCKER_COMPOSE) exec -u root -w /app backend /bin/bash
	
composer-install:
	$(DOCKER_COMPOSE) run --rm backend composer install

migrate:
	bin/artisan migrate

#LOGS
web-log:
#@echo $(DOCKER_WEB_CONTAINER)
	docker logs --follow $(DOCKER_WEB_CONTAINER)
	
postgres-log:
	docker logs --follow $(DOCKER_POSTGRES_CONTAINER)
	
nextjs-log:
	docker logs --tail 100 -f $(DOCKER_FE_CONTAINER)

# Target to run the backend in the background ('-l' -> Use a Login Shell to be able to use profile.d scripts)
sh-backend:
	$(DOCKER_COMPOSE) exec -u root -w /app backend /bin/bash

sh-cron:
	$(DOCKER_COMPOSE) exec -u root -w /app cron /bin/bash

sh-frontend:
	$(DOCKER_COMPOSE) exec frontend /bin/sh -l

sh-db:
	$(DOCKER_COMPOSE) exec db /bin/sh

clear-cache:
	# config:clear - clear the config cache
	# cache:clear - clear application cache
	# route:clear - clear route cache
	# view:clear - clear all compiled view files
	bin/artisan config:clear && \
	bin/artisan cache:clear && \
	bin/artisan route:clear && \
	bin/artisan view:clear

backend-test:
	bin/artisan test
	
testo:
	bin/artisan test /app/tests/Feature/Controllers/CategoryControllerTest.php

lint:
	$(DOCKER_COMPOSE) exec frontend /bin/sh -c "npm run lint"

type-check:
	$(DOCKER_COMPOSE) exec frontend /bin/sh -c "npm run type-check"

#################################################################
#####                   #kubernetes                         #####
#################################################################
RELEASE=ds

# KUBECTL START
kube-build:
	$(DOCKER_COMPOSE_KUBE) build --no-cache

create-namespace:
	@ bin/kctl create namespace $(KUBE_NAMESPACE)

backend-pod:
	@ export BACKEND_POD_NAME=$(shell bin/kctl get pods --template '{{range .items}}{{.metadata.name}}{{end}}' --selector=app=ds-backend); \
	if [ "$$BACKEND_POD_NAME" = "" ]; then echo "\e[1;31mBACKEND Pod not exist!\e[0m"; else bin/kctl exec -ti $$BACKEND_POD_NAME -- sh; fi

frontend-pod:
	@ export FRONTEND_POD_NAME=$(shell bin/kctl get pods --template '{{range .items}}{{.metadata.name}}{{end}}' --selector=app=ds-frontend); \
	if [ "$$FRONTEND_POD_NAME" = "" ]; then echo "\e[1;31mFRONTEND Pod not exist!\e[0m"; else bin/kctl exec -ti $$FRONTEND_POD_NAME -- sh; fi

queue-pod:
	@ export QUEUE_POD_NAME=$(shell bin/kctl get pods --template '{{range .items}}{{.metadata.name}}{{end}}' --selector=app=ds-queue); \
	if [ "$$QUEUE_POD_NAME" = "" ]; then echo "\e[1;31mQUEUE Pod not exist!\e[0m"; else bin/kctl exec -ti $$QUEUE_POD_NAME -- sh; fi

cron-pod:
	@ export CRON_POD_NAME=$(shell bin/kctl get pods --template '{{range .items}}{{.metadata.name}}{{end}}' --selector=app=ds-cron); \
	if [ "$$CRON_POD_NAME" = "" ]; then echo "\e[1;31mCRON Pod not exist!\e[0m"; else bin/kctl exec -ti $$CRON_POD_NAME -- sh; fi

# can be accessed without kubernetes running pods
sh-backend-image:
	docker run --rm -it --entrypoint sh localhost:32000/ds-backend:0.0.1

pods:
	@ bin/kctl get pods

port-forward:
	@ bin/kctl port-forward svc/$(RELEASE)-frontend-service 3000:3000

port-db-forward:
	@ bin/kctl port-forward svc/$(RELEASE)-db 5432:5432

describe-backend:
	@ bin/kctl describe pod $(RELEASE)-backend

describe-frontend:
	@ bin/kctl describe pod $(RELEASE)-frontend

describe-db:
	@ bin/kctl describe pod $(RELEASE)-db

describe-redis:
	@ bin/kctl describe pod $(RELEASE)-redis

describe-queue:
	@ bin/kctl describe pod $(RELEASE)-queue

describe-cron:
	@ bin/kctl describe pod $(RELEASE)-cron

describe-migration:
	@ bin/kctl describe pod $(RELEASE)-migration

describe-be-secrets:
	@bin/kctl describe secret $(RELEASE)-be-secrets

describe-fe-secrets:
	@bin/kctl describe secret $(RELEASE)-fe-secret

describe-backend-service:
	@ bin/kctl describe services $(RELEASE)-backend-service

describe-frontend-service:
	@ bin/kctl describe services $(RELEASE)-frontend-service

describe-ingress:
	@ bin/kctl describe ingress $(RELEASE)-ingress

describe-cert:
	@ bin/kctl describe certificate $(RELEASE)-certificate-secret

describe-challenge:
	@ bin/kctl describe challenge $(RELEASE)-certificate-secret

kube-namespaces:
	@ bin/kctl get namespaces

get-services:
	@ bin/kctl get svc

get-pv:
	@ bin/kctl get pv

get-pvc:
	@ bin/kctl get pvc

get-all:
	@ echo "~~~~~~~~~~~~ PODS ~~~~~~~~~~~~"
	@ bin/kctl get pods
	@ echo "~~~~~~~~~~~~ SERVICES ~~~~~~~~~~~~"
	@ bin/kctl get svc
# 	@ echo "~~~~~~~~~~~~ PV ~~~~~~~~~~~~"
# 	@ bin/kctl get pv
	@ echo "~~~~~~~~~~~~ PVC ~~~~~~~~~~~~"
	@ bin/kctl get pvc
	@ echo "~~~~~~~~~~~~ JOBS ~~~~~~~~~~~~"
	@ bin/kctl get jobs
	@ echo "~~~~~~~~~~~~ INGRESS ~~~~~~~~~~~~"
	@ bin/kctl get ingress
	@ echo "~~~~~~~~~~~~ CERTIFICATE ~~~~~~~~~~~~"
	@ bin/kctl get certificate
	@ echo "~~~~~~~~~~~~ SECRETS ~~~~~~~~~~~~"
	@ bin/kctl get secrets

svc-backend:
	@ bin/kctl get svc $(RELEASE)-backend-service -o yaml

svc-frontend:
	@ bin/kctl get svc $(RELEASE)-frontend-service -o yaml

svc-db:
	@ bin/kctl get svc $(RELEASE)-db -o yaml

svc-redis:
	@ bin/kctl get svc $(RELEASE)-redis -o yaml

log-backend:
	@ export BACKEND_POD_NAME=$(shell bin/kctl get pods --template '{{range .items}}{{.metadata.name}}{{end}}' --selector=app=ds-backend); \
	bin/kctl logs -f $$BACKEND_POD_NAME

log-frontend:
	@ export FRONTEND_POD_NAME=$(shell bin/kctl get pods --template '{{range .items}}{{.metadata.name}}{{end}}' --selector=app=ds-frontend); \
	bin/kctl logs -f $$FRONTEND_POD_NAME

log-cron:
	@ export CRON_POD_NAME=$(shell bin/kctl get pods --selector=app=$(RELEASE)-cron -o jsonpath='{.items[0].metadata.name}'); \
	if [ "$$CRON_POD_NAME" = "" ]; then echo "\e[1;31mCRON Pod does not exist!\e[0m"; else bin/kctl logs -f $$CRON_POD_NAME; fi

log-cron-previous:
	@ export CRON_POD_NAME=$(shell bin/kctl get pods --selector=app=$(RELEASE)-cron -o jsonpath='{.items[0].metadata.name}'); \
	if [ "$$CRON_POD_NAME" = "" ]; then echo "\e[1;31mCRON Pod does not exist!\e[0m"; else bin/kctl logs $$CRON_POD_NAME --previous; fi

get-jobs:
	@ bin/kctl get jobs

delete-migration-job:
	@ bin/kctl delete job $(RELEASE)-migration

# just to help create command in cli
get-log:
	@ bin/kctl logs $(RELEASE)-migration-d4sxv

get-secrets:
	@ bin/kctl get secrets

get-ingress:
	@ bin/kctl get ingress

get-cert:
	@ bin/kctl get certificate

create-be-env-secrets:
	@ bin/kctl create secret generic $(RELEASE)-be-secrets --from-env-file=backend/.env.kube --dry-run=client -o yaml | bin/kctl apply -f -

create-fe-env-secrets:
	@ bin/kctl create secret generic $(RELEASE)-fe-secrets --from-env-file=frontend/.env.kube --dry-run=client -o yaml | bin/kctl apply -f -
# KUBECTL END

# HELM START
helm-prod-down:
	@ bin/helm uninstall $(RELEASE)
	@ bin/kctl delete secret $(RELEASE)-be-secrets --ignore-not-found
	@ bin/kctl delete secret $(RELEASE)-fe-secrets --ignore-not-found

helm-prod-up: create-be-env-secrets create-fe-env-secrets
	@ bin/helm install $(RELEASE) ./helm -f ./helm/values-prod.yaml

helm-local-down:
	@ bin/helm uninstall $(RELEASE)
	@ bin/kctl delete secret $(RELEASE)-be-secrets --ignore-not-found
	@ bin/kctl delete secret $(RELEASE)-fe-secrets --ignore-not-found

helm-local-up: create-be-env-secrets create-fe-env-secrets
	@ bin/helm install $(RELEASE) ./helm -f ./helm/values-local.yaml

helm-get-releases:
	@ bin/helm list

# create-be-env-secrets create-fe-env-secrets should be put like that, so they run and finish before upgrade
helm-prod-upgrade: create-be-env-secrets create-fe-env-secrets
	@ bin/helm upgrade $(RELEASE) ./helm -f ./helm/values-prod.yaml --atomic --wait --timeout 5m
# 	@ bin/kctl rollout restart deployment/$(RELEASE)-backend
# 	@ bin/kctl rollout restart deployment/$(RELEASE)-frontend
# 	@ bin/kctl rollout restart deployment/$(RELEASE)-db
# 	@ bin/kctl rollout restart deployment/$(RELEASE)-queue
# 	@ bin/kctl rollout restart deployment/$(RELEASE)-cron

# create-be-env-secrets create-fe-env-secrets should be put like that, so they run and finish before upgrade
helm-local-upgrade: create-be-env-secrets create-fe-env-secrets
	@ bin/helm upgrade $(RELEASE) ./helm -f ./helm/values-local.yaml --atomic --wait --timeout 5m
# 	@ bin/kctl rollout restart deployment/$(RELEASE)-backend
# 	@ bin/kctl rollout restart deployment/$(RELEASE)-frontend
# 	@ bin/kctl rollout restart deployment/$(RELEASE)-db
# 	@ bin/kctl rollout restart deployment/$(RELEASE)-queue
# 	@ bin/kctl rollout restart deployment/$(RELEASE)-cron

helm-namespaces:
	@ bin/helm list -A

helm-history:
	@ bin/helm history $(RELEASE)

helm-debug:
	@ bin/helm template ./helm --debug

helm-debug-local:
	@ bin/helm template ./helm --debug -f ./helm/values-local.yaml

helm-debug-prod:
	@ bin/helm template ./helm --debug -f ./helm/values-prod.yaml
# HELM END
