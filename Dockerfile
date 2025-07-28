# -------- BASE IMAGE --------
FROM php:8.2-fpm

# -------- SYSTEM DEPENDENCIES --------
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    gnupg2 ca-certificates lsb-release supervisor nginx \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl bcmath

# -------- COMPOSER INSTALL --------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# -------- SET WORKDIR --------
WORKDIR /var/www

# -------- COPY APP FILES --------
COPY . .

# ✅ Copy .env if you committed it. Otherwise, Render env vars will be passed dynamically.
COPY .env .env

# -------- NODEJS + BUILD ASSETS --------
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# -------- COMPOSER DEPENDENCIES --------
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# -------- PERMISSIONS --------
RUN chown -R www-data:www-data /var/www && chmod -R 755 /var/www

# ✅ Run Laravel setup commands (fail gracefully if .env is missing)
RUN php artisan config:clear || true && \
    php artisan key:generate || true && \
    php artisan config:cache || true && \
    php artisan route:cache || true && \
    php artisan view:cache || true

# -------- NGINX CONFIG --------
COPY ./nginx.conf /etc/nginx/sites-available/default

# -------- SUPERVISOR CONFIG --------
COPY ./supervisord.conf /etc/supervisord.conf

# -------- PORT --------
ENV PORT 10000
EXPOSE 10000

# -------- START --------
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
