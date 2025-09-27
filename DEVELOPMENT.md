# Configuración de desarrollo para UTTECAM API

## 🚀 Inicio rápido

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

3. Ejecutar en desarrollo:
```bash
npm run dev
```

## 🗂️ Estructura limpia del proyecto

```
src/
├── config/
│   ├── database.ts       # Configuración Sequelize
│   └── syncDatabase.ts   # Sincronización y seeds
├── models/
│   └── Texto.ts         # Modelo Sequelize
├── controllers/
│   └── textoController.ts
├── routes/
│   └── textos.ts
├── middleware/
│   └── errorHandler.ts
├── app.ts              # Configuración Express
└── server.ts          # Punto de entrada
```

## 🧹 Scripts de limpieza

```bash
npm run clean       # Limpiar archivos compilados
npm run build       # Compilar limpio
```

## 📁 Archivos de backup

Los archivos anteriores están en `/backup/` para referencia.