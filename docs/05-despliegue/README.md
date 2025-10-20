# 🚀 05. Despliegue

## Documentos en esta sección

Guías completas para desplegar la aplicación en diferentes entornos.

### 📄 Documentos Disponibles

1. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comparación de Opciones de Hosting
   - cPanel (hosting compartido)
   - VPS/Servidor Dedicado
   - Servicios en la nube (Heroku, DigitalOcean, AWS)
   - Recomendaciones por tipo de proyecto
   - Costos estimados
   - **Ideal para:** Decidir qué opción de hosting usar

2. **[CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md)** ⭐ - Deploy en cPanel Paso a Paso
   - Preparación del proyecto
   - Configuración en cPanel
   - Node.js Selector
   - Subida de archivos (File Manager y Git)
   - Configuración de base de datos MySQL
   - Variables de entorno
   - Activación de la aplicación
   - Verificación y testing
   - Solución de problemas comunes
   - **Ideal para:** Hosting compartido, principiantes

3. **[PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)** - Despliegue en Producción
   - Mejores prácticas
   - Configuraciones de producción
   - Optimizaciones
   - Monitoreo
   - **Ideal para:** Deploy en VPS o servidores dedicados

4. **[deploy.md](./deploy.md)** - Guía Rápida de Deployment
   - Checklist rápido
   - Comandos esenciales
   - **Ideal para:** Referencia rápida

---

## 🎯 ¿Qué opción de hosting elegir?

### 🏠 cPanel (Hosting Compartido)
**Recomendado para:**
- Proyectos pequeños/medianos
- Presupuesto limitado ($5-15/mes)
- Principiantes
- Poco tráfico (<10,000 visitas/mes)

📖 **Guía:** [CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md)

### 💻 VPS (Servidor Virtual Privado)
**Recomendado para:**
- Proyectos medianos/grandes
- Presupuesto medio ($15-50/mes)
- Desarrolladores con experiencia
- Tráfico moderado-alto (10,000-100,000 visitas/mes)
- Control total del servidor

📖 **Guía:** [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)

### ☁️ Servicios en la Nube
**Recomendado para:**
- Proyectos empresariales
- Escalabilidad automática
- Presupuesto flexible ($20-200+/mes)
- Equipos grandes

📖 **Guía:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📋 Checklist de Deployment

### Antes de Desplegar
- [ ] Código compilado (`npm run build`)
- [ ] Variables de entorno configuradas
- [ ] Base de datos creada y migrada
- [ ] Credenciales de seguridad cambiadas
- [ ] Tests pasando
- [ ] Logs configurados

### Durante el Deploy
- [ ] Subir archivos al servidor
- [ ] Instalar dependencias de producción
- [ ] Configurar Node.js (versión correcta)
- [ ] Crear base de datos
- [ ] Importar esquema SQL
- [ ] Configurar variables de entorno
- [ ] Crear usuario administrador

### Después del Deploy
- [ ] Verificar `/health` endpoint
- [ ] Probar endpoints principales
- [ ] Verificar logs
- [ ] Configurar monitoreo
- [ ] Configurar backups automáticos
- [ ] Documentar credenciales de acceso

---

## 🔧 Comandos Comunes

### Preparar para Producción
```bash
# Limpiar y compilar
npm run clean
npm run build

# Crear paquete de producción
npm run build:production
```

### En el Servidor
```bash
# Instalar dependencias de producción
npm install --production

# Crear usuario admin
npm run create-admin

# Iniciar aplicación
npm start

# O con PM2
pm2 start ecosystem.config.json
```

---

## ⚠️ Notas Importantes

- **NO incluir** archivos `.env` en el repositorio
- **Cambiar** credenciales por defecto del admin
- **Usar** HTTPS en producción
- **Configurar** backups automáticos de base de datos
- **Monitorear** logs regularmente

---

## 📋 Documentos Relacionados

- **[SOLUCION_DEPLOYMENT.md](../07-troubleshooting/SOLUCION_DEPLOYMENT.md)** - Errores comunes
- **[SECURITY.md](../06-seguridad-administracion/SECURITY.md)** - Seguridad en producción
- **[INSTALLATION.md](../02-instalacion-configuracion/INSTALLATION.md)** - Instalación básica

---

[← Volver al índice principal](../README.md)
