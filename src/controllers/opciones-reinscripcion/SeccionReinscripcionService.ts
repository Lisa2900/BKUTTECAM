import { CustomError } from "../../errors/CustomErrors";
import { SeccionReinscripcion } from "../../models/SeccionReinscripcion";

interface SeccionReinscripcionData {
  titulo: string;
  subtitulo?: string;
}

interface SeccionReinscripcionResponse {
  id: string;
  titulo: string;
  subtitulo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class SeccionReinscripcionService {

  /**
   * POST/PUT - Crear o actualizar sección (solo debe haber 1 registro)
   */
  async createOrUpdate(data: SeccionReinscripcionData): Promise<SeccionReinscripcionResponse> {
    try {
      const { titulo, subtitulo } = data;

      // Validaciones
      if (!titulo || titulo.trim() === '') {
        throw CustomError.badRequest("El título es requerido.");
      }

      // Buscar si ya existe una sección
      const seccionExistente = await SeccionReinscripcion.findOne();

      if (seccionExistente) {
        // Actualizar la existente
        await seccionExistente.update({
          titulo: titulo.trim(),
          subtitulo: subtitulo ? subtitulo.trim() : null
        });

        return this.formatResponse(seccionExistente);
      }

      // Crear nueva sección
      const nuevaSeccion = await SeccionReinscripcion.create({
        titulo: titulo.trim(),
        subtitulo: subtitulo ? subtitulo.trim() : null
      });

      return this.formatResponse(nuevaSeccion);

    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en SeccionReinscripcionService.createOrUpdate:", error);
      throw CustomError.internalServer("Error al guardar la sección de reinscripción.");
    }
  }

  /**
   * GET - Obtener la sección (solo hay 1)
   */
  async get(): Promise<SeccionReinscripcionResponse | null> {
    try {
      const seccion = await SeccionReinscripcion.findOne();

      if (!seccion) {
        return null;
      }

      return this.formatResponse(seccion);

    } catch (error) {
      console.error("Error en SeccionReinscripcionService.get:", error);
      throw CustomError.internalServer("Error al obtener la sección de reinscripción.");
    }
  }

  /**
   * Formatear respuesta
   */
  private formatResponse(seccion: SeccionReinscripcion): SeccionReinscripcionResponse {
    return {
      id: seccion.id,
      titulo: seccion.titulo,
      subtitulo: seccion.subtitulo,
      createdAt: seccion.createdAt,
      updatedAt: seccion.updatedAt
    };
  }
}
