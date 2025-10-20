# 🔧 SOLUCIÓN RÁPIDA - Error de Deployment

## 🚨 Error Detectado

```
Error: Cannot find module '/home/uttecame/nodevenv/estudiantes.uttecam.edu.mx/22/lib/scripts/create-admin.js'
```

## ✅ Solución Inmediata

### 1. **NO usar postinstall automático**

El `package.deployment.json` ya ha sido corregido para eliminar el script automático que causaba problemas.

### 2. **Pasos Correctos de Deployment**

```bash
# 1. Renombrar el package correcto
mv package.deployment.json package.json

# 2. Instalar dependencias SIN el postinstall problemático
npm install --production --ignore-scripts

# 3. Crear admin manualmente DESPUÉS de la instalación
node scripts/create-admin.js

# 4. Iniciar aplicación
npm start
```

### 3. **Verificar Archivos Necesarios**

Asegurarse de que estos archivos estén en el servidor:

```
✅ dist/server.js (código compilado)
✅ scripts/create-admin.js (script de admin)
✅ package.json (el deployment renombrado)
✅ .env (configuración de producción)
✅ sql/ (scripts de base de datos)
```

### 4. **Si el Error Persiste**

```bash
# Verificar que el script existe
ls -la scripts/create-admin.js

# Si no existe, copiar desde el repositorio
curl -o scripts/create-admin.js https://raw.githubusercontent.com/Lisa2900/BKUTTECAM/version-estable/scripts/create-admin.js

# Dar permisos de ejecución
chmod +x scripts/create-admin.js

# Ejecutar manualmente
node scripts/create-admin.js
```

### 5. **Configuración de .env**

Asegurarse de que `.env` tenga la configuración correcta:

```env
# Base de datos
DB_HOST=localhost
DB_NAME=tu_base_datos
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña

# JWT
JWT_SECRET=tu_jwt_secret_muy_largo_y_seguro

# Puerto
PORT=3002
NODE_ENV=production
```

### 6. **Verificar Conexión de Base de Datos**

```bash
# Probar conexión manualmente
mysql -h localhost -u tu_usuario -p tu_base_datos

# Verificar que las tablas existen
SHOW TABLES;

# Si no existen, ejecutar scripts SQL
mysql -u tu_usuario -p tu_base_datos < sql/database_setup.sql
mysql -u tu_usuario -p tu_base_datos < sql/solicitudes_constancias_kardex.sql
```

## 🎯 Deployment Correcto Paso a Paso

### En tu máquina local:
```bash
npm run build:prod
```

### En el servidor:
```bash
# 1. Subir archivos: dist/, scripts/, sql/, docs/
# 2. Copiar package.deployment.json
# 3. Configurar .env

# 4. Instalar dependencias
mv package.deployment.json package.json
npm install --production --ignore-scripts

# 5. Configurar base de datos
mysql -u root -p
CREATE DATABASE uttecam_prod;
CREATE USER 'uttecam_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON uttecam_prod.* TO 'uttecam_user'@'localhost';
FLUSH PRIVILEGES;
exit

# 6. Ejecutar scripts SQL
mysql -u uttecam_user -p uttecam_prod < sql/database_setup.sql
mysql -u uttecam_user -p uttecam_prod < sql/solicitudes_constancias_kardex.sql

# 7. Crear usuario admin
node scripts/create-admin.js

# 8. Iniciar aplicación
npm start
```

## 🔍 Verificación

```bash
# Verificar que la API responde
curl http://localhost:3002/health

# Debería retornar:
{
  "status": "OK",
  "database": "connected",
  "timestamp": "2025-10-10T...",
  "api_version": "2.0.0-secure"
}
```

## 📞 Si Necesitas Ayuda

1. **Verificar logs**: `tail -f logs/*.log`
2. **Revisar configuración**: verificar `.env`
3. **Probar conexión DB**: usar mysql cli
4. **Verificar permisos**: `ls -la scripts/`

El deployment debería funcionar perfectamente siguiendo estos pasos corregidos. 🚀