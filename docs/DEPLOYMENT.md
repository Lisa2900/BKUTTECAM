# 🚀 Guías de Despliegue - UTTECAM API con Sequelize# 🚀 Guías de Despliegue - UTTECAM API con Sequelize



Guías completas para desplegar tu API UTTECAM con Sequelize ORM en diferentes plataformas.Guías completas para desplegar tu API UTTECAM con Sequelize ORM en diferentes plataformas.



## 📋 Opciones de Deployment## 📋 Opciones de Deployment



### 🏆 Recomendado para Principiantes: cPanel### 🏆 Recomendado para Principiantes: cPanel

**📄 [Ver Guía Completa de cPanel](./CPANEL_DEPLOYMENT.md)****📄 [Ver Guía Completa de cPanel](./CPANEL_DEPLOYMENT.md)**



- ✅ **Fácil configuración** - Interface gráfica- ✅ **Fácil configuración** - Interface gráfica

- ✅ **Hosting compartido** - Económico- ✅ **Hosting compartido** - Económico

- ✅ **Node.js Selector** - Un clic para instalar- ✅ **Node.js Selector** - Un clic para instalar

- ✅ **MySQL incluido** - Base de datos integrada- ✅ **MySQL incluido** - Base de datos integrada

- ✅ **SSL gratuito** - Let's Encrypt- ✅ **SSL gratuito** - Let's Encrypt

- 💰 **Costo:** $5-15/mes- 💰 **Costo:** $5-15/mes



**Ideal para:** Proyectos pequeños, portfolios, APIs de bajo tráfico**Ideal para:** Proyectos pequeños, portfolios, APIs de bajo tráfico



------



## 🚀 Otras Opciones de Deployment (Próximamente)## 🚀 Otras Opciones de Deployment



### VPS/Servidor Dedicado### VPS/Servidor Dedicado

- ✅ Control total del servidor- ✅ Control total del servidor

- ✅ Mejor rendimiento- ✅ Mejor rendimiento

- ✅ Escalabilidad completa- ✅ Escalabilidad completa

- 💰 **Costo:** $20-100/mes- 💰 **Costo:** $20-100/mes



### Servicios en la Nube### Servicios en la Nube



#### Heroku#### Heroku

- ✅ Deploy automático con Git- ✅ Deploy automático con Git

- ✅ Add-ons para MySQL- ✅ Add-ons para MySQL

- ✅ Escalado automático- ✅ Escalado automático

- 💰 **Costo:** $7-25/mes- 💰 **Costo:** $7-25/mes



#### DigitalOcean App Platform#### DigitalOcean App Platform

- ✅ Deploy desde GitHub- ✅ Deploy desde GitHub

- ✅ Base de datos gestionada- ✅ Base de datos gestionada

- ✅ CDN incluido- ✅ CDN incluido

- 💰 **Costo:** $12-50/mes- 💰 **Costo:** $12-50/mes



#### AWS/Google Cloud#### AWS/Google Cloud

- ✅ Infraestructura profesional- ✅ Infraestructura profesional

- ✅ Servicios avanzados- ✅ Servicios avanzados

- ✅ Escalado global- ✅ Escalado global

- 💰 **Costo:** Variable ($10-200+/mes)- 💰 **Costo:** Variable ($10-200+/mes)



---## 🎯 Preparación del Proyecto



## 🎯 ¿Cuál elegir?### Requisitos del Hosting

- ✅ **cPanel** con soporte para Node.js 16+

### Para Empezar: **cPanel**- ✅ **MySQL 8.0+** o MariaDB 10.3+

Si es tu primer deployment o tienes un presupuesto limitado, cPanel es perfecto. La guía completa está en [CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md).- ✅ **Acceso a File Manager** y **Node.js Selector**

- ✅ **SSL Certificate** (recomendado)

### Para Proyectos Serios: **VPS o Cloud**- ✅ **Subdomain o domain** configurado

Si esperas tráfico alto o necesitas más control, considera VPS o servicios en la nube.

### 1. Preparar Archivos Localmente

### Para Empresas: **AWS/Google Cloud**

Para aplicaciones empresariales con múltiples regiones y alta disponibilidad.**Paso 1: Compilar la aplicación**

```bash

---cd BKUTTECAM

npm run build

## 📚 Recursos Adicionales```



- **[Guía de Desarrollo Local](../DEVELOPMENT.md)** - Configurar entorno local**Paso 2: Crear package.json para producción**

- **[API Reference](./API_REFERENCE.md)** - Documentación de endpoints```bash

- **[Installation Guide](./INSTALLATION.md)** - Instalación paso a paso# Crear package.json solo con dependencias de producción

npm run build

---```



**¡Elige la opción que mejor se adapte a tus necesidades y presupuesto!** 🎯**Paso 3: Verificar archivos necesarios**
✅ Archivos REQUERIDOS:
- `package.json` - Dependencias y scripts
- `dist/` - Código JavaScript compilado
- `.env.example` - Template de variables
- `database_setup.sql` - Script inicial de BD

❌ Archivos a NO incluir:
- `node_modules/` - Se instalarán en el servidor
- `src/` - Código TypeScript fuente
- `tsconfig.json` - Solo para desarrollo
- `.env` - Contiene credenciales sensibles
- `backup/` - Archivos de respaldo

## 🔧 Configuración en cPanel

### 1. Acceder a Node.js Selector

1. **Inicia sesión en cPanel**
2. Busca **"Node.js Selector"** o **"Setup Node.js App"**
3. Haz clic para crear una nueva aplicación

### 2. Configurar Aplicación Node.js

**Configuración inicial:**
```
Application Name: uttecam-api
Node.js Version: 16.x o superior
Application Mode: Production
Application Root: uttecam-api (o tu carpeta preferida)
Application URL: api.tudominio.com (o subdominio)
Startup File: dist/server.js
```

**Ejemplo de configuración:**
```
📱 Nombre: UTTECAM API
🔧 Versión Node.js: 18.17.0
🎯 Modo: Production  
📁 Directorio: public_html/api
🌐 URL: https://tudominio.com/api
🚀 Archivo inicio: dist/server.js
```

### 3. Variables de Entorno Iniciales

En cPanel, en la sección **"Environment variables"**, añade:

```
NODE_ENV=production
PORT=3000
```

## 📁 Subida de Archivos

### Opción 1: File Manager (Recomendado)

**Paso 1: Comprimir archivos**
```bash
# En tu PC, crear ZIP con archivos necesarios
zip -r uttecam-api.zip dist/ package.json .env.example database_setup.sql docs/
```

**Paso 2: Subir en cPanel**
1. Abre **File Manager** en cPanel
2. Navega a la carpeta de tu aplicación (ej: `public_html/api/`)
3. Sube el archivo `uttecam-api.zip`
4. Haz clic derecho → **"Extract"**
5. Elimina el archivo ZIP después de extraer

**Paso 3: Verificar estructura**
```
public_html/api/
├── dist/
│   ├── server.js
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   └── routes/
├── package.json
├── .env.example
├── database_setup.sql
└── docs/
```

### Opción 2: Git Deploy (Avanzado)

Si tu hosting soporta Git:

```bash
# En cPanel Terminal o SSH
cd public_html/api
git clone https://github.com/Lisa2900/BKUTTECAM.git .
git checkout version-estable
npm run build
```

## 🗄️ Configuración de Base de Datos

### 1. Crear Base de Datos MySQL

**En cPanel → MySQL Databases:**

1. **Crear nueva base de datos:**
   - Nombre: `tuusuario_uttecam`
   - Charset: `utf8mb4`
   - Collation: `utf8mb4_unicode_ci`

2. **Crear usuario de BD:**
   - Usuario: `tuusuario_api`
   - Contraseña: `TuPassword123!`
   - Privilegios: **ALL PRIVILEGES**

3. **Anotar credenciales:**
```
Host: localhost
Database: tuusuario_uttecam  
User: tuusuario_api
Password: TuPassword123!
Port: 3306
```

### 2. Ejecutar Script de Configuración

**Opción A: phpMyAdmin**
1. Abre **phpMyAdmin** en cPanel
2. Selecciona tu base de datos
3. Ve a la pestaña **"SQL"**
4. Ejecuta el contenido de `database_setup.sql`

**Opción B: Terminal (si disponible)**
```bash
mysql -u tuusuario_api -p tuusuario_uttecam < database_setup.sql
```

### 3. Verificar Tablas Creadas

Deberías ver la tabla:
```sql
-- Tabla creada por Sequelize
CREATE TABLE textos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at)
);
```

## ⚙️ Variables de Entorno

### Configurar .env en Producción

**En cPanel File Manager**, crear archivo `.env`:

```bash
# Variables de Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tuusuario_uttecam
DB_USER=tuusuario_api
DB_PASSWORD=TuPassword123!

# Variables del Servidor
NODE_ENV=production
PORT=3000

# Variables de Sequelize
SEQUELIZE_LOGGING=false
```

### Variables en cPanel Node.js Selector

También añade en **Environment variables** de cPanel:

```
DB_HOST=localhost
DB_NAME=tuusuario_uttecam
DB_USER=tuusuario_api
DB_PASSWORD=TuPassword123!
NODE_ENV=production
PORT=3000
```

## 🚦 Activación de la Aplicación

### 1. Instalar Dependencias

**En cPanel Node.js Selector:**
1. Ve a tu aplicación creada
2. Haz clic en **"NPM Install"**
3. Espera a que termine la instalación

**O en Terminal (si disponible):**
```bash
cd public_html/api
npm install --production
```

### 2. Configurar package.json para Producción

Asegúrate de que `package.json` tenga:

```json
{
  "name": "uttecam-api",
  "version": "2.0.0",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "postinstall": "echo 'Dependencies installed successfully'"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.18.2",
    "mysql2": "^3.15.1",
    "sequelize": "^6.37.7"
  }
}
```

### 3. Iniciar la Aplicación

**En cPanel Node.js Selector:**
1. Haz clic en **"Restart"**
2. Verifica que el estado sea **"Running"**
3. Anota la URL asignada

### 4. Configurar URL Personalizada (Opcional)

**Para subdomain (ej: api.tudominio.com):**
1. En cPanel → **Subdomains**
2. Crear subdomain: `api`
3. Document Root: `public_html/api`
4. En Node.js Selector, cambiar **Application URL**

## ✅ Verificación y Testing

### 1. Verificar Estado de la App

**Revisar logs en cPanel:**
```bash
# En Terminal o File Manager
cat logs/uttecam-api.log
```

**Verificar que Sequelize inicie:**
```
✅ Conexión a base de datos establecida correctamente
✅ Modelos sincronizados con la base de datos
🚀 Servidor corriendo en puerto 3000
```

### 2. Probar Endpoints

**Probar endpoint básico:**
```bash
curl https://tudominio.com/api/textos/stats
```

**Respuesta esperada:**
```json
{
  "totalTextos": 0,
  "textosHoy": 0,
  "ultimoTexto": null
}
```

### 3. Poblar con Datos de Prueba

**Si tienes Terminal SSH:**
```bash
cd public_html/api
node -e "require('./dist/config/syncDatabase').seedDatabase()"
```

**O insertar manualmente en phpMyAdmin:**
```sql
INSERT INTO textos (contenido) VALUES 
('Bienvenido a la Universidad Tecnológica de Tecamachalco'),
('La UTTECAM se compromete con la excelencia académica'),
('Ofrecemos carreras técnicas y de ingeniería de vanguardia');
```

### 4. Probar API Completa

**Listar textos:**
```bash
curl https://tudominio.com/api/textos
```

**Crear texto:**
```bash
curl -X POST https://tudominio.com/api/textos \
  -H "Content-Type: application/json" \
  -d '{"contenido":"Nuevo texto desde producción"}'
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

**Causa:** Credenciales incorrectas
**Solución:**
1. Verificar variables en `.env`
2. Confirmar usuario tiene permisos
3. Verificar que la BD existe

```bash
# Probar conexión manualmente
mysql -u tuusuario_api -p -h localhost tuusuario_uttecam
```

### Error: "Module not found"

**Causa:** Dependencias no instaladas
**Solución:**
```bash
cd public_html/api
npm install --production
```

### Error: "Port already in use"

**Causa:** Puerto ocupado
**Solución:** En cPanel Node.js, cambiar puerto o reiniciar app

### Error: "Sequelize sync failed"

**Causa:** Permisos de BD insuficientes
**Solución:**
1. Verificar que el usuario tenga `CREATE`, `ALTER`, `INSERT` permisos
2. Usar phpMyAdmin para dar permisos completos

### Logs no aparecen

**Ver logs en cPanel:**
```bash
# Ubicaciones comunes de logs
tail -f ~/logs/uttecam-api.log
tail -f ~/public_html/api/app.log
```

## 📊 Monitoreo y Mantenimiento

### 1. Configurar Logs Personalizados

Crear `logger.js` en producción:
```javascript
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/app.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
  console.log(logMessage.trim());
}

module.exports = { log };
```

### 2. Monitoreo de Base de Datos

**Script de verificación de BD:**
```sql
-- Verificar estado de la BD
SELECT 
  COUNT(*) as total_textos,
  MAX(created_at) as ultimo_registro,
  MIN(created_at) as primer_registro
FROM textos;

-- Verificar conexiones activas
SHOW PROCESSLIST;
```

### 3. Backup Automático

**Script de backup (si tienes acceso SSH):**
```bash
#!/bin/bash
# backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u tuusuario_api -p tuusuario_uttecam > backup_$DATE.sql
```

### 4. Actualización de la Aplicación

**Para actualizar con nuevos cambios:**
```bash
# 1. Hacer backup de BD
# 2. Subir nuevos archivos
# 3. Reinstalar dependencias si es necesario
cd public_html/api
npm install --production
# 4. Reiniciar en cPanel Node.js Selector
```

---

## 🎉 ¡Deploy Completado!

Tu API UTTECAM con Sequelize ahora está ejecutándose en producción.

### 📋 Checklist Final

- ✅ Aplicación Node.js configurada en cPanel
- ✅ Base de datos MySQL creada y configurada  
- ✅ Variables de entorno configuradas
- ✅ Dependencias instaladas
- ✅ Endpoints funcionando correctamente
- ✅ Sequelize sincronizando con BD
- ✅ Logs configurados para monitoreo

### 🔗 URLs de tu API

- **API Base:** `https://tudominio.com/api`
- **Estadísticas:** `https://tudominio.com/api/textos/stats`
- **Textos:** `https://tudominio.com/api/textos`

### 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en cPanel
2. Verifica las variables de entorno
3. Confirma que la BD esté accesible
4. Contacta al soporte de tu hosting si es necesario

**¡Tu API está lista para recibir peticiones en producción!** 🚀
# Incluir: dist/, package.json, app.js, database_setup.sql, .env.example
```

#### 2. Configurar Base de Datos en cPanel

1. **MySQL Databases**:
   - Crear nueva base de datos: `uttecam`
   - Crear usuario: `uttecam_user` 
   - Asignar usuario a base de datos con todos los permisos

2. **phpMyAdmin**:
   - Importar archivo `database_setup.sql`
   - Verificar que tabla `textos` se creó correctamente

#### 3. Subir Archivos

1. **File Manager**:
   - Navegar a `public_html/api/` (o crear carpeta)
   - Subir archivo ZIP
   - Extraer contenido

#### 4. Configurar Aplicación Node.js

1. **Node.js Apps** → **Create Application**:
   - **Node.js version**: 18.x (o la más reciente)
   - **Application mode**: Production
   - **Application root**: `/public_html/api`
   - **Application URL**: `tu-dominio.com/api` 
   - **Application startup file**: `app.js`

#### 5. Variables de Entorno
En la configuración de Node.js App, agregar:
```
DB_HOST=localhost
DB_USER=tuusuario_uttecam_user
DB_PASSWORD=tu_password_generado
DB_NAME=tuusuario_uttecam
DB_PORT=3306
NODE_ENV=production
```
> **Nota**: En cPanel, el nombre real será prefijado con tu usuario (ej: `usuario123_uttecam`)

#### 6. Instalar Dependencias y Ejecutar
1. **Run NPM Install** (en Node.js Apps)
2. **Restart Application**
3. Verificar en `tu-dominio.com/api/health`

### Configuración DNS (si usas subdominio)
```
Tipo: A Record
Nombre: api
Valor: IP_de_tu_servidor_cpanel
TTL: 300
```

## VPS/Servidor Dedicado

### Ubuntu/Debian

#### 1. Configuración Inicial
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Instalar herramientas adicionales
sudo apt install nginx certbot python3-certbot-nginx -y
```

#### 2. Configurar Usuario y Aplicación
```bash
# Crear usuario para la aplicación
sudo adduser uttecam
sudo usermod -aG sudo uttecam

# Cambiar a usuario
su - uttecam

# Clonar/copiar aplicación
mkdir ~/apps && cd ~/apps
# Subir archivos aquí

# Instalar dependencias
npm ci --only=production
```

#### 3. Configurar Base de Datos
```bash
# Conectar a MySQL como root
sudo mysql

# Crear base de datos y usuario
CREATE DATABASE uttecam CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'uttecam_user'@'localhost' IDENTIFIED BY 'password_seguro_123';
GRANT ALL PRIVILEGES ON uttecam.* TO 'uttecam_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Importar datos
mysql -u uttecam_user -p uttecam < database_setup.sql
```

#### 4. Configurar Variables de Entorno
```bash
# Crear archivo .env
cat > .env << EOF
DB_HOST=localhost
DB_USER=uttecam_user
DB_PASSWORD=password_seguro_123
DB_NAME=uttecam
DB_PORT=3306
PORT=3000
NODE_ENV=production
EOF
```

#### 5. Configurar PM2 (Process Manager)
```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Crear archivo ecosystem
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'uttecam-api',
    script: './app.js',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Iniciar aplicación
pm2 start ecosystem.config.js

# Configurar autostart
pm2 startup
pm2 save
```

#### 6. Configurar Nginx (Proxy Reverso)
```bash
# Crear configuración
sudo nano /etc/nginx/sites-available/uttecam-api

# Contenido:
server {
    listen 80;
    server_name api.tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/uttecam-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 7. Configurar SSL con Certbot
```bash
# Obtener certificado SSL
sudo certbot --nginx -d api.tu-dominio.com

# Verificar renovación automática
sudo certbot renew --dry-run
```

### CentOS/RHEL
```bash
# Instalar Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Instalar MySQL
sudo yum install mysql-server
sudo systemctl start mysqld
sudo mysql_secure_installation

# Resto similar a Ubuntu, ajustando comandos yum por apt
```

## Servicios en la Nube

### Heroku

#### 1. Preparación
```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login
```

#### 2. Configurar Aplicación
```bash
# Crear aplicación
heroku create uttecam-api

# Agregar addon MySQL (JawsDB o ClearDB)
heroku addons:create jawsdb:kitefin

# Obtener URL de conexión
heroku config:get JAWSDB_URL
```

#### 3. Configurar Variables
```bash
# Configurar variables de entorno
heroku config:set NODE_ENV=production
heroku config:set DB_HOST=tu-host-jawsdb
heroku config:set DB_USER=usuario-jawsdb
heroku config:set DB_PASSWORD=password-jawsdb
heroku config:set DB_NAME=base-jawsdb
heroku config:set DB_PORT=3306
```

#### 4. Configurar archivos Heroku
```json
// Procfile
web: node app.js
```

```json
// package.json - agregar
{
  "scripts": {
    "heroku-postbuild": "npm run build"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

#### 5. Deploy
```bash
# Commit cambios
git add .
git commit -m "Deploy to Heroku"

# Deploy
git push heroku main

# Importar base de datos
heroku run bash
mysql -h host -u user -p database < database_setup.sql
```

### Railway

#### 1. Configuración
1. Conectar repositorio GitHub a Railway
2. Agregar servicio MySQL
3. Configurar variables de entorno automáticamente

#### 2. Variables de Entorno (auto-configuradas)
```
DATABASE_URL=mysql://user:pass@host:port/db
NODE_ENV=production
```

#### 3. railway.toml
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "node app.js"
```

### Render

#### 1. Configuración
1. Conectar repositorio
2. Elegir "Web Service"
3. Configurar:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node app.js`

#### 2. Base de Datos
1. Crear servicio PostgreSQL/MySQL
2. Conectar a aplicación

### DigitalOcean App Platform

#### 1. app.yaml
```yaml
name: uttecam-api
services:
- name: api
  source_dir: /
  github:
    repo: tu-usuario/uttecam-api
    branch: main
  run_command: node app.js
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
databases:
- name: uttecam-db
  engine: MYSQL
  version: "8"
```

## Docker

### Dockerfile Optimizado
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runner

WORKDIR /app

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copiar archivos
COPY --from=builder /app/node_modules ./node_modules
COPY dist/ ./dist/
COPY app.js package.json ./

# Cambiar a usuario no-root
USER nodejs

EXPOSE 3000

CMD ["node", "app.js"]
```

### docker-compose.yml Completo
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_USER=uttecam_user
      - DB_PASSWORD=secure_password_123
      - DB_NAME=uttecam
      - DB_PORT=3306
    depends_on:
      mysql:
        condition: service_healthy
    restart: unless-stopped
    
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password_123
      MYSQL_DATABASE: uttecam
      MYSQL_USER: uttecam_user
      MYSQL_PASSWORD: secure_password_123
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database_setup.sql:/docker-entrypoint-initdb.d/01-init.sql
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl/certs:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mysql_data:
```

### Despliegue Docker en Servidor
```bash
# Clonar repositorio
git clone <repo>
cd uttecam-api

# Construir y ejecutar
docker-compose up --build -d

# Ver logs
docker-compose logs -f app

# Backup base de datos
docker-compose exec mysql mysqldump -u uttecam_user -p uttecam > backup.sql
```

## Configuraciones Post-Despliegue

### Monitoreo y Logs

#### PM2 Monitoring
```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs uttecam-api

# Monitoreo web
pm2 install pm2-server-monit
```

#### Logs Personalizados
```javascript
// En app.js - agregar logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Usar logger.info(), logger.error()
```

### Seguridad

#### Firewall (ufw)
```bash
# Permitir solo puertos necesarios
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

#### Rate Limiting
```javascript
// Instalar: npm install express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por ventana
});

app.use(limiter);
```

### Backup Automatizado
```bash
# Crear script backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u uttecam_user -p$DB_PASSWORD uttecam > /backup/uttecam_$DATE.sql
find /backup -name "uttecam_*.sql" -mtime +7 -delete

# Agregar a crontab
0 2 * * * /path/to/backup.sh
```

### Certificado SSL Manual
```bash
# Generar certificado Let's Encrypt
sudo certbot certonly --standalone -d api.tu-dominio.com

# Renovar automáticamente
echo "0 2 * * * /usr/bin/certbot renew --quiet" | sudo tee -a /var/spool/cron/crontabs/root
```

### Verificación Post-Despliegue
```bash
# Health check
curl https://api.tu-dominio.com/health

# Test API
curl -X GET https://api.tu-dominio.com/api/textos
curl -X POST https://api.tu-dominio.com/api/textos \
  -H "Content-Type: application/json" \
  -d '{"contenido": "Test desde producción"}'

# Verificar SSL
curl -I https://api.tu-dominio.com
```

## Troubleshooting Común

### Problemas de Conexión DB
```bash
# Verificar conectividad
telnet host 3306

# Logs MySQL
sudo tail -f /var/log/mysql/error.log
```

### Problemas de Memoria
```bash
# Monitorear memoria
htop
pm2 monit

# Ajustar configuración Node.js
node --max-old-space-size=1024 app.js
```

### Problemas de Permisos
```bash
# Ajustar permisos archivos
chmod 644 *.js
chmod 755 scripts/
chown -R usuario:grupo /path/to/app
```

Esta guía cubre los casos más comunes. Para situaciones específicas, consulta la documentación del proveedor de hosting o servicio en la nube que elijas.