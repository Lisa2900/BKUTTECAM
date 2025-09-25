import express from 'express';
import cors from 'cors';
import textosRouter from './routes/textos';
import { notFound, errorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (_req, res) => {
  res.json({ 
    mensaje: 'API UTTECAM operativa', 
    version: '1.0.0',
    endpoints: {
      health: '/health',
      textos: '/api/textos'
    }
  });
});

// Ruta de health check
app.get('/health', async (_req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'disconnected'
  };

  try {
    const { dbPing } = require('./config/db');
    await dbPing();
    health.database = 'connected';
  } catch (error) {
    health.database = 'disconnected';
  }

  res.json(health);
});

app.use('/api/textos', textosRouter);

app.use(notFound);
app.use(errorHandler);

export default app;