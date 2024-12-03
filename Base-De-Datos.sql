-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bd_sistema_asistencia
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `asiste`
--

DROP TABLE IF EXISTS `asiste`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asiste` (
  `ID_Usuario` bigint DEFAULT NULL,
  `ID_Evento` bigint DEFAULT NULL,
  KEY `asiste_ibfk_1` (`ID_Usuario`),
  KEY `asiste_ibfk_2` (`ID_Evento`),
  CONSTRAINT `asiste_ibfk_1` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`id`),
  CONSTRAINT `asiste_ibfk_2` FOREIGN KEY (`ID_Evento`) REFERENCES `evento` (`ID_Evento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asiste`
--

LOCK TABLES `asiste` WRITE;
/*!40000 ALTER TABLE `asiste` DISABLE KEYS */;
INSERT INTO `asiste` VALUES (1,14),(3,15),(5,44),(5,48),(7,48),(2,44),(2,48);
/*!40000 ALTER TABLE `asiste` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento`
--

DROP TABLE IF EXISTS `evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento` (
  `ID_Evento` bigint NOT NULL AUTO_INCREMENT,
  `NombreEvento` varchar(255) DEFAULT NULL,
  `Capacidad` int DEFAULT NULL,
  `Descripcion` text,
  `FechaHoraEntrada` datetime DEFAULT NULL,
  `FechaHoraSalida` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_Evento`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento`
--

LOCK TABLES `evento` WRITE;
/*!40000 ALTER TABLE `evento` DISABLE KEYS */;
INSERT INTO `evento` VALUES (14,'Evento de Prueba',100,'Descripción del evento','2024-12-01 10:00:00','2024-12-01 18:00:00'),(15,'Evento de Prueba 03',50,'Descripción del evento','2024-12-01 10:00:00','2024-12-01 12:00:00'),(44,'Casino',4,'fgdfg','2024-11-30 01:00:00','2024-11-30 02:00:00'),(48,'Chocolatada',4,'xf','2024-12-02 10:01:00','2024-12-02 11:00:00');
/*!40000 ALTER TABLE `evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genera`
--

DROP TABLE IF EXISTS `genera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genera` (
  `ID_Reporte` bigint DEFAULT NULL,
  `ID_Registro` bigint DEFAULT NULL,
  KEY `genera_ibfk_1` (`ID_Reporte`),
  KEY `genera_ibfk_2` (`ID_Registro`),
  CONSTRAINT `genera_ibfk_1` FOREIGN KEY (`ID_Reporte`) REFERENCES `reporte_asistencia` (`ID_Reporte`),
  CONSTRAINT `genera_ibfk_2` FOREIGN KEY (`ID_Registro`) REFERENCES `registro_asistencia` (`ID_Registro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genera`
--

LOCK TABLES `genera` WRITE;
/*!40000 ALTER TABLE `genera` DISABLE KEYS */;
/*!40000 ALTER TABLE `genera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registro_asistencia`
--

DROP TABLE IF EXISTS `registro_asistencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registro_asistencia` (
  `ID_Registro` bigint NOT NULL AUTO_INCREMENT,
  `Estado` varchar(50) DEFAULT NULL,
  `FechaRegistro` datetime DEFAULT NULL,
  `ID_Evento` bigint DEFAULT NULL,
  `ID_Usuario` bigint DEFAULT NULL,
  PRIMARY KEY (`ID_Registro`),
  KEY `ID_Evento` (`ID_Evento`),
  CONSTRAINT `registro_asistencia_ibfk_1` FOREIGN KEY (`ID_Evento`) REFERENCES `evento` (`ID_Evento`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registro_asistencia`
--

LOCK TABLES `registro_asistencia` WRITE;
/*!40000 ALTER TABLE `registro_asistencia` DISABLE KEYS */;
INSERT INTO `registro_asistencia` VALUES (49,'falta','2024-12-01 21:56:58',44,7),(50,'falta','2024-12-01 21:57:39',48,2),(51,'falta','2024-12-01 22:02:05',44,7),(52,'falta','2024-12-01 22:02:27',48,2);
/*!40000 ALTER TABLE `registro_asistencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reporte_asistencia`
--

DROP TABLE IF EXISTS `reporte_asistencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reporte_asistencia` (
  `ID_Reporte` bigint NOT NULL AUTO_INCREMENT,
  `Tipo` varchar(50) DEFAULT NULL,
  `FechaReporte` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_Reporte`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reporte_asistencia`
--

LOCK TABLES `reporte_asistencia` WRITE;
/*!40000 ALTER TABLE `reporte_asistencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `reporte_asistencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nom_rol` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Administrador'),(2,'Usuario'),(3,'Gerente');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ape_materno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ape_paterno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dni` bigint DEFAULT NULL,
  `domicilio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fech_nacimiento` datetime(6) DEFAULT NULL,
  `genero` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Pérez','García',12345678,'Av. Libertad 123','juan.perez@example.com','1995-05-15 00:00:00.000000','Masculino','Juan','hashed_password1',987654321),(2,'Martínez','López',87654321,'Calle San Martín 456','maria.martinez@example.com','1990-08-20 00:00:00.000000','Femenino','María','hashed_password2',123456789),(3,'Gómez','Rodríguez',11223344,'Jr. Amazonas 789','luis.gomez@example.com','1988-03-30 00:00:00.000000','Masculino','Luis','hashed_password3',321654987),(4,'Gonzales','Gomez',72084190,'Valcarcel 209','estrosebas@gmail.com','2005-05-16 00:00:00.000000','Masculino','Diego','Estro123',962233318),(5,'AdminMaterno','AdminPaterno',111,'AdminDomicilio','admin@gmail.com','2001-01-01 00:00:00.000000','masculino','NameAdmin','admin',222),(6,'ManagerMaterno','ManagerPaterno',333,'ManagerDomicilio','manager@gmail.com','2002-02-02 00:00:00.000000','femenino','NameManager','manager',444),(7,'UserMaterno','UserPaterno',555,'UserDomicilio','user@gmail.com','2003-03-03 00:00:00.000000','otro','NameUser','user',666),(8,'xd','xd',66,'xd','xd@g.com','2006-06-06 00:00:00.000000','masculino','xd','xd',99);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_roles`
--

DROP TABLE IF EXISTS `usuarios_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_roles` (
  `usuario_id` bigint NOT NULL,
  `rol_id` bigint NOT NULL,
  KEY `FK6yxg1lhuv5nievqea7rvn6afm` (`rol_id`),
  KEY `FKebiaxjbamgu326glxo1fbysuh` (`usuario_id`),
  CONSTRAINT `FK6yxg1lhuv5nievqea7rvn6afm` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id`),
  CONSTRAINT `FKebiaxjbamgu326glxo1fbysuh` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_roles`
--

LOCK TABLES `usuarios_roles` WRITE;
/*!40000 ALTER TABLE `usuarios_roles` DISABLE KEYS */;
INSERT INTO `usuarios_roles` VALUES (1,1),(2,2),(3,3),(4,1),(5,1),(6,3),(7,2),(8,1);
/*!40000 ALTER TABLE `usuarios_roles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-01 22:10:39
