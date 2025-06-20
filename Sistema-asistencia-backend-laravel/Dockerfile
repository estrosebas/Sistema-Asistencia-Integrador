FROM php:8.2-apache

# Instala extensiones necesarias
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev zip unzip git curl \
    && docker-php-ext-install pdo pdo_mysql mbstring bcmath

# Habilita mod_rewrite
RUN a2enmod rewrite

# Copia el proyecto
COPY . /var/www/html

# Establece el directorio de trabajo
WORKDIR /var/www/html

# Instala Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Instala dependencias de Laravel
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Asegura que storage y cache existen
RUN mkdir -p storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# Da permisos necesarios
RUN chmod -R 775 storage bootstrap/cache

nixpacks_build_cmd=composer install && npm install --production && php artisan optimize && php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan migrate --force  
# El CMD por defecto de apache ya inicia el servidor en el puerto 80
