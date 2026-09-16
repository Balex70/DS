# DropShipping Project

Readme for DropShipping project built with Laravel and Next.js. The application integrates with external product suppliers, provides a multilingual storefront, and uses Kubernetes for containerized deployment.

## Technology Stack
### Backend
 - PHP 8.x — Backend programming language.
 - Laravel — REST API, business logic, authentication, and application framework.
 - Laravel Octane + FrankenPHP — High-performance application server.
 - Laravel Sanctum — Cookie-based authentication and CSRF protection.
 - Spatie Laravel Permission — Role and permission management.
 - PHPUnit — Automated backend testing.
 
### Frontend
 - TypeScript — Type-safe application development.
 - Next.js (App Router) — React framework for the storefront and administration interface.
 - React — UI component development.
 - Tailwind CSS — Utility-first CSS framework.
 - shadcn/ui — Reusable UI components.
 - TanStack Query — Client-side data fetching and server-state management.
 - next-intl — Internationalization and multilingual routing.
 - Lucide React — Icons.

### Database and Infrastructure
 - PostgreSQL — Relational database.
 - Redis — Caching, queues, and background-job support.
 - Docker — Containerization and local development.
 - Kubernetes — Container orchestration and deployment.
 - Helm — Kubernetes application packaging and release management.
 - MicroK8s — Kubernetes distribution used for deployment.
 - Nginx Ingress — HTTP routing and reverse proxy.
 - cert-manager — TLS certificate management.
 
### Integrations and Services
 - CJdropshipping API — Product sourcing, product data, and supplier integration.
 - Ollama — Local AI model execution.
 - Local AI worker — Product enrichment and translation.
 - LiqPay — Payment gateway integrations.
 - Stripe and WayForPay - Coming soon
 
### Architecture
The application consists of several services:

 - Frontend: Next.js application for the storefront and administration interface.
 - Backend: Laravel REST API responsible for business logic, authentication, products, orders, and integrations.
 - Database: PostgreSQL for persistent application data.
 - Cache and queues: Redis for caching and background jobs.
 - AI worker: Local AI service for product content generation and translation.
 - Infrastructure: Docker containers deployed to Kubernetes using Helm.

### Main Features
 - Product catalog with categories, variants, images, and supplier integration.
 - Product synchronization with CJdropshipping.
 - AI-assisted product descriptions and translations.
 - Multilingual storefront with English and Ukrainian locales. (more to come)
 - Currency support for USD and UAH.
 - Shopping cart and guest checkout.
 - Order management and payment gateway integrations.
 - Role-based administration.
 - SEO-friendly product and category pages.
 - Containerized local development and production deployment.
 
### Planned Features
The platform is actively being developed, with more features planned for future releases:

 - Social authentication — Customer registration and login using Google and Facebook.
 - Multilingual search — Search across products using localized titles and descriptions.
 - Additional payment gateways — Stripe, WayForPay, and other payment providers.
 - More currencies — Support for additional currencies beyond USD and UAH.

## Local development
Develop in docker

- `make up` (`make build` optionally)
- `make restart` (but better use `make stop` and `make up`)
- `make stop`
- `make dev`

### Migration/seeding
##### Create Migration:
- `make sh-backend`
- `php artisan make:migration create_some_table_table  --table=some_table`
##### Run any migrations that have not yet been run:
- `make sh-backend`
- `php artisan migrate`
##### Roll back the last batch of migrations:
- `make sh`
- `php artisan migrate:rollback`
- `php artisan migrate:rollback --step=5`
##### Seeding:
- `make sh-backend`
- `php artisan db:seed`

##### Useful commands:
 - `make sh-backend` - enter backend container
 - `make sh-frontend` - enter frontend container
 - `make sh-cron` - enter cron container
 - `make sh-db` - enter db container
 - `make sh-backend` > `php artisan storage:link` - make storage link
 - `make clear-cache` - clear cache for Laravel
 - `make laravel-log` - check laravel logs
 - `make backend-log` - check logs for backend container (not laravel logs)
 - `make postgres-log` - check logs for postgres container (not database logs itself)
 - `make nextjs-log` - check logs for nextjs
 
### Testing
- `make backend-test` - run backend tests
- `make testo` - run backend tests for separate test file
- `make lint` - run lint check
- `make type-check` - run type check for frontend

### CI environment
- `make ci-up-build` - build and start the project
- `make ci-up` - start ci containers
- `make ci-migrate` - run migrations
- `make ci-lint` - run eslint
- `make ci-test` - run tests
- `make ci-type-check` - run frontend type check
- `make ci-test-npm-build` - run npm build
- `make ci-down` - down ci containers
- `make ci-stop` - stop ci containers
- `make ci-backend-sh` - enter backend-ci container
- `make ci-frontend-sh` - enter frontend-ci container

## Local kubernetes
### Prepare and build
 - create .env from .env.example (kube related variables)
 - create ./backend/.env.kube from ./backend/.env.kube.example
 - create ./frontend/.env.kube from ./frontend/.env.kube.example
 - `make create-namespace` - create namespace for project (.env variables)
 - `make kube-build` - build images for kubernetes using docker-compose.kube.yaml

### Tag images
 - check/update helm/Chart.yaml, use tag when tag and push images
 - docker tag bachynskyialex/ds-backend:x.x.x localhost:32000/ds-backend:x.x.x
 - docker tag bachynskyialex/ds-frontend:x.x.x localhost:32000/ds-frontend:x.x.x

### Push images to local registry
 - docker push localhost:32000/ds-backend:x.x.x
 - docker push localhost:32000/ds-frontend:x.x.x

### Start/Operate
 - `make helm-local-up` - start installation using helm/kubernetes
 - `make helm-local-upgrade` - upgrade / roll new revision
 - `make delete-migration-job` - delete failed migration that can break future releases
 - `make helm-local-down`- stop/down installation
 - `backend-pod` > `php artisan db:seed` - seed if needed

### Useful commands
 - `make get-all` - get all necessary pods, services, and other components of kubernetes
 - `make describe-backend` - describe backend pod
 - `make describe-frontend` - describe frontend pod
 - `make describe-<pod_name>` - describe any pod name
 - `make get-pv` - get all Persistence volumes
 - `make log-backend` - check logs for backend pod
 - `make log-laravel` - check Laravel logs
 - `make log-frontend` - check logs for frontend pod
 - `make helm-history` - get history of releases
 - `make helm-get-release` - get release details
 - `make helm-rollback` - rollback helm revision to previous (be careful, its not rollback database)
 - `make helm-namespaces` - get all namespaces
 - `make helm-debug-local` - debug local helm configs

### Certificate related commands
 - `make describe-ingress` - describe ingress pod
 - `make describe-cert` - describe certificate
 - `make describe-challenge` - describe certificate

## Deploy using kubernetes
 - Create release branch from dev branch release/x.x.x
 - When releasing change version (appVersion) in helm/Chart.yaml
 - Commit change
 - Push new branch to repo
 - Create pull request and merge to main branch
 - Check actions in github repo run CD successfully
 - If success CD and testing, merge release branch to dev
 
## Backup and restore
### Backup Strategy
Project uses an automated PostgreSQL backup strategy implemented with Kubernetes CronJobs. The PostgreSQL database continues to run as a Kubernetes Deployment with persistent volume storage. The backup CronJob operates independently of the database deployment. The backup process runs as a Kubernetes CronJob and stores backups in separate directories: /backups/daily, /backups/weekly, /backups/monthly

##### Backup Retention:
 - Daily backups	7 days
 - Weekly backups (Sunday)	5 weeks
 - Monthly backups (1st day of the month)	12 months

### Database Backups
 - Database: PostgreSQL.
 - Backup method: pg_dump executed using the PostgreSQL Docker image.
 - Compression: Backups are compressed using gzip to reduce storage usage.
 - Storage: Backups are saved to a dedicated directory on the Kubernetes node using hostPath storage.
 - Scheduling: Daily backups are created at 03:00.

### Restore from Backups
##### Drop database:
```
bin/kctl exec -it deploy/ds-db -- \
    psql -U <DB_USERNAME> -d postgres \
    -c "DROP DATABASE <DB_DATABASE> WITH (FORCE);"
```

##### Create database:
```
bin/kctl exec -it deploy/ds-db -- \
    psql -U <DB_USERNAME> -d postgres \
    -c "CREATE DATABASE <DB_DATABASE>;"
```

##### import dump into database:
```
gunzip -c ./db-backups/<dump_name>.sql.gz \
    | bin/kctl exec -i deploy/ds-db -- \
        psql -U "<DB_USERNAME>" -d "<DB_DATABASE>"
```

## AI
### AI texts
##### Prepare and build
 - `cd /var/www/ds_texts`
 - `.env` - for local development
 - `.env.kube.local` - for local kubernetes
 - `.env.kube.prod` - for production
 - `make build` - build for local development
 - `make build-local` - build for local kubernetes
 - `make build-prod` - build for production
 - `make up` - start containers for local development
 - `make up-local` - start for local kubernetes
 - `make up-prod` - start for production

##### Generate product texts commands
 - `make product` - generate texts for product local development
 - `make product-local` - generate texts for product local kubernetes
 - `make product-prod` - generate texts for product for production

##### Generate product variants texts commands
 - `make variant` - generate texts for product variants on local development
 - `make variant-local` - generate texts for product variant on local kubernetes
 - `make variant-prod` - generate texts for product variant for production

### AI translations
##### Prepare and build
 - `cd /var/www/ds_translate`
 - `.env` - for local development
 - `.env.kube.local` - for local kubernetes
 - `.env.kube.prod` - for production
 - `make build` - build for local development
 - `make build-local` - build for local kubernetes
 - `make build-prod` - build for production
 - `make up` - start containers for local development
 - `make up-local` - start for local kubernetes
 - `make up-prod` - start for production

##### Generate product translations commands
 - `make product` - generate translations for product local development
 - `make product-local` - generate translations for product local kubernetes
 - `make product-prod` - generate translations for product for production

##### Generate product variants translations commands
 - `make variant` - generate translations for product variants on local development
 - `make variant-local` - generate translations for product variant on local kubernetes
 - `make variant-prod` - generate translations for product variant for production
