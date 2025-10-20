# 🔒 06. Seguridad y Administración

## Documentos en esta sección

Todo sobre seguridad, autenticación y administración del sistema.

### 📄 Documentos Disponibles

1. **[SECURITY.md](./SECURITY.md)** - Características de Seguridad
   - JWT Authentication
   - Password Hashing (bcrypt)
   - Rate Limiting
   - Input Validation
   - SQL Injection Protection
   - XSS Protection
   - CORS configurado
   - Helmet.js
   - **Ideal para:** Implementar seguridad, auditorías

2. **[ADMIN_USER.md](./ADMIN_USER.md)** ⭐ - Usuario Administrador
   - Credenciales por defecto
   - Cómo obtener token JWT
   - Usar token en requests
   - Ejemplos de endpoints protegidos
   - Permisos del administrador
   - Cambiar contraseña
   - **Ideal para:** Administradores, testing de API

3. **[RUTAS_PUBLICAS_PROTEGIDAS.md](./RUTAS_PUBLICAS_PROTEGIDAS.md)** - Control de Acceso
   - Rutas públicas vs protegidas
   - Middleware de autenticación
   - Roles y permisos
   - **Ideal para:** Entender control de acceso

---

## 🔐 Credenciales por Defecto

### Usuario Administrador
```
Email: admin@uttecam.edu.mx
Password: Admin2024!
```

⚠️ **IMPORTANTE:** Cambiar estas credenciales en producción.

---

## 🚀 Uso Rápido

### 1. Obtener Token JWT

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@uttecam.edu.mx",
    "password": "Admin2024!"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Admin",
    "email": "admin@uttecam.edu.mx",
    "role": "admin"
  }
}
```

### 2. Usar Token en Requests

```bash
curl http://localhost:3000/api/textos \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

---

## 🛡️ Características de Seguridad

### ✅ Implementadas

1. **Autenticación JWT**
   - Tokens seguros
   - Expiración configurable
   - Refresh tokens (opcional)

2. **Encriptación de Contraseñas**
   - bcrypt con salt rounds
   - No se almacenan contraseñas en texto plano

3. **Rate Limiting**
   - Protección contra fuerza bruta
   - Límites por IP
   - Diferentes límites por endpoint

4. **Validación de Datos**
   - express-validator
   - Sanitización de inputs
   - Validación de tipos

5. **Protección SQL Injection**
   - Sequelize ORM
   - Queries parametrizadas
   - Escape automático

6. **Headers de Seguridad**
   - Helmet.js
   - CORS configurado
   - XSS Protection

7. **Logging de Seguridad**
   - Registro de intentos de login
   - Logs de acceso
   - Detección de anomalías

---

## 👤 Roles de Usuario

### Admin
- Acceso total a todos los endpoints
- Crear, editar, eliminar usuarios
- Gestionar todo el contenido
- Ver logs y estadísticas

### User (futuro)
- Acceso limitado
- Solo lectura de algunos recursos
- Crear solicitudes

### Public
- Solo endpoints públicos
- Sin autenticación
- Lectura de contenido público

---

## 🔧 Comandos Útiles

### Crear Usuario Administrador
```bash
npm run create-admin
```

### Verificar Estado de Seguridad
```bash
curl http://localhost:3000/health
```

### Cambiar Contraseña de Admin
```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "oldPassword": "Admin2024!",
    "newPassword": "NuevaPassword123!"
  }'
```

---

## ⚠️ Mejores Prácticas

### ✅ Hacer
- Cambiar credenciales por defecto
- Usar HTTPS en producción
- Mantener JWT_SECRET seguro
- Rotar tokens regularmente
- Monitorear logs de seguridad
- Mantener dependencias actualizadas
- Hacer backups regulares

### ❌ NO Hacer
- Compartir tokens JWT
- Commit de archivos .env
- Usar contraseñas débiles
- Deshabilitar validaciones
- Ignorar logs de seguridad
- Exponer información sensible en errores

---

## 📋 Documentos Relacionados

- **[API_REFERENCE.md](../04-api-referencia/API_REFERENCE.md)** - Endpoints de autenticación
- **[DEPLOYMENT.md](../05-despliegue/DEPLOYMENT.md)** - Seguridad en producción
- **[ARCHITECTURE.md](../08-arquitectura/ARCHITECTURE.md)** - Arquitectura de seguridad

---

[← Volver al índice principal](../README.md)
