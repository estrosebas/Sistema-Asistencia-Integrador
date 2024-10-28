# 📊 Proyecto: Avance de Desarrollo

## Descripción
Sistema Asistencia Integrador es una aplicación diseñada para gestionar y asistir en el manejo de asistencia de usuarios. Este proyecto utiliza una arquitectura de frontend-backend y se despliega mediante Docker para simplificar su instalación y ejecución.


## Casos de Uso
<p align="center"><img src=image.jpeg></p>

## 👥 Integrantes del Equipo

- **Cristofer Torres Castillo**
- **Cristian Huaracha Venturas**
- **Winston Apaza Mamani**
- **Diego Sebastian Gonzales Gomez**

---

## 📈 Distribución de la Participación

Cada integrante del equipo ha contribuido de manera igualitaria en las tareas y el desarrollo del proyecto. El porcentaje de participación para cada miembro es el siguiente:

| Integrante                     | %   | Contribucion                                            |
| ------------------------------ | --- | ------------------------------------------------------- |
| Cristofer Torres Castillo      | 25% | Vista principal e implementacion de packetes en backend |
| Cristian Huaracha Venturas     | 25% | Vista del login y administrador                         |
| Winston Apaza Mamani           | 25% | Vista del formulario de registro de usuario             |
| Diego Sebastian Gonzales Gomez | 25% | Backend login y registro de usuario                     |

---

## 🚀 Estado Actual del Proyecto

El proyecto se encuentra en proceso, con avances significativos en las siguientes áreas:

- Desarrollo de interfaces graficas responsivas
- Desarrollo de lector de QR
- Desarrollo de login y registro de usuario

¡Pronto compartiremos más detalles sobre nuestro progreso!

---

## ✅ Requisitos Previos

Asegúrate de tener los siguientes programas instalados en tu sistema:

- [Docker](https://www.docker.com/) - para la virtualización y despliegue de contenedores. 🐋
- [Maven](https://maven.apache.org/) - para la gestión de dependencias y compilación del backend. 🍂
- [Node.js](https://nodejs.org/) y [npm](https://www.npmjs.com/) - para el manejo de paquetes del frontend. 🍃

## 💾 Instalación

Sigue los siguientes pasos para instalar y configurar el proyecto:

### Instalación de Paquetes del Frontend

1. Dirígete a la carpeta del frontend:
   ```
     cd ./Sistema-Asistencia-Integrador/Sistema-asistencia
   ```
  
2. Instala los paquetes necesarios:

  ``` 
    npm install
  ```
Compila y ejecuta el proyecto en modo de desarrollo:

  ```
    npm run build
    npm run dev
  ```

2. Configuración del Backend
Ve a la carpeta del backend:

  ```
    cd ./Sistema-Asistencia-Integrador/api-backend
  ```
Compila y empaqueta el proyecto sin ejecutar las pruebas:
  ```
    mvn clean package -DskipTests
  ```

3. Levantar el Proyecto con Docker
Regresa a la carpeta raíz del proyecto:
  ```
    cd ./Sistema-Asistencia-Integrador
  ```

Ejecuta el siguiente comando para construir y ejecutar los contenedores:

  ```
    docker-compose up --build
  ```
Con el comando anterior, el sistema levantará tanto el backend como el frontend del proyecto. Una vez que se haya completado la carga de los contenedores puede ingresar al program Docker Desktop o desde la terminal lavantar el contenedor "Sistema-Asistencia-Integrador".

---

## 🔗 Contacto

Para cualquier consulta o colaboración, no dudes en ponerte en contacto con nosotros a través de nuestros correos electrónicos o plataformas académicas.

---

> **Nota:** Este proyecto es el resultado del esfuerzo colaborativo y el compromiso de todos los miembros del equipo. Continuaremos trabajando para alcanzar los objetivos establecidos en los plazos acordados.
