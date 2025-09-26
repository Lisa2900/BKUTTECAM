# Guía de Despliegue - UTTECAM API

Esta guía cubre diferentes opciones para desplegar la API UTTECAM en producción.

## 📋 Índice

1. [Preparación General](#preparación-general)
2. [cPanel (Hosting Compartido)](#cpanel-hosting-compartido)
3. [VPS/Servidor Dedicado](#vpsservidor-dedicado)
4. [Servicios en la Nube](#servicios-en-la-nube)
5. [Docker](#docker)
6. [Configuraciones Post-Despliegue](#configuraciones-post-despliegue)

## Preparación General

### Antes del Despliegue

1. **Compilar aplicación**:
```bash
npm run build
```

2. **Verificar archivos necesarios**:
   - `package.json`
   - `dist/` (código compilado)
   - `app.js` (punto de entrada)
   - `database_setup.sql`
   - `.env.example` (template de variables)

3. **Archivos a NO incluir**:
   - `node_modules/`
   - `src/` (código fuente TypeScript)
   - `tsconfig.json`
   - `.env` (archivo con credenciales reales)

## cPanel (Hosting Compartido)

### Requisitos
- cPanel con soporte para Node.js 16+
- MySQL/MariaDB incluido
- Acceso a File Manager y Node.js Apps

### Paso a Paso

#### 1. Preparar Archivos Localmente
```bash
# Compilar aplicación
npm run build

# Crear archivo ZIP para subir
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