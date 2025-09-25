import { pool } from '../config/db';

export interface Texto {
  id: number;
  contenido: string;
}

export async function getAllTextos(): Promise<Texto[]> {
  const [rows] = await pool.query('SELECT id, contenido FROM textos ORDER BY id');
  return rows as Texto[];
}

export async function getTextoById(id: number): Promise<Texto | null> {
  const [rows] = await pool.query('SELECT id, contenido FROM textos WHERE id = ?', [id]);
  const arr = rows as Texto[];
  return arr.length ? arr[0] : null;
}

export async function createTexto(contenido: string): Promise<Texto> {
  const [result]: any = await pool.execute('INSERT INTO textos (contenido) VALUES (?)', [contenido]);
  return { id: result.insertId, contenido };
}

export async function updateTexto(id: number, contenido: string): Promise<boolean> {
  const [result]: any = await pool.execute('UPDATE textos SET contenido = ? WHERE id = ?', [contenido, id]);
  return result.affectedRows > 0;
}

export async function deleteTexto(id: number): Promise<boolean> {
  const [result]: any = await pool.execute('DELETE FROM textos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}