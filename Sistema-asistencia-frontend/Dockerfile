# Dockerfile
FROM node:14 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código del proyecto
COPY . .

# Crea un archivo .env en tiempo de construcción
RUN echo "VITE_API_URL=http://localhost:3000" > .env

# Compila la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Elimina la configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/

# Copia los archivos compilados
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]