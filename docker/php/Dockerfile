FROM dunglas/frankenphp

# Install PHP extensions
RUN install-php-extensions \
    pdo_pgsql \
    redis \
    pcntl \
    bcmath \
    zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
# COPY . /app

WORKDIR /app
