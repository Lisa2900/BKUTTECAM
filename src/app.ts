import express from 'express';
import cors from 'cors';
import path from 'path';
import textosRouter from './routes/textos';
import nosotrosRouter from './routes/nosotros';
import directorioRouter from './routes/directorio';
import formularioRouter from './routes/formulario';
import { notFound, errorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta principal
app.get('/', (_req, res) => {
  res.json({ 
    mensaje: 'API UTTECAM operativa', 
    version: '1.0.0',
    endpoints: {
      health: '/health',
      textos: '/api/textos',
      nosotros: '/api/nosotros',
      directorios: '/api/directorios',
      formularios: '/api/formularios'
    }
  });
});

// Rutas de la API
app.use('/api/nosotros', nosotrosRouter);
app.use('/api/directorios', directorioRouter);
app.use('/api/formularios', formularioRouter);

// Ruta de health check mejorado con Sequelize
app.get('/health', async (_req, res) => {
  const health: any = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    api_version: '2.0.0'
  };

  try {
    // Importar Sequelize y modelo
    const sequelize = require('./config/database').default;
    const Texto = require('./models/Texto').default;
    
    // Verificar conexión con authenticate
    await sequelize.authenticate();
    
    // Hacer consulta real para confirmar funcionamiento
    const totalRecords = await Texto.count();
    
    health.database = 'connected';
    health.sequelize = 'authenticated';
    health.totalRecords = totalRecords;
    
  } catch (error: any) {
    health.database = 'disconnected';
    health.db_error = error.message;
  }

  res.json(health);
});

app.use('/api/textos', textosRouter);

app.use(notFound);
app.use(errorHandler);

export default app;