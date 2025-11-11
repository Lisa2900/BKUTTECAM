-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-10-2025 a las 21:15:36
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `utt`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `directorios`
--

CREATE TABLE `directorios` (
  `id` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `extension` varchar(10) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `directorios`
--

INSERT INTO `directorios` (`id`, `titulo`, `nombre`, `telefono`, `extension`, `correo`, `imagen`) VALUES
(1, 'Secretaría de Vinculación', 'Mtro. Daniel Huerta Conde', '2494223300', '120', 'vinculacion@uttecam.edu.mx', 'Organigrama/secretarioVinculacion.png'),
(2, 'Encargado de Secretaría Académica', 'Mtro. Carlos Islas Contreras', '2494223300', '135', 'secretariaacademica@uttecam.edu.mx', 'Organigrama/secretariaAcademica.png'),
(3, 'Encargado del Área de Abogado General', 'Mtro. Eleazar Carrillo Camacho', '2494223300', '142', 'abogadogeneral@uttecam.edu.mx', 'Organigrama/AbogadoGeneral.png'),
(4, 'Encargado del Área de Contraloría Interna', 'Abg. Alain Eloy Álvarez Sánchez', '2494223300', '110', 'contraloria@uttecam.edu.mx', 'Organigrama/contraloriaInterna.png'),
(5, 'Dirección y administración y Finanzas', 'Lic. Rodrigo Hernández Aguilar', '2494223300', '115', 'direccionfinanzas@uttecam.edu.mx', 'Organigrama/admin_finanzas.png'),
(6, 'Extensión Universitaria', 'Mtra. Verónica Elizabeth Centeno Fórtiz', '2494223300', '153', 'extensionuniversitaria@uttecam.edu.mx', 'Organigrama/enc_extend_universitaria.png');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `directorios`
--
ALTER TABLE `directorios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `directorios`
--
ALTER TABLE `directorios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
