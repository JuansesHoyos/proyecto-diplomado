# Etapa 1: Construcción de la aplicación Angular
FROM node:18 AS build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package.json package-lock.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto del código fuente de la aplicación al contenedor
COPY . .

# Construye la aplicación Angular en modo producción
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copia el archivo index.html y los demás archivos generados directamente al directorio de Nginx
COPY --from=build /app/dist/front-proyecto-final/browser /usr/share/nginx/html

# Expone el puerto 80 para acceder a la aplicación
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]