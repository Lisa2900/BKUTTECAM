import { CustomError } from "../../errors/CustomErrors";
import { PersonalCarrera } from "../../models/PersonalCarrera";

interface PersonalCarreraData {
  nombre: string;
  correo: string;
  carreras: string[];
  activo?: boolean;
}

interface PersonalCarreraResponse {
  id: string;
  nombre: string;
  correo: string;
  carreras: string[];
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PersonalCarreraService {

  /**
   * POST - Crear personal
   */
  async create(data: PersonalCarreraData): Promise<PersonalCarreraResponse> {
    try {
      const { nombre, correo, carreras, activo } = data;

      // Validaciones
      if (!nombre || nombre.trim() === '') {
        throw CustomError.badRequest("El nombre es requerido.");
      }

      if (!correo || correo.trim() === '') {
        throw CustomError.badRequest("El correo es requerido.");
      }

      if (!carreras || !Array.isArray(carreras) || carreras.length === 0) {
        throw CustomError.badRequest("Debe asignar al menos una carrera.");
      }

      // Verificar si ya existe el correo
      const existente = await PersonalCarrera.findOne({ where: { correo } });
      if (existente) {
        throw CustomError.badRequest(`Ya existe personal con el correo '${correo}'.`);
      }

      const personal = await PersonalCarrera.create({
        nombre,
        correo,
        carreras,
        activo: activo !== undefined ? activo : true
      });

      return this.formatResponse(personal);

    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en PersonalCarreraService.create:", error);
      throw CustomError.internalServer("Error al crear el personal.");
    }
  }

  /**
   * GET - Obtener todo el personal
   */
  async getAll(): Promise<PersonalCarreraResponse[]> {
    try {
      const personal = await PersonalCarrera.findAll({
        order: [['nombre', 'ASC']]
      });

      return personal.map(p => this.formatResponse(p));

    } catch (error) {
      console.error("Error en PersonalCarreraService.getAll:", error);
      throw CustomError.internalServer("Error al obtener el personal.");
    }
  }

  /**
   * GET - Obtener personal por ID
   */
  async getById(id: string): Promise<PersonalCarreraResponse> {
    try {
      const personal = await this.findById(id);
      return this.formatResponse(personal);

    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en PersonalCarreraService.getById:", error);
      throw CustomError.internalServer("Error al obtener el personal.");
    }
  }

  /**
   * PUT - Actualizar personal
   */
  async update(id: string, data: Partial<PersonalCarreraData>): Promise<PersonalCarreraResponse> {
    try {
      const personal = await this.findById(id);

      if (data.nombre !== undefined) personal.nombre = data.nombre;
      if (data.correo !== undefined) {
        // Verificar que el correo no esté en uso por otro personal
        const existente = await PersonalCarrera.findOne({
          where: { correo: data.correo }
        });
        if (existente && existente.id !== id) {
          throw CustomError.badRequest(`El correo '${data.correo}' ya está en uso.`);
        }
        personal.correo = data.correo;
      }
      if (data.carreras !== undefined) {
        if (!Array.isArray(data.carreras) || data.carreras.length === 0) {
          throw CustomError.badRequest("Debe asignar al menos una carrera.");
        }
        personal.carreras = data.carreras;
      }
      if (data.activo !== undefined) personal.activo = data.activo;

      await personal.save();
      return this.formatResponse(personal);

    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en PersonalCarreraService.update:", error);
      throw CustomError.internalServer("Error al actualizar el personal.");
    }
  }

  /**
   * DELETE - Eliminar personal
   */
  async delete(id: string): Promise<{ message: string }> {
    try {
      const personal = await this.findById(id);
      await personal.destroy();
      return { message: "Personal eliminado exitosamente." };

    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("Error en PersonalCarreraService.delete:", error);
      throw CustomError.internalServer("Error al eliminar el personal.");
    }
  }

  /**
   * Obtener correo de personal según carrera
   */
  async getCorreoByCarrera(carrera: string): Promise<string | null> {
    try {
      const personal = await PersonalCarrera.findAll({
        where: { activo: true }
      });

      // Buscar personal que tenga asignada esta carrera
      for (const p of personal) {
        if (p.carreras.includes(carrera)) {
          return p.correo;
        }
      }

      return null; // No hay personal asignado para esta carrera

    } catch (error) {
      console.error("Error en PersonalCarreraService.getCorreoByCarrera:", error);
      return null;
    }
  }

  /**
   * Helper: Buscar por ID
   */
  private async findById(id: string): Promise<PersonalCarrera> {
    if (!id || id.trim() === '') {
      throw CustomError.badRequest("El ID es requerido.");
    }

    const personal = await PersonalCarrera.findByPk(id);

    if (!personal) {
      throw CustomError.notFound(`No se encontró personal con ID: ${id}`);
    }

    return personal;
  }

  /**
   * Formatea la respuesta
   */
  private formatResponse(personal: PersonalCarrera): PersonalCarreraResponse {
    return {
      id: personal.id,
      nombre: personal.nombre,
      correo: personal.correo,
      carreras: personal.carreras,
      activo: personal.activo,
      createdAt: personal.createdAt,
      updatedAt: personal.updatedAt
    };
  }
}
