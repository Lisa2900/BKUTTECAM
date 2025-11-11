# 🚀 GUÍA DE DEPLOYMENT EN PRODUCCIÓN

## 📋 Preparación del Paquete de Producción

### 1. Compilar y Preparar el Proyecto

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar TypeScript a JavaScript
npm run build

# 3. Crear paquete optimizado para producción
npm run build:prod
```

### 2. Archivos Generados

Después de ejecutar `npm run build:prod`, tendrás:

- ✅ `dist/` - Código JavaScript compilado
- ✅ `package.deployment.json` - Package.json optimizado para producción
- ✅ Verificación de archivos críticos

## 📦 Archivos Necesarios para Deployment

### Archivos Obligatorios

```
├── dist/                           # Código compilado (OBLIGATORIO)
│   ├── server.js
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── package.deployment.json         # Renombrar a package.json
├── .env                           # Configurar con valores de producción
├── scripts/
│   └── create-admin.js            # Script para crear admin
├── sql/                           # Scripts de base de datos
│   ├── database_setup.sql
│   └── solicitudes_constancias_kardex.sql
└── docs/                          # Documentación (opcional)
```

### Archivos Opcionales pero Recomendados

```
├── ecosystem.config.json          # Configuración PM2
├── .env.production               # Plantilla de configuración
└── README.md                     # Documentación básica
```

## 🔧 Configuración del Servidor

### 1. Configurar Variables de Entorno

Crear archivo `.env` basado en `.env.production`:

```bash
# Copiar plantilla
cp .env.production .env

# Editar con valores reales del servidor
nano .env
```

**Variables críticas a configurar:**

- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET` (generar una clave única de 64+ caracteres)
- `CORS_ORIGINS` (dominios permitidos)
- `API_BASE_URL` (URL de tu servidor)

### 2. Configurar Base de Datos

```bash
# Conectar a MySQL
mysql -u root -p

# Crear base de datos
CREATE DATABASE uttecam_prod;
CREATE USER 'uttecam_user'@'localhost' IDENTIFIED BY 'contraseña_segura';
GRANT ALL PRIVILEGES ON uttecam_prod.* TO 'uttecam_user'@'localhost';
FLUSH PRIVILEGES;

# Ejecutar scripts SQL
mysql -u uttecam_user -p uttecam_prod < sql/database_setup.sql
mysql -u uttecam_user -p uttecam_prod < sql/solicitudes_constancias_kardex.sql
```

### 3. Instalar Dependencias de Producción

```bash
# Renombrar package de deployment
mv package.deployment.json package.json

# Instalar solo dependencias de producción
npm install --production

# Verificar instalación
npm list --depth=0
```

## 🚀 Métodos de Deployment

### Opción A: Deployment Directo (Node.js Básico)

```bash
# Crear directorio de logs
mkdir -p logs

# Crear usuario admin
node scripts/create-admin.js

# Iniciar aplicación
npm start
```

### Opción B: Deployment con PM2 (Recomendado)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Crear directorio de logs
mkdir -p logs

# Crear usuario admin
node scripts/create-admin.js

# Iniciar con PM2
pm2 start ecosystem.config.json

# Configurar PM2 para arranque automático
pm2 startup
pm2 save
```

### Opción C: Deployment en cPanel

1. **Subir archivos via File Manager o Git**
2. **Configurar Node.js App en cPanel:**
   - App Root: `/public_html/api` (o directorio deseado)
   - App URL: `api.tudominio.com`
   - Node.js Version: 18.x o superior
   - Application file: `dist/server.js`

3. **Configurar variables de entorno en cPanel**
4. **Ejecutar comandos de instalación:**

```bash
npm install --production
node scripts/create-admin.js
```

## 🔍 Verificación del Deployment

### 1. Health Check

```bash
# Verificar que la API responde
curl http://localhost:3002/health

# Debería retornar algo como:
{
  "status": "OK",
  "database": "connected",
  "timestamp": "2025-10-10T...",
  "api_version": "2.0.0-secure"
}
```

### 2. Verificar Endpoints Principales

```bash
# Endpoint principal
curl http://localhost:3002/

# Login (debería requerir credentials)
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!@#"}'

# Crear solicitud de prueba
curl -X POST http://localhost:3002/api/solicitudes-constancia \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "matricula": "TU999999",
    "correo": "test@uttecam.edu.mx",
    "telefono": "9999999999",
    "carrera": "Carrera de Prueba",
    "nivel": "TSU",
    "tipo_entrega": "electronico",
    "documentos_solicitados": ["Constancia de Estudios"]
  }'
```

### 3. Verificar Logs

```bash
# Ver logs generales
tail -f logs/*.log

# Ver logs de errores
tail -f logs/*error*.log

# Ver logs de seguridad
tail -f logs/security*.log
```

## 🛡️ Configuración de Seguridad en Producción

### 1. Firewall y Puertos

```bash
# Abrir solo puerto 3002 (o el configurado)
ufw allow 3002/tcp

# Si usas reverse proxy, cerrar puerto directo
ufw deny 3002/tcp
```

### 2. SSL/HTTPS (Muy Recomendado)

- Configurar certificado SSL en el servidor web
- Usar reverse proxy (nginx/Apache) para HTTPS
- Actualizar `CORS_ORIGINS` con URLs HTTPS

### 3. Monitoreo y Alertas

```bash
# Configurar logrotate para logs
sudo nano /etc/logrotate.d/uttecam-api

# Contenido:
/path/to/uttecam/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    notifempty
    create 644 node node
}
```

## 📊 Monitoreo en Producción

### 1. Scripts de Monitoreo

```bash
# Verificar salud cada 5 minutos
*/5 * * * * curl -f http://localhost:3002/health > /dev/null 2>&1 || echo "API DOWN" | mail admin@uttecam.edu.mx

# Respaldo diario de logs
0 2 * * * tar -czf /backups/logs-$(date +\%Y\%m\%d).tar.gz /path/to/uttecam/logs/
```

### 2. Métricas Importantes

- **Uptime**: Disponibilidad del servicio
- **Response Time**: Tiempo de respuesta promedio
- **Error Rate**: Tasa de errores HTTP 5xx
- **Database Connections**: Conexiones activas a DB
- **Memory Usage**: Uso de memoria RAM
- **CPU Usage**: Uso de procesador

## 🔧 Mantenimiento

### 1. Actualizaciones

```bash
# Crear respaldo antes de actualizar
pm2 save
cp -r /path/to/uttecam /backups/uttecam-$(date +%Y%m%d)

# Proceso de actualización:
# 1. Subir nuevos archivos dist/
# 2. Actualizar package.json si es necesario
# 3. npm install --production (si hay nuevas deps)
# 4. pm2 restart uttecam-api
```

### 2. Respaldos

```bash
# Respaldo de base de datos
mysqldump -u uttecam_user -p uttecam_prod > backup-$(date +%Y%m%d).sql

# Respaldo de archivos subidos
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/

# Respaldo de configuración
cp .env .env.backup-$(date +%Y%m%d)
```

### 3. Limpieza de Logs

```bash
# Eliminar logs antiguos (más de 30 días)
find logs/ -name "*.log" -mtime +30 -delete

# Comprimir logs antiguos
find logs/ -name "*.log" -mtime +7 -exec gzip {} \;
```

## 🆘 Troubleshooting

### Problemas Comunes

1. **API no inicia**: Verificar configuración de `.env` y conexión a DB
2. **502 Bad Gateway**: Verificar que la aplicación esté corriendo en el puerto correcto
3. **Database connection failed**: Verificar credenciales y que MySQL esté activo
4. **JWT errors**: Verificar que `JWT_SECRET` esté configurado
5. **CORS errors**: Verificar `CORS_ORIGINS` en `.env`

### Comandos de Diagnóstico

```bash
# Ver procesos Node.js
ps aux | grep node

# Ver puertos en uso
netstat -tlnp | grep :3002

# Ver logs en tiempo real
tail -f logs/*.log

# Verificar espacio en disco
df -h

# Verificar memoria
free -h

# Reiniciar aplicación
pm2 restart uttecam-api
```

## 📞 Soporte

Para problemas de deployment, consultar:

1. **Documentación**: `docs/`
2. **Logs**: `logs/`
3. **Health Check**: `http://servidor:3002/health`
4. **Issues**: GitHub repository issues

---

✅ **¡Deployment completado!** Tu API UTTECAM está lista para producción con todas las características de seguridad OWASP implementadas.