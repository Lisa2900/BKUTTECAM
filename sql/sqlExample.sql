CREATE TABLE nosotros_contenido (
  'id' int(11) NOT NULL,
  'tipo' enum('vision','mision','valores','politica_integral','objetivo_integral','politica_igualdad') NOT NULL,
  'titulo' varchar(255) NOT NULL,
  'descripcion' text DEFAULT NULL,
  'imagen' varchar(255) DEFAULT NULL,
  'lista' longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(lista)),
  'fecha_creacion' timestamp NOT NULL DEFAULT current_timestamp(),
  'fecha_actualizacion' timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;