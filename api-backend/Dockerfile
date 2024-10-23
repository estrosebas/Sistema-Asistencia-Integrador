# Usa una imagen base de Java para la ejecución
FROM openjdk:17-jdk-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo .jar de tu proyecto al contenedor
COPY /target/apis-0.0.1-SNAPSHOT.jar app.jar

# Expone el puerto de la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
