FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zip unzip curl git \
    supervisor \
    nginx \
    default-mysql-client \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer files and install deps
COPY composer.json composer.lock ./ 
RUN composer install --no-dev --optimize-autoloader

# Copy the rest of the project
COPY . .

# Build frontend assets (optional, only if using Vite or similar)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# Set permissions
RUN chown -R www-data:www-data /var/www

# Cache Laravel configuration
RUN php artisan config:clear && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Copy nginx config
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy supervisor config
COPY supervisord.conf /etc/supervisord.conf

# Expose HTTP port
EXPOSE 80

# Start all services via supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
