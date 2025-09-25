-- Script de configuración de base de datos para UTTECAM API
-- Ejecuta este script en tu servidor MySQL/MariaDB

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS uttecam 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE uttecam;

-- Crear tabla textos
CREATE TABLE IF NOT EXISTS textos (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo (opcional)
INSERT INTO textos (contenido) VALUES 
('Bienvenido a la API de UTTECAM'),
('Este es un texto de ejemplo'),
('La Universidad Tecnológica de Tecamachalco es una institución de educación superior')
ON DUPLICATE KEY UPDATE contenido = VALUES(contenido);

-- Mostrar estructura de la tabla
DESCRIBE textos;

-- Mostrar datos insertados
SELECT * FROM textos;