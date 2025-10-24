# 🔄 Cambios Realizados: Eliminación de numero_referencia

**Fecha:** Octubre 20, 2025  
**Versión:** 2.1.0

---

## ✅ Archivos Modificados

### 1. **Modelo: `src/models/Solicitud_Constancia.ts`**
   - ❌ Eliminado campo `numero_referencia` del interface
   - ❌ Eliminado propiedad pública `numero_referencia`
   - ❌ Eliminada definición del campo en el modelo Sequelize
   - ❌ Eliminado índice `idx_numero_referencia`

### 2. **Controlador: `src/controllers/solicitudConstanciaController.ts`**
   - ❌ Eliminada función `generateReferenceNumber()`
   - ❌ Eliminada función completa `getSolicitudByReferencia()`
   - ❌ Eliminada generación y verificación de número de referencia en `crearSolicitud()`
   - ✏️ Actualizada respuesta de `crearSolicitud()` para usar ID en lugar de numero_referencia
   - ❌ Eliminado `numero_referencia` de respuestas de error en `crearSolicitud()`
   - ❌ Eliminado `numero_referencia` de logs de seguridad
   - ❌ Eliminado case `'numero_referencia'` en función `buscarSolicitudes()`
   - ❌ Eliminado `numero_referencia` del array de búsqueda "todos"
   - ✏️ Actualizado comentario de campos de búsqueda

### 3. **Rutas: `src/routes/solicitudConstancia.ts`**
   - ❌ Eliminada importación de `getSolicitudByReferencia`
   - ❌ Eliminada ruta `GET /referencia/:referencia`
   - ❌ Eliminada validación `validateReferencia`
   - ✏️ Actualizada validación de búsqueda: eliminado `'numero_referencia'` de opciones válidas

### 4. **SQL: `sql/solicitudes_constancias_kardex.sql`**
   - ❌ Eliminada definición de columna `numero_referencia VARCHAR(100) NOT NULL UNIQUE`
   - ❌ Eliminado índice `idx_solicitudes_numero_referencia`

### 5. **Migración: `sql/migration_remove_numero_referencia.sql`** (NUEVO)
   - ✅ Script de migración creado para eliminar columna de BD existente
   - ✅ Incluye eliminación de índice
   - ✅ Incluye verificación de cambios

---

## 🔄 Cambios Funcionales

### Antes:
- Las solicitudes tenían un `numero_referencia` único generado automáticamente (ej: `SCK-ABC123-XYZ45`)
- Los usuarios podían consultar por número de referencia: `GET /api/solicitudes/referencia/:referencia`
- Búsquedas podían filtrar por numero_referencia

### Ahora:
- Las solicitudes usan su `id` para seguimiento
- **Eliminada** la ruta de consulta por referencia
- Las búsquedas NO pueden filtrar por numero_referencia
- La respuesta de creación muestra: `"seguimiento": "Use el ID de solicitud X para dar seguimiento"`

---

## 📝 Rutas Afectadas

### ❌ Eliminadas:
```
GET /api/solicitudes/referencia/:referencia
```

### ✅ Siguen Disponibles:
```
GET /api/solicitudes                    - Listar todas (con filtros)
GET /api/solicitudes/:id                - Obtener por ID
GET /api/solicitudes/matricula/:matricula - Obtener por matrícula
POST /api/solicitudes                   - Crear nueva solicitud
PUT /api/solicitudes/:id/estado         - Actualizar estado
DELETE /api/solicitudes/:id             - Eliminar (admin)
GET /api/solicitudes/stats              - Estadísticas
GET /api/solicitudes/buscar             - Búsqueda avanzada
```

---

## 🔍 Campos de Búsqueda Actualizados

### Antes:
```typescript
campo: 'nombre' | 'matricula' | 'correo' | 'carrera' | 'numero_referencia' | 'todos'
```

### Ahora:
```typescript
campo: 'nombre' | 'matricula' | 'correo' | 'carrera' | 'todos'
```

---

## 🗄️ Migración de Base de Datos

### Ejecutar en la Base de Datos:

```bash
mysql -u usuario -p uttecam_dev < sql/migration_remove_numero_referencia.sql
```

O manualmente:

```sql
-- Eliminar índice
DROP INDEX IF EXISTS idx_solicitudes_numero_referencia;

-- Eliminar columna
ALTER TABLE solicitudes_constancias_kardex 
DROP COLUMN IF EXISTS numero_referencia;
```

---

## ⚠️ Importante: Datos Existentes

Si ya tienes solicitudes en tu base de datos:
- ✅ Los datos existentes **NO se perderán**
- ✅ Solo se eliminará la columna `numero_referencia`
- ✅ Todos los demás campos se mantienen intactos
- ⚠️ **No se puede deshacer fácilmente** - haz backup antes de migrar

---

## 📊 Resumen de Impacto

| Categoría | Cambios |
|-----------|---------|
| Archivos TypeScript | 3 modificados |
| Archivos SQL | 2 modificados (1 nuevo) |
| Funciones eliminadas | 2 |
| Rutas eliminadas | 1 |
| Validaciones modificadas | 1 |
| Índices de BD eliminados | 1 |
| Campos de modelo eliminados | 1 |

---

## ✅ Checklist de Despliegue

- [ ] Actualizar código en el servidor
- [ ] Ejecutar migración SQL
- [ ] Verificar que no hay errores en logs
- [ ] Probar creación de solicitudes
- [ ] Probar búsqueda de solicitudes
- [ ] Verificar que consultas por ID funcionen
- [ ] Actualizar documentación de API si es necesario
- [ ] Notificar a usuarios sobre el cambio (si aplica)

---

## 🔗 Archivos para Revisar

1. `src/models/Solicitud_Constancia.ts`
2. `src/controllers/solicitudConstanciaController.ts`
3. `src/routes/solicitudConstancia.ts`
4. `sql/solicitudes_constancias_kardex.sql`
5. `sql/migration_remove_numero_referencia.sql`

---

**Cambios completados exitosamente** ✅
