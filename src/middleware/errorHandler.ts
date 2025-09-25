import { Request, Response, NextFunction } from 'express';

export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: 'Ruta no encontrada' });
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'Error interno', detalle: process.env.NODE_ENV === 'development' ? String(err) : undefined });
}