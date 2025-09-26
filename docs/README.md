# UTTECAM API - Documentación Completa

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [API Endpoints](#api-endpoints)
5. [Base de Datos](#base-de-datos)
6. [Desarrollo](#desarrollo)
7. [Despliegue](#despliegue)
8. [Resolución de Problemas](#resolución-de-problemas)

## 📖 Descripción General

**UTTECAM API** es una API REST desarrollada con **Node.js**, **Express** y **TypeScript** para la gestión de contenidos textuales de la Universidad Tecnológica de Tecamachalco.

### Características Principales

- ✅ **CRUD completo** para gestión de textos
- ✅ **TypeScript** para mayor robustez y mantenibilidad
- ✅ **MySQL/MariaDB** como base de datos
- ✅ **Middleware de manejo de errores** centralizado
- ✅ **CORS** habilitado para aplicaciones frontend
- ✅ **Health Check** integrado
- ✅ **Compilación automática** para producción
- ✅ **Configuración mediante variables de entorno**

### Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Node.js | 16+ | Runtime JavaScript |
| Express | ^4.18.2 | Framework web |
| TypeScript | ^5.4.0 | Superset de JavaScript tipado |
| MySQL2 | ^3.9.7 | Conector de base de datos |
| CORS | ^2.8.5 | Habilitación de recursos cruzados |
| dotenv | ^16.4.5 | Gestión de variables de entorno |

## 🏗️ Arquitectura del Proyecto

```
BKUTTECAM/
├── src/
│   ├── app.ts              # Configuración de Express
│   ├── server.ts           # Punto de entrada del servidor
│   ├── config/
│   │   └── db.ts          # Configuración de base de datos
│   ├── controllers/
│   │   └── textoController.ts  # Lógica de controladores
│   ├── middleware/
│   │   └── errorHandler.ts     # Manejo centralizado de errores
│   ├── models/
│   │   └── textoModel.ts       # Modelos de datos
│   └── routes/
│       └── textos.ts          # Definición de rutas
├── dist/                   # Código compilado (generado)
├── docs/                   # Documentación
├── database_setup.sql      # Script de configuración de BD
├── package.json           # Dependencias y scripts
├── tsconfig.json          # Configuración TypeScript
├── app.js                 # Entrada para cPanel
└── .env.example          # Ejemplo de variables de entorno
```

### Patrón de Arquitectura

La aplicación sigue el patrón **MVC (Model-View-Controller)**:

- **Models** (`models/`): Interacción con la base de datos
- **Views**: Respuestas JSON (sin vistas tradicionales)
- **Controllers** (`controllers/`): Lógica de negocio
- **Routes** (`routes/`): Definición de endpoints
- **Middleware** (`middleware/`): Procesamiento intermedio

## ⚙️ Instalación y Configuración

### Prerrequisitos

- **Node.js** 16.x o superior
- **npm** o **yarn**
- **MySQL** o **MariaDB** 5.7+
- **Git** (opcional)

### Instalación Local

1. **Clonar o descargar** el proyecto:
```bash
git clone <repositorio>
cd BKUTTECAM
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=uttecam
DB_PORT=3306
PORT=3000
```

4. **Configurar base de datos**:
```bash
# Ejecutar script SQL en MySQL
mysql -u root -p < database_setup.sql
```

5. **Compilar TypeScript**:
```bash
npm run build
```

6. **Iniciar servidor**:
```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm start
```

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `DB_HOST` | Host de base de datos | localhost |
| `DB_USER` | Usuario de base de datos | root |
| `DB_PASSWORD` | Contraseña de base de datos | (vacío) |
| `DB_NAME` | Nombre de base de datos | uttecam |
| `DB_PORT` | Puerto de base de datos | 3306 |
| `PORT` | Puerto del servidor | 3000 |

## 🛠️ API Endpoints

### Base URL
```
http://localhost:3000
```

### Endpoints Disponibles

#### 1. **Información General**

**GET /** - Información de la API
```http
GET /
```

**Respuesta:**
```json
{
  "mensaje": "API UTTECAM operativa",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "textos": "/api/textos"
  }
}
```

#### 2. **Health Check**

**GET /health** - Estado del sistema
```http
GET /health
```

**Respuesta:**
```json
{
  "status": "OK",
  "timestamp": "2025-09-25T10:30:00.000Z",
  "uptime": 3600,
  "database": "connected"
}
```

#### 3. **Gestión de Textos**

##### **Listar todos los textos**
```http
GET /api/textos
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "contenido": "Bienvenido a la API de UTTECAM",
    "created_at": "2025-09-25T10:00:00.000Z",
    "updated_at": "2025-09-25T10:00:00.000Z"
  },
  {
    "id": 2,
    "contenido": "Este es un texto de ejemplo",
    "created_at": "2025-09-25T10:05:00.000Z",
    "updated_at": "2025-09-25T10:05:00.000Z"
  }
]
```

##### **Obtener texto por ID**
```http
GET /api/textos/{id}
```

**Parámetros:**
- `id` (number): ID del texto

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "contenido": "Bienvenido a la API de UTTECAM",
  "created_at": "2025-09-25T10:00:00.000Z",
  "updated_at": "2025-09-25T10:00:00.000Z"
}
```

**Respuesta error (404):**
```json
{
  "error": "No encontrado"
}
```

##### **Crear nuevo texto**
```http
POST /api/textos
```

**Body (JSON):**
```json
{
  "contenido": "Nuevo texto para la API"
}
```

**Respuesta (201):**
```json
{
  "id": 3,
  "contenido": "Nuevo texto para la API",
  "created_at": "2025-09-25T10:15:00.000Z",
  "updated_at": "2025-09-25T10:15:00.000Z"
}
```

##### **Actualizar texto**
```http
PUT /api/textos/{id}
```

**Parámetros:**
- `id` (number): ID del texto a actualizar

**Body (JSON):**
```json
{
  "contenido": "Texto actualizado"
}
```

**Respuesta (200):**
```json
{
  "id": 1,
  "contenido": "Texto actualizado"
}
```

##### **Eliminar texto**
```http
DELETE /api/textos/{id}
```

**Parámetros:**
- `id` (number): ID del texto a eliminar

**Respuesta (204):** Sin contenido

### Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 201 | Creado exitosamente |
| 204 | Sin contenido (eliminado) |
| 400 | Petición inválida |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

### Ejemplos con cURL

```bash
# Listar todos los textos
curl -X GET http://localhost:3000/api/textos

# Obtener texto por ID
curl -X GET http://localhost:3000/api/textos/1

# Crear nuevo texto
curl -X POST http://localhost:3000/api/textos \
  -H "Content-Type: application/json" \
  -d '{"contenido": "Mi nuevo texto"}'

# Actualizar texto
curl -X PUT http://localhost:3000/api/textos/1 \
  -H "Content-Type: application/json" \
  -d '{"contenido": "Texto modificado"}'

# Eliminar texto
curl -X DELETE http://localhost:3000/api/textos/1
```

## 🗄️ Base de Datos

### Esquema de Base de Datos

#### Tabla: `textos`

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | INT | Identificador único | PRIMARY KEY, AUTO_INCREMENT |
| `contenido` | TEXT | Contenido del texto | NOT NULL |
| `created_at` | TIMESTAMP | Fecha de creación | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | Fecha de actualización | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

#### Script SQL Completo

```sql
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS uttecam 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE uttecam;

-- Crear tabla textos
CREATE TABLE IF NOT EXISTS textos (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Configuración de Conexión

La aplicación utiliza **MySQL2** con pool de conexiones para mejor rendimiento:

```typescript
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'uttecam',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

## 💻 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Compilar TypeScript
npm run build

# Iniciar en producción
npm start

# Instalar dependencias
npm install

# Instalar dependencia de producción
npm install --save <paquete>

# Instalar dependencia de desarrollo
npm install --save-dev <paquete>
```

### Estructura de Desarrollo

#### **Agregar nueva funcionalidad**

1. **Modelo** (`src/models/`):
```typescript
// Ejemplo: usuarioModel.ts
export async function getAllUsuarios() {
  const [rows] = await pool.execute('SELECT * FROM usuarios');
  return rows;
}
```

2. **Controlador** (`src/controllers/`):
```typescript
// Ejemplo: usuarioController.ts
export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getAllUsuarios();
    res.json(data);
  } catch (e) { next(e); }
}
```

3. **Rutas** (`src/routes/`):
```typescript
// Ejemplo: usuarios.ts
import { Router } from 'express';
import { listar } from '../controllers/usuarioController';

const router = Router();
router.get('/', listar);
export default router;
```

4. **Registrar en app.ts**:
```typescript
import usuariosRouter from './routes/usuarios';
app.use('/api/usuarios', usuariosRouter);
```

### Convenciones de Código

- **Nombres de archivos**: camelCase (`textoController.ts`)
- **Funciones**: camelCase (`getAllTextos`)
- **Variables**: camelCase (`contenido`)
- **Constantes**: UPPER_CASE (`DB_HOST`)
- **Clases**: PascalCase (si aplica)

### Manejo de Errores

La aplicación utiliza middleware centralizado:

```typescript
// Middleware de error global
export function errorHandler(
  err: Error, 
  _req: Request, 
  res: Response, 
  _next: NextFunction
) {
  console.error('❌ Error:', err.message);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
}
```

## 🚀 Despliegue

### Despliegue en cPanel

#### Preparación de archivos

1. **Compilar aplicación**:
```bash
npm run build
```

2. **Archivos necesarios para subir**:
   - `package.json`
   - `dist/` (carpeta compilada)
   - `app.js` (entrada para cPanel)
   - `database_setup.sql`
   - `.env.example`

3. **Archivos a NO incluir**:
   - `node_modules/`
   - `src/`
   - `tsconfig.json`
   - `.env` (archivo real con credenciales)

#### Configuración en cPanel

1. **File Manager**:
   - Subir archivos a `public_html/api/` (o directorio deseado)
   - Extraer ZIP si es necesario

2. **Node.js Apps**:
   - Crear nueva aplicación
   - **Versión Node.js**: 16+ o más reciente
   - **Modo**: Production
   - **Directorio**: ruta donde subiste archivos
   - **Archivo inicio**: `app.js`
   - **URL**: tu dominio/subdominio

3. **Variables de entorno**:
   ```
   DB_HOST=localhost
   DB_USER=tu_usuario_cpanel
   DB_PASSWORD=tu_password_db
   DB_NAME=tu_db_name
   DB_PORT=3306
   ```

4. **Base de datos**:
   - **MySQL Databases** → Crear DB y usuario
   - **phpMyAdmin** → Importar `database_setup.sql`

5. **Instalar dependencias**:
   - En Node.js Apps → **"Run NPM Install"**

6. **Iniciar aplicación**:
   - **Restart** la aplicación

### Despliegue en otros servicios

#### Heroku
```bash
# Instalar Heroku CLI
npm install -g heroku

# Login y crear app
heroku login
heroku create tu-app-name

# Configurar variables
heroku config:set DB_HOST=tu-host DB_USER=tu-usuario DB_PASSWORD=tu-password

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### Railway/Render
1. Conectar repositorio Git
2. Configurar variables de entorno
3. Deploy automático desde main branch

### Variables de Entorno en Producción

```bash
# Ejemplo para producción
DB_HOST=tu-servidor-mysql.com
DB_USER=usuario_produccion
DB_PASSWORD=password_seguro_123
DB_NAME=uttecam_prod
DB_PORT=3306
PORT=3000
NODE_ENV=production
```

## 🔧 Resolución de Problemas

### Problemas Comunes

#### 1. **Error de conexión a base de datos**

**Síntoma:**
```
⚠️ Advertencia: No se pudo conectar a la base de datos
Error: ER_ACCESS_DENIED_ERROR: Access denied for user
```

**Solución:**
- Verificar credenciales en `.env`
- Confirmar que usuario tiene permisos
- Validar que base de datos existe
- Comprobar host y puerto

#### 2. **Puerto ocupado**

**Síntoma:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solución:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# O cambiar puerto en .env
PORT=3001
```

#### 3. **Errores de TypeScript**

**Síntoma:**
```
error TS2339: Property 'contenido' does not exist on type '{}'
```

**Solución:**
- Verificar tipos en interfaces
- Revisar imports/exports
- Compilar con `npm run build`

#### 4. **CORS errors en frontend**

**Síntoma:**
```
Access to fetch at 'http://localhost:3000' from origin 'http://localhost:3001' has been blocked by CORS policy
```

**Solución:**
```typescript
// En app.ts - configuración específica
app.use(cors({
  origin: ['http://localhost:3001', 'https://tu-frontend.com'],
  credentials: true
}));
```

#### 5. **Dependencias faltantes en producción**

**Síntoma:**
```
Error: Cannot find module 'express'
```

**Solución:**
- Verificar `package.json`
- Ejecutar `npm install` en servidor
- Confirmar que dependencias estén en `dependencies`, no `devDependencies`

### Logs y Debugging

#### Habilitar logs detallados
```typescript
// En config/db.ts
export const pool = mysql.createPool({
  // ... otras opciones
  debug: true, // Solo para desarrollo
});
```

#### Logs personalizados
```typescript
// Agregar logs en controladores
console.log('📝 Creando texto:', contenido);
console.log('🔍 Buscando texto ID:', id);
```

### Performance

#### Optimizaciones de base de datos
```sql
-- Agregar índices para búsquedas frecuentes
ALTER TABLE textos ADD INDEX idx_created_at (created_at);
ALTER TABLE textos ADD FULLTEXT INDEX idx_contenido (contenido);
```

#### Caché de respuestas (opcional)
```typescript
// Instalar: npm install node-cache
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutos

export async function getAllTextos() {
  const cacheKey = 'all_textos';
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const [rows] = await pool.execute('SELECT * FROM textos ORDER BY created_at DESC');
  cache.set(cacheKey, rows);
  return rows;
}
```

### Contacto y Soporte

Para soporte técnico o preguntas:

- **Desarrollador**: [Tu nombre/equipo]
- **Email**: [tu-email@uttecam.edu.mx]
- **Repositorio**: [URL del repositorio]
- **Documentación**: [URL de docs online]

---

**UTTECAM API v1.0.0** - Universidad Tecnológica de Tecamachalco  
*Documentación actualizada: Septiembre 2025*