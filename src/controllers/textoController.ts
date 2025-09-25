import { Request, Response, NextFunction } from 'express';
import { getAllTextos, getTextoById, createTexto, updateTexto, deleteTexto } from '../models/textoModel';

export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getAllTextos();
    res.json(data);
  } catch (e) { next(e); }
}

export async function obtener(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const texto = await getTextoById(id);
    if (!texto) return res.status(404).json({ error: 'No encontrado' });
    res.json(texto);
  } catch (e) { next(e); }
}

export async function crear(req: Request, res: Response, next: NextFunction) {
  try {
    const { contenido } = req.body;
    if (typeof contenido !== 'string' || !contenido.trim()) {
      return res.status(400).json({ error: 'contenido requerido (string no vacío)' });
    }
    const nuevo = await createTexto(contenido.trim());
    res.status(201).json(nuevo);
  } catch (e) { next(e); }
}

export async function actualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { contenido } = req.body;
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    if (typeof contenido !== 'string' || !contenido.trim()) {
      return res.status(400).json({ error: 'contenido requerido' });
    }
    const ok = await updateTexto(id, contenido.trim());
    if (!ok) return res.status(404).json({ error: 'No encontrado' });
    res.json({ id, contenido: contenido.trim() });
  } catch (e) { next(e); }
}

export async function eliminar(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const ok = await deleteTexto(id);
    if (!ok) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (e) { next(e); }
}