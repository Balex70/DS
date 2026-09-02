FROM dunglas/frankenphp as base

# Install PHP extensions
RUN install-php-extensions \
    pdo_pgsql \
    redis \
    pcntl \
    bcmath \
    zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY backend/ /app/

FROM base AS production

RUN composer install --no-dev --optimize-autoloader

# Create Laravel writable directories (needed for kubernetes in particular)
RUN mkdir -p \
    storage/logs \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views

# Create public storage symlink
RUN php artisan storage:link

FROM base AS ci

RUN composer install

RUN mkdir -p \
    storage/logs \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views

# Create public storage symlink
RUN php artisan storage:link
