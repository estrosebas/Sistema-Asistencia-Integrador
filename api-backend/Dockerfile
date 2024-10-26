# Primera etapa: compilar el proyecto con Maven
FROM maven:3.8.4-openjdk-17 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de tu proyecto al contenedor
COPY . .

# Compila el proyecto usando Maven
RUN mvn clean package -DskipTests

# Segunda etapa: ejecutar el proyecto en una imagen ligera
FROM openjdk:17-jdk-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia el .jar compilado de la primera etapa al contenedor
COPY --from=build /app/target/apis-0.0.1-SNAPSHOT.jar app.jar

# Expone el puerto de la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
