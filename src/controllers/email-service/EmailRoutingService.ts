import { EMAIL_ROUTING, ADMIN_EMAIL } from '../../config/emailRouting';
import { PersonalCarreraService } from '../personal-carreras/PersonalCarreraService';
import { CustomError } from '../../errors/CustomErrors';

const personalCarreraService = new PersonalCarreraService();

export class EmailRoutingService {
  /**
   * Normaliza un string para comparaciones (case-insensitive + Unicode)
   * @private
   */
  private static normalize(str: string): string {
    return str
      .trim()
      .toLowerCase()
      .normalize('NFD')       // Descompone caracteres (á → a + ́)
      .replace(/[\u0300-\u036f]/g, ''); // Elimina marcas diacríticas
  }

  /**
   * Obtiene el correo del responsable según área y carrera
   * Sistema de fallback en cascada:
   * 1. Busca en la base de datos (PersonalCarrera)
   * 2. Si no encuentra, busca en emailRouting.ts (configuración estática)
   * 3. Si tampoco encuentra, lanza un error
   * 
   * @param area - TSU, LIC o ING
   * @param carrera - Nombre de la carrera
   * @returns Email del personal responsable
   * @throws CustomError si no se encuentra la carrera en ningún lado
   */
  static async getResponsibleEmail(area: string, carrera: string): Promise<string> {
    try {
      // 1️⃣ PRIMERA OPCIÓN: Buscar en la base de datos (PersonalCarrera)
      const correoDB = await personalCarreraService.getCorreoByCarrera(carrera);

      if (correoDB) {
        console.log(`📧 Responsable encontrado en BD: ${carrera} → ${correoDB}`);
        return correoDB;
      }

      console.log(`⚠️  No se encontró en BD: ${carrera}. Buscando en configuración estática...`);

      // 2️⃣ SEGUNDA OPCIÓN: Buscar en emailRouting.ts (fallback)
      const normalizedArea = area.toUpperCase().trim();
      const normalizedCarrera = this.normalize(carrera);

      const match = EMAIL_ROUTING.find(
        mapping =>
          mapping.area === normalizedArea &&
          this.normalize(mapping.carrera) === normalizedCarrera
      );

      if (match) {
        console.log(`📧 Responsable encontrado en configuración estática: ${carrera} (${normalizedArea}) → ${match.email} (${match.nombre})`);
        return match.email;
      }

      // 3️⃣ NO SE ENCONTRÓ EN NINGÚN LADO: Lanzar error
      console.error(`❌ Carrera no disponible: ${carrera} (${area})`);
      throw CustomError.badRequest(
        `La carrera "${carrera}" no está disponible para envío de emails. Por favor, contacte al administrador para configurar esta carrera.`
      );

    } catch (error) {
      // Si el error ya es un CustomError, lo propagamos
      if (error instanceof CustomError) {
        throw error;
      }

      // Si es otro tipo de error, lo logueamos y lanzamos un error genérico
      console.error(`❌ Error inesperado al buscar responsable para ${carrera}:`, error);
      throw CustomError.internalServer('Error al procesar la solicitud de envío de email.');
    }
  }

  /**
   * Obtiene TODOS los correos destino: responsable + admin
   * @param area - TSU, LIC o ING
   * @param carrera - Nombre de la carrera
   * @returns Array con [responsable, admin] o solo [admin] si son el mismo
   * @throws CustomError si no se encuentra la carrera
   */
  static async getAllDestinations(area: string, carrera: string): Promise<string[]> {
    // Esto puede lanzar CustomError si no se encuentra la carrera
    const responsible = await this.getResponsibleEmail(area, carrera);

    // Siempre incluye el email administrativo
    const destinations = [responsible];

    // Evita duplicados si el responsable ES el admin
    if (responsible !== ADMIN_EMAIL) {
      destinations.push(ADMIN_EMAIL);
    }

    console.log(`📬 Destinatarios: ${destinations.join(', ')}`);
    return destinations;
  }

  /**
   * Valida si existe un responsable para esa combinación
   * Busca primero en BD, luego en configuración estática
   */
  static async hasResponsibleForCareer(area: string, carrera: string): Promise<boolean> {
    try {
      // Intenta buscar en BD
      const correoDB = await personalCarreraService.getCorreoByCarrera(carrera);
      if (correoDB) return true;

      // Intenta buscar en configuración estática
      const normalizedArea = area.toUpperCase().trim();
      const normalizedCarrera = this.normalize(carrera);

      const existsInConfig = EMAIL_ROUTING.some(
        mapping =>
          mapping.area === normalizedArea &&
          this.normalize(mapping.carrera) === normalizedCarrera
      );

      return existsInConfig;

    } catch (error) {
      console.error(`Error al validar responsable para ${carrera}:`, error);
      return false;
    }
  }

  /**
   * Obtiene solo el email administrativo (para casos especiales)
   */
  static getAdminEmail(): string {
    return ADMIN_EMAIL;
  }
}
