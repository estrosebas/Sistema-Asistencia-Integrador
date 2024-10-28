-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 28-10-2024 a las 01:00:15
-- Versión del servidor: 8.0.40
-- Versión de PHP: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_sistema_asistencia`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asiste`
--

CREATE TABLE `asiste` (
  `ID_Usuario` bigint DEFAULT NULL,
  `ID_Evento` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evento`
--

CREATE TABLE `evento` (
  `ID_Evento` bigint NOT NULL,
  `NombreEvento` varchar(255) DEFAULT NULL,
  `FechaEvento` datetime DEFAULT NULL,
  `Capacidad` int DEFAULT NULL,
  `Descripcion` text,
  `FechaHoraEntrada` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `genera`
--

CREATE TABLE `genera` (
  `ID_Reporte` bigint DEFAULT NULL,
  `ID_Registro` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_asistencia`
--

CREATE TABLE `registro_asistencia` (
  `ID_Registro` bigint NOT NULL,
  `Estado` varchar(50) DEFAULT NULL,
  `FechaRegistro` datetime DEFAULT NULL,
  `ID_Evento` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reporte_asistencia`
--

CREATE TABLE `reporte_asistencia` (
  `ID_Reporte` bigint NOT NULL,
  `Tipo` varchar(50) DEFAULT NULL,
  `FechaReporte` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id` bigint NOT NULL,
  `nom_rol` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id`, `nom_rol`) VALUES
(1, 'Administrador'),
(2, 'Usuario'),
(3, 'Gerente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` bigint NOT NULL,
  `ape_materno` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ape_paterno` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dni` bigint DEFAULT NULL,
  `domicilio` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fech_nacimiento` datetime(6) DEFAULT NULL,
  `genero` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `ape_materno`, `ape_paterno`, `dni`, `domicilio`, `email`, `fech_nacimiento`, `genero`, `nombre`, `password`, `telefono`) VALUES
(1, 'Pérez', 'García', 12345678, 'Av. Libertad 123', 'juan.perez@example.com', '1995-05-15 00:00:00.000000', 'Masculino', 'Juan', 'hashed_password1', 987654321),
(2, 'Martínez', 'López', 87654321, 'Calle San Martín 456', 'maria.martinez@example.com', '1990-08-20 00:00:00.000000', 'Femenino', 'María', 'hashed_password2', 123456789),
(3, 'Gómez', 'Rodríguez', 11223344, 'Jr. Amazonas 789', 'luis.gomez@example.com', '1988-03-30 00:00:00.000000', 'Masculino', 'Luis', 'hashed_password3', 321654987),
(4, 'Gonzales', 'Gomez', 72084190, 'Valcarcel 209', 'estrosebas@gmail.com', '2005-05-16 00:00:00.000000', 'Masculino', 'Diego', 'Estro123', 962233318),
(5, NULL, NULL, NULL, NULL, 'usuario2@example.com', NULL, NULL, NULL, 'tuContraseñaSegura', NULL),
(6, NULL, NULL, NULL, NULL, 'usuariowaad2@example.com', NULL, NULL, NULL, 'tuContraseñaSegura', NULL),
(7, NULL, NULL, NULL, NULL, 'parenkimacorrelona@example.com', NULL, NULL, NULL, 'tuContraseñaSegura', NULL),
(8, NULL, NULL, 12345678, 'Calle Ejemplo 123', 'TodoEsCulpaDeWasa@example.com', NULL, 'Masculino', NULL, 'Usuario', 987654321),
(9, NULL, NULL, 72084190, 'valcarcel 209', 'sebasestro90@gmail.com', NULL, 'masculino', NULL, 'Estro123', 962233318);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_roles`
--

CREATE TABLE `usuarios_roles` (
  `usuario_id` bigint NOT NULL,
  `rol_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios_roles`
--

INSERT INTO `usuarios_roles` (`usuario_id`, `rol_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 1),
(9, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asiste`
--
ALTER TABLE `asiste`
  ADD KEY `ID_Usuario` (`ID_Usuario`),
  ADD KEY `ID_Evento` (`ID_Evento`);

--
-- Indices de la tabla `evento`
--
ALTER TABLE `evento`
  ADD PRIMARY KEY (`ID_Evento`);

--
-- Indices de la tabla `genera`
--
ALTER TABLE `genera`
  ADD KEY `ID_Reporte` (`ID_Reporte`),
  ADD KEY `ID_Registro` (`ID_Registro`);

--
-- Indices de la tabla `registro_asistencia`
--
ALTER TABLE `registro_asistencia`
  ADD PRIMARY KEY (`ID_Registro`),
  ADD KEY `ID_Evento` (`ID_Evento`);

--
-- Indices de la tabla `reporte_asistencia`
--
ALTER TABLE `reporte_asistencia`
  ADD PRIMARY KEY (`ID_Reporte`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK5171l57faosmj8myawaucatdw` (`email`);

--
-- Indices de la tabla `usuarios_roles`
--
ALTER TABLE `usuarios_roles`
  ADD KEY `FK6yxg1lhuv5nievqea7rvn6afm` (`rol_id`),
  ADD KEY `FKebiaxjbamgu326glxo1fbysuh` (`usuario_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `evento`
--
ALTER TABLE `evento`
  MODIFY `ID_Evento` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `registro_asistencia`
--
ALTER TABLE `registro_asistencia`
  MODIFY `ID_Registro` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reporte_asistencia`
--
ALTER TABLE `reporte_asistencia`
  MODIFY `ID_Reporte` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asiste`
--
ALTER TABLE `asiste`
  ADD CONSTRAINT `asiste_ibfk_1` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `asiste_ibfk_2` FOREIGN KEY (`ID_Evento`) REFERENCES `evento` (`ID_Evento`);

--
-- Filtros para la tabla `genera`
--
ALTER TABLE `genera`
  ADD CONSTRAINT `genera_ibfk_1` FOREIGN KEY (`ID_Reporte`) REFERENCES `reporte_asistencia` (`ID_Reporte`),
  ADD CONSTRAINT `genera_ibfk_2` FOREIGN KEY (`ID_Registro`) REFERENCES `registro_asistencia` (`ID_Registro`);

--
-- Filtros para la tabla `registro_asistencia`
--
ALTER TABLE `registro_asistencia`
  ADD CONSTRAINT `registro_asistencia_ibfk_1` FOREIGN KEY (`ID_Evento`) REFERENCES `evento` (`ID_Evento`);

--
-- Filtros para la tabla `usuarios_roles`
--
ALTER TABLE `usuarios_roles`
  ADD CONSTRAINT `FK6yxg1lhuv5nievqea7rvn6afm` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id`),
  ADD CONSTRAINT `FKebiaxjbamgu326glxo1fbysuh` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
