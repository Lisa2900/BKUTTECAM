# UTTECAM API con Sequelize 🚀

API CRUD para gestión de contenido de la Universidad Tecnológica de Tecamachalco, implementada con **Sequelize ORM**, **TypeScript** y **Express**.

---

## 📚 Documentación Completa

> 📑 **[Ver Índice Completo de Documentación →](./docs/INDEX.md)** - Guía detallada de todos los documentos disponibles

| Documento | Descripción |
|-----------|-------------|
| **[API Reference](./docs/API_REFERENCE.md)** | 📖 Documentación completa de todos los endpoints (Textos, Directorios, Nosotros) |
| **[Architecture Guide](./docs/ARCHITECTURE.md)** | 🏗️ Arquitectura del sistema, flujo de datos y diagramas técnicos |
| **[Installation Guide](./docs/INSTALLATION.md)** | ⚙️ Guía detallada de instalación paso a paso |
| **[Development Guide](./docs/DEVELOPMENT.md)** | 💻 Guía para desarrollo local y estructura del proyecto |
| **[Deployment Guide](./docs/DEPLOYMENT.md)** | 🚀 Opciones de despliegue (cPanel, VPS, Cloud) |
| **[cPanel Deployment](./docs/CPANEL_DEPLOYMENT.md)** | 🌐 Guía específica para deployment en cPanel |
| **[Images Upload Guide](./docs/IMAGENES_UPLOAD.md)** | 📸 Sistema de manejo de imágenes y uploads |
| **[Changelog](./CHANGELOG.md)** | 📝 Historial de versiones y cambios del proyecto |

---

## ✨ Características

- ✅ **TypeScript** - Tipado estático para mayor seguridad
- ✅ **Sequelize ORM** - Abstracción de base de datos moderna
- ✅ **Validaciones automáticas** - A nivel de modelo
- ✅ **Paginación integrada** - Con metadatos de paginación
- ✅ **Búsqueda de texto** - Filtrado por contenido
- ✅ **Estadísticas en tiempo real** - Dashboard de métricas
- ✅ **Manejo de errores** - Respuestas consistentes
- ✅ **Timestamps automáticos** - created_at y updated_at
- ✅ **Índices optimizados** - Para mejor rendimiento

## 🚀 Instalación y Configuración

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/Lisa2900/BKUTTECAM.git
cd BKUTTECAM
git checkout version-estable
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env` y configura:

```env
# Base de datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=uttecam
DB_USER=root
DB_PASSWORD=tu_password

# Servidor
PORT=3000
NODE_ENV=development
```

### 3. Crear base de datos MySQL

```sql
CREATE DATABASE uttecam CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Ejecutar el proyecto

```bash
# Desarrollo (con auto-recarga)
npm run dev

# Producción
npm run build
npm start
```

## 📡 Módulos de la API

La API cuenta con **3 módulos principales**:

### 1️⃣ Textos
Gestión de contenido textual general.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/textos` | Listar textos con paginación y búsqueda |
| GET | `/api/textos/stats` | Estadísticas de textos |
| GET | `/api/textos/:id` | Obtener texto por ID |
| POST | `/api/textos` | Crear nuevo texto |
| PUT | `/api/textos/:id` | Actualizar texto |
| DELETE | `/api/textos/:id` | Eliminar texto |

### 2️⃣ Directorios
Gestión del directorio de personal y estructura organizacional.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/directorios` | Listar todos los directorios |
| GET | `/api/directorios/:id` | Obtener directorio por ID |
| POST | `/api/directorios` | Crear directorio (con imagen) |
| PUT | `/api/directorios/:id` | Actualizar directorio (con imagen) |
| DELETE | `/api/directorios/:id` | Eliminar directorio |

### 3️⃣ Nosotros
Gestión de contenido institucional (visión, misión, valores, historia).

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/nosotros/contenido` | Listar todo el contenido institucional |
| GET | `/api/nosotros/contenido/:id` | Obtener contenido por ID |
| GET | `/api/nosotros/contenido/tipo/:tipo` | Obtener contenido por tipo |
| POST | `/api/nosotros/contenido` | Crear contenido (con imagen) |
| PUT | `/api/nosotros/contenido/:id` | Actualizar contenido (con imagen) |
| DELETE | `/api/nosotros/contenido/:id` | Eliminar contenido |

📖 **[Ver documentación completa de endpoints →](./docs/API_REFERENCE.md)**

---

## 💡 Ejemplos de Uso Rápido

### Textos - Listar con paginación

#### Textos - Listar con paginación
```http
GET /api/textos?page=1&limit=5
```

**Respuesta:**
```json
{
  "textos": [
    {
      "id": 1,
      "contenido": "Bienvenido a UTTECAM",
      "createdAt": "2025-09-26T18:00:00.000Z",
      "updatedAt": "2025-09-26T18:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 15,
    "itemsPerPage": 5
  }
}
```

#### Buscar textos
```http
GET /api/textos?search=universidad
```

#### Estadísticas
```http
GET /api/textos/stats
```

**Respuesta:**
```json
{
  "totalTextos": 25,
  "textosHoy": 3,
  "ultimoTexto": {
    "id": 25,
    "contenido": "Última entrada registrada...",
    "createdAt": "2025-09-26T18:00:00.000Z"
  }
}
```

#### Crear texto
```http
POST /api/textos
Content-Type: application/json

{
  "contenido": "Nuevo texto para la universidad"
}
```

**Respuesta:**
```json
{
  "message": "Texto creado exitosamente",
  "texto": {
    "id": 26,
    "contenido": "Nuevo texto para la universidad",
    "createdAt": "2025-09-26T18:00:00.000Z",
    "updatedAt": "2025-09-26T18:00:00.000Z"
  }
}
```

## 🗄️ Base de Datos con Sequelize

### Modelo Texto

```typescript
interface TextoAttributes {
  id: number;
  contenido: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Validaciones automáticas
- ✅ Contenido no vacío
- ✅ Longitud entre 1 y 5000 caracteres
- ✅ Timestamps automáticos
- ✅ Índices optimizados

### Comandos de base de datos

```bash
# Resetear base de datos con datos de prueba
npm run db:reset

# Insertar solo datos de prueba
npm run db:seed
```

## 🛠️ Arquitectura del Proyecto

```
BKUTTECAM/
├── 📁 backup/              # Archivos de respaldo
│   ├── db.backup.ts        # Configuración MySQL anterior
│   ├── textoModel.backup.ts # Modelo MySQL anterior
│   └── README_old.md       # Documentación anterior
├── 📁 docs/                # Documentación API
├── 📁 src/                 # Código fuente TypeScript
│   ├── config/
│   │   ├── database.ts     # Configuración Sequelize
│   │   └── syncDatabase.ts # Sincronización y seeds
│   ├── models/
│   │   └── Texto.ts        # Modelo Sequelize
│   ├── controllers/
│   │   └── textoController.ts # Controladores con Sequelize
│   ├── routes/
│   │   └── textos.ts       # Definición de rutas
│   ├── middleware/
│   │   └── errorHandler.ts # Manejo de errores
│   ├── app.ts              # Configuración Express
│   └── server.ts           # Punto de entrada
├── 📄 README.md            # Documentación principal
├── 📄 DEVELOPMENT.md       # Guía de desarrollo
├── 📄 package.json         # Dependencias y scripts
├── 📄 tsconfig.json        # Configuración TypeScript
├── 📄 .env.example         # Plantilla variables entorno
└── 📄 .gitignore          # Archivos excluidos de git
```

## 🔧 Scripts Disponibles

```bash
npm run dev        # Desarrollo con auto-recarga
npm run build      # Limpiar y compilar TypeScript
npm run start      # Ejecutar en producción
npm run clean      # Limpiar archivos compilados
npm run db:reset   # Resetear BD con datos de prueba
npm run db:seed    # Insertar datos de ejemplo
npm run lint       # Linter (configurar próximamente)
npm run test       # Tests (configurar próximamente)
```

## 🚦 Ventajas de Sequelize

### ✅ Desarrollo más rápido
- **ORM completo** - Abstrae consultas SQL complejas
- **Migraciones automáticas** - Control de versiones de BD
- **Validaciones integradas** - A nivel de modelo
- **Relaciones fáciles** - Para futuras expansiones

### ✅ Mejor mantenimiento
- **Tipado TypeScript** - Autocompletado y detección de errores
- **Hooks automáticos** - Ejecutar código antes/después de operaciones
- **Transacciones** - Para operaciones complejas
- **Pooling de conexiones** - Mejor rendimiento

### ✅ Funciones avanzadas implementadas
- **Paginación nativa** - Con `findAndCountAll`
- **Búsqueda con LIKE** - Filtrado de texto
- **Agregaciones** - Conteos y estadísticas
- **Índices automáticos** - Optimización de consultas

## 🔮 Próximas mejoras sugeridas

- [ ] **Autenticación JWT** - Sistema de usuarios
- [ ] **Roles y permisos** - Control de acceso
- [ ] **Categorías de textos** - Clasificación
- [ ] **Historial de cambios** - Auditoría
- [ ] **API de archivos** - Subida de documentos
- [ ] **Cache con Redis** - Mejor rendimiento
- [ ] **Tests unitarios** - Con Jest y Supertest
- [ ] **Documentación Swagger** - API docs automática

## 📚 Tecnologías utilizadas

- **Node.js** - Runtime de JavaScript
- **TypeScript** - Lenguaje tipado
- **Express.js** - Framework web
- **Sequelize** - ORM para bases de datos
- **MySQL** - Base de datos relacional
- **dotenv** - Variables de entorno
- **CORS** - Intercambio de recursos

## 🔗 Enlaces importantes

- **Repositorio GitHub:** https://github.com/Lisa2900/BKUTTECAM
- **Rama principal:** `version-estable` (con Sequelize)
- **Ramas disponibles:** `master`, `typescript-version`, `version-estable`
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md) - Historial de versiones y cambios

## 📋 Estado del proyecto

### ✅ **Completado:**
- ✅ Implementación completa de Sequelize ORM
- ✅ API CRUD funcional con paginación y búsqueda
- ✅ Validaciones automáticas y manejo de errores
- ✅ Estadísticas en tiempo real
- ✅ Documentación completa
- ✅ Estructura de proyecto limpia y organizada
- ✅ Scripts de utilidad para desarrollo

### 🚧 **En desarrollo futuro:**
- [ ] Sistema de autenticación
- [ ] Tests unitarios y de integración
- [ ] Documentación Swagger/OpenAPI
- [ ] Docker para containerización
- [ ] CI/CD con GitHub Actions

## 🛡️ Requisitos del sistema

- **Node.js:** >= 16.0.0
- **MySQL:** >= 8.0
- **npm:** >= 8.0.0

## 🤝 Contribuir

1. Haz fork del proyecto
2. Clona tu fork: `git clone https://github.com/TU_USUARIO/BKUTTECAM.git`
3. Cambia a la rama de desarrollo: `git checkout version-estable`
4. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
5. Commit tus cambios: `git commit -m 'Añadir nueva funcionalidad'`
6. Push a la rama: `git push origin feature/nueva-funcionalidad`
7. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Universidad Tecnológica de Tecamachalco** 🎓  
**Desarrollado con ❤️ y TypeScript**