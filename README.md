# UTTECAM API con Sequelize 🚀

API CRUD para gestión de textos de la Universidad Tecnológica de Tecamachalco, ahora implementada con **Sequelize ORM**.

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
git clone <tu-repositorio>
cd BKUTTECAM
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

## 📡 Endpoints de la API

### Textos CRUD

| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| GET | `/api/textos` | Listar textos con paginación | `page`, `limit`, `search` |
| GET | `/api/textos/stats` | Estadísticas de textos | - |
| GET | `/api/textos/:id` | Obtener texto por ID | `id` |
| POST | `/api/textos` | Crear nuevo texto | `contenido` |
| PUT | `/api/textos/:id` | Actualizar texto | `id`, `contenido` |
| DELETE | `/api/textos/:id` | Eliminar texto | `id` |

### Ejemplos de uso

#### Listar textos con paginación
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
src/
├── config/
│   ├── database.ts          # Configuración Sequelize
│   ├── syncDatabase.ts      # Sincronización y seeds
│   ├── db.backup.ts         # Configuración MySQL anterior
├── models/
│   ├── Texto.ts             # Modelo Sequelize
│   ├── textoModel.backup.ts # Modelo MySQL anterior
├── controllers/
│   └── textoController.ts   # Controladores con Sequelize
├── routes/
│   └── textos.ts           # Definición de rutas
├── middleware/
│   └── errorHandler.ts     # Manejo de errores
├── app.ts                  # Configuración Express
└── server.ts              # Punto de entrada
```

## 🔧 Scripts Disponibles

```bash
npm run dev        # Desarrollo con auto-recarga
npm run build      # Compilar TypeScript
npm start          # Ejecutar en producción
npm run db:reset   # Resetear BD con datos de prueba
npm run db:seed    # Insertar datos de ejemplo
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

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit tus cambios: `git commit -m 'Añadir nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

**Universidad Tecnológica de Tecamachalco** 🎓