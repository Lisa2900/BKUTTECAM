# UTTECAM API

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

API REST desarrollada con **Express.js** y **TypeScript** para el manejo de textos en UTTECAM.

## 📋 Características

- ✅ CRUD completo para la tabla `textos`
- ✅ Arquitectura modular y escalable
- ✅ TypeScript para mayor seguridad de tipos
- ✅ Middleware de manejo de errores
- ✅ Validación de datos
- ✅ Configuración flexible con variables de entorno

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **TypeScript** - Superset de JavaScript con tipado estático
- **MySQL2** - Cliente de MySQL para Node.js
- **CORS** - Middleware para habilitar CORS
- **dotenv** - Gestión de variables de entorno

## 📦 Instalación

### Prerrequisitos

- Node.js (v16 o superior)
- MySQL/MariaDB
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd BKUTTECAM
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   Edita el archivo `.env` con tus credenciales de base de datos.

4. **Configurar la base de datos**
   
   Ejecuta el script incluido en tu servidor MySQL/MariaDB:
   ```bash
   mysql -u root -p < database_setup.sql
   ```
   
   O ejecuta manualmente:
   ```sql
   CREATE DATABASE IF NOT EXISTS uttecam;
   USE uttecam;
   
   CREATE TABLE IF NOT EXISTS textos (
       id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
       contenido TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## 📍 API Endpoints

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `GET` | `/` | Información de la API | - |
| `GET` | `/health` | Estado del servidor y BD | - |
| `GET` | `/api/textos` | Obtener todos los textos | - |
| `GET` | `/api/textos/:id` | Obtener un texto por ID | - |
| `POST` | `/api/textos` | Crear un nuevo texto | `{ "contenido": "string" }` |
| `PUT` | `/api/textos/:id` | Actualizar un texto | `{ "contenido": "string" }` |
| `DELETE` | `/api/textos/:id` | Eliminar un texto | - |

### Ejemplos de uso

#### Crear un texto
```bash
curl -X POST http://localhost:3000/api/textos \
  -H "Content-Type: application/json" \
  -d '{"contenido": "Mi nuevo texto"}'
```

#### Obtener todos los textos
```bash
curl http://localhost:3000/api/textos
```

## ⚙️ Configuración

### Variables de entorno (.env)

```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=uttecam
DB_PORT=3306

# Servidor
PORT=3000
NODE_ENV=development
```

## 📁 Estructura del proyecto

```
BKUTTECAM/
├── src/
│   ├── config/         # Configuración de base de datos
│   ├── controllers/    # Controladores de la aplicación
│   ├── middleware/     # Middlewares personalizados
│   ├── models/         # Modelos de datos
│   ├── routes/         # Definición de rutas
│   ├── app.ts         # Configuración de Express
│   └── server.ts      # Punto de entrada de la aplicación
├── .env.example       # Ejemplo de variables de entorno
├── .gitignore         # Archivos ignorados por Git
├── package.json       # Dependencias y scripts
├── tsconfig.json      # Configuración de TypeScript
└── README.md          # Este archivo
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 🏫 UTTECAM

Desarrollado para la Universidad Tecnológica de Tecamachalco (UTTECAM).

### Despliegue en cPanel
1. Ejecutar `npm run build` local o en el servidor.
2. Startup file: `dist/server.js`.
3. Definir variables de entorno en el panel (DB_*, PORT opcional).
4. Asegurar que la versión Node soporta ES2020.

### Notas
- Conexión pool MySQL (mysql2/promise).
- Manejo centralizado de errores y 404.
- Validar que la tabla tenga PRIMARY KEY y AUTO_INCREMENT.

### Licencia
ISC