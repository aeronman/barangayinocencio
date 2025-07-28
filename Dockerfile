# -------- BASE IMAGE --------
FROM php:8.2-fpm

# -------- SYSTEM DEPENDENCIES --------
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    gnupg2 ca-certificates lsb-release supervisor \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl bcmath

# -------- COMPOSER INSTALL --------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# -------- SET WORKDIR --------
WORKDIR /var/www

# -------- COPY APP FILES --------
COPY . .

# ✅ ✅ ✅ ADD THIS: Copy .env file
COPY .env .env

# -------- NODEJS + BUILD ASSETS --------
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# -------- COMPOSER DEPENDENCIES --------
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# -------- PERMISSIONS --------
RUN chown -R www-data:www-data /var/www && chmod -R 755 /var/www

# ✅ ✅ ✅ Ensure .env exists before Artisan commands
RUN php artisan key:generate && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# -------- SUPERVISOR --------
COPY ./supervisord.conf /etc/supervisord.conf

# -------- PORT --------
EXPOSE 80

# -------- START --------
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
