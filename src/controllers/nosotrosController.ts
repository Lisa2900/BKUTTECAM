
import { Request, Response } from "express";

var contenido = [
  {
    id: 1,
    tipo: "¿Quiénes somos?",
    titulo: "UTTECAM",
    descripcion: "Somos una institución comprometida con la educación de calidad.",
    imagen: "https://example.com/imagen1.jpg",
    lista: [
      "Educación de calidad",
      "Innovación constante",
      "Compromiso social"
    ],
    fecha_creacion: "2023-10-01T12:00:00Z",
    fecha_actualizacion: "2023-10-01T12:00:00Z"
  }
];

export const crearContenido = async (req: Request, res: Response) => {
  try {
    const { titulo, texto } = req.body;
    const nuevoContenido = {
      id: contenido.length + 1,
      tipo: "Contenido personalizado",
      titulo,
      descripcion: texto || "",
      imagen: "",
      lista: [],
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString()
    };
    contenido.push(nuevoContenido);
    res.status(201).json({ message: "Contenido creado correctamente", data: nuevoContenido });
  } catch (error) {
    res.status(500).json({ message: "Error al crear contenido" });
  }
};

export const getNosotrosContenido = async (req: Request, res: Response) => {
  try {
    // Aquí iría la lógica para obtener el contenido de la tabla nosotros_contenido
    res.status(200).json({ message: "Contenido obtenido correctamente", data: contenido });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener contenido" });
  }
};

export const updateNosotrosContenido = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, texto } = req.body;

        // Aquí iría la lógica para actualizar el contenido en la tabla nosotros_contenido
        res.status(200).json({ message: "Contenido actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar contenido" });
    }
};

export const deleteNosotrosContenido = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        contenido = contenido.filter(item => item.id !== parseInt(id));
        res.status(200).json({ message: "Contenido eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar contenido" });
    }
};

