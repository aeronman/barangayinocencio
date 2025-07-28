# -------- BASE IMAGE --------
FROM php:8.2-fpm

# -------- SYSTEM DEPENDENCIES --------
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    npm nodejs gnupg2 ca-certificates lsb-release \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl bcmath

# -------- COMPOSER INSTALL --------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# -------- SET WORKDIR --------
WORKDIR /var/www

# -------- COPY FILES --------
COPY . .

# -------- NODEJS INSTALL --------
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# -------- PERMISSIONS --------
RUN chown -R www-data:www-data /var/www && chmod -R 755 /var/www

# -------- ARTISAN SETUP --------
RUN cp .env.example .env && \
    php artisan key:generate

# -------- SUPERVISOR --------
RUN apt-get install -y supervisor
COPY ./supervisord.conf /etc/supervisord.conf

# -------- PORT --------
EXPOSE 80

# -------- START --------
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
