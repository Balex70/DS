SHELL := /bin/bash

# Include variales from .env file
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

### VARIABLES ###
DOCKER_WEB_CONTAINER=$(shell docker compose ps --quiet web)
DOCKER_POSTGRES_CONTAINER=$(shell docker compose ps --quiet postgres)

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
	
container:
	$(DOCKER_COMPOSE) exec -u root -w /app backend /bin/bash
	
#LOGS
web-log:
#@echo $(DOCKER_WEB_CONTAINER)
	docker logs --follow $(DOCKER_WEB_CONTAINER)
	
postgres-log:
	docker logs --follow $(DOCKER_POSTGRES_CONTAINER)
	
# Target to run the backend in the background ('-l' -> Use a Login Shell to be able to use profile.d scripts)
sh:
	$(DOCKER_COMPOSE) exec -u root -w /app backend /bin/bash
	
sh-db:
	$(DOCKER_COMPOSE) exec db /bin/sh
