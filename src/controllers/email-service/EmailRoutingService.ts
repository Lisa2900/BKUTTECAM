import { EMAIL_ROUTING, DEFAULT_EMAIL, ADMIN_EMAIL, CareerEmailMapping } from '../../config/emailRouting';

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
   * @param area - TSU, LIC o ING
   * @param carrera - Nombre de la carrera
   * @returns Email del personal responsable o email por defecto
   */
  static getResponsibleEmail(area: string, carrera: string): string {
    const normalizedArea = area.toUpperCase().trim();
    const normalizedCarrera = this.normalize(carrera);

    const match = EMAIL_ROUTING.find(
      mapping =>
        mapping.area === normalizedArea &&
        this.normalize(mapping.carrera) === normalizedCarrera
    );

    if (match) {
      console.log(`📧 Responsable: ${normalizedCarrera} (${normalizedArea}) → ${match.email} (${match.nombre})`);
      return match.email;
    }

    console.warn(`⚠️  No se encontró responsable para: ${normalizedCarrera} (${normalizedArea}). Usando email por defecto.`);
    return DEFAULT_EMAIL;
  }

  /**
   * Obtiene TODOS los correos destino: responsable + admin
   * @param area - TSU, LIC o ING
   * @param carrera - Nombre de la carrera
   * @returns Array con [responsable, admin] o [admin] si no hay responsable
   */
  static getAllDestinations(area: string, carrera: string): string[] {
    const responsible = this.getResponsibleEmail(area, carrera);

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
   */
  static hasResponsibleForCareer(area: string, carrera: string): boolean {
    const normalizedArea = area.toUpperCase().trim();
    const normalizedCarrera = this.normalize(carrera);

    return EMAIL_ROUTING.some(
      mapping =>
        mapping.area === normalizedArea &&
        this.normalize(mapping.carrera) === normalizedCarrera
    );
  }

  /**
   * Obtiene solo el email administrativo (para casos especiales)
   */
  static getAdminEmail(): string {
    return ADMIN_EMAIL;
  }
}
