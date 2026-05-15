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
DOCKER_COMPOSE_KUBE=docker-compose -f docker-compose.kube.yml # use docker compose in local

build:
	$(DOCKER_COMPOSE) build

up:
	$(DOCKER_COMPOSE) up -d
	
stop:
	$(DOCKER_COMPOSE) stop

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
