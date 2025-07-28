# Build stage (Node/Vite)
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# PHP + Composer stage
FROM php:8.2-fpm-alpine as backend

# Install PHP extensions
RUN apk add --no-cache \
    bash \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    libzip-dev \
    unzip \
    nginx \
    supervisor \
    freetype-dev \
    oniguruma-dev \
    icu-dev \
    zlib-dev \
    libxml2-dev \
    mysql-client \
    && docker-php-ext-install pdo pdo_mysql zip intl bcmath

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY --from=build /app /var/www

RUN composer install --optimize-autoloader --no-dev

# Laravel permissions
RUN chown -R www-data:www-data /var/www \
 && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["sh", "-c", "php-fpm & nginx -g 'daemon off;'"]
