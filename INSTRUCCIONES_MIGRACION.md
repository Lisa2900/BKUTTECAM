# 🚀 Instrucciones de Migración - Eliminar numero_referencia

## Opción 1: Usando MySQL Workbench (Recomendado)

1. Abre **MySQL Workbench**
2. Conéctate a tu base de datos `uttecam_dev`
3. Abre el archivo `sql/migration_remove_numero_referencia.sql`
4. Ejecuta el script completo
5. Verifica los cambios en la tabla

---

## Opción 2: Usando línea de comandos

### Windows (CMD o PowerShell):

```powershell
# Navega a la carpeta de MySQL
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"

# Ejecuta la migración
.\mysql.exe -u root -p uttecam_dev < "C:\Users\lisan\Documents\Pagina UTT\BKUTTECAM\sql\migration_remove_numero_referencia.sql"
```

### Linux/Mac:

```bash
# Ejecuta la migración
mysql -u root -p uttecam_dev < sql/migration_remove_numero_referencia.sql
```

---

## Opción 3: Manual (SQL directo)

Conéctate a tu base de datos y ejecuta:

```sql
USE uttecam_dev;

-- Eliminar índice único de numero_referencia
DROP INDEX IF EXISTS idx_solicitudes_numero_referencia ON solicitudes_constancias_kardex;

-- Eliminar la columna numero_referencia
ALTER TABLE solicitudes_constancias_kardex 
DROP COLUMN IF EXISTS numero_referencia;

-- Verificar cambios
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'solicitudes_constancias_kardex'
ORDER BY ordinal_position;
```

---

## ✅ Verificación

Después de ejecutar la migración, verifica que:

1. La columna `numero_referencia` ya no existe:
   ```sql
   DESCRIBE solicitudes_constancias_kardex;
   ```

2. El índice fue eliminado:
   ```sql
   SHOW INDEX FROM solicitudes_constancias_kardex;
   ```

3. Los datos existentes permanecen intactos:
   ```sql
   SELECT COUNT(*) FROM solicitudes_constancias_kardex;
   ```

---

## 🔄 Después de la Migración

1. **Reinicia el servidor Node.js**:
   ```bash
   npm run dev
   ```

2. **Prueba crear una solicitud**:
   ```bash
   curl -X POST http://localhost:3002/api/solicitudes \
     -H "Content-Type: application/json" \
     -d '{
       "nombre": "Juan Pérez",
       "matricula": "12345678",
       "correo": "juan@example.com",
       "telefono": "9876543210",
       "carrera": "Ingeniería",
       "nivel": "LIC",
       "tipo_entrega": "electronico",
       "documentos_solicitados": ["Constancia de Estudios"]
     }'
   ```

3. **Verifica la respuesta**: Ahora debe mostrar el ID en lugar de numero_referencia

---

## ⚠️ Importante

- **Haz un backup** de tu base de datos antes de ejecutar la migración
- Esta operación **no se puede deshacer fácilmente**
- Asegúrate de que el código esté actualizado antes de migrar

---

## 🆘 Si algo sale mal

### Restaurar backup:
```sql
-- Si hiciste un backup antes
mysql -u root -p uttecam_dev < backup_uttecam_dev.sql
```

### Recrear la columna (si necesitas revertir):
```sql
ALTER TABLE solicitudes_constancias_kardex 
ADD COLUMN numero_referencia VARCHAR(100) UNIQUE;

CREATE UNIQUE INDEX idx_solicitudes_numero_referencia 
ON solicitudes_constancias_kardex(numero_referencia);
```

---

**¿Necesitas ayuda?** Verifica los logs en caso de error.
