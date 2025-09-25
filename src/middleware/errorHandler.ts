import { Request, Response, NextFunction } from 'express';

export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: 'Ruta no encontrada' });
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  console.error('[ERROR]', err);
  
  // Error de conexión a la base de datos
  if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR' || err.errno) {
    return res.status(503).json({ 
      error: 'Servicio no disponible',
      mensaje: 'Error de conexión a la base de datos. Verifica la configuración.',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  // Error genérico
  res.status(500).json({ 
    error: 'Error interno del servidor',
    detalle: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
}