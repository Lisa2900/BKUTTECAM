import sequelize, { connectDatabase } from './database';
import Texto from '../models/Texto';
import Area from '../models/Area';
import SolicitudesConstanciasKardex from '../models/Solicitud_Constancia';
import NosotrosContent from '../models/Nosotros';
import Calendario from '../models/Calendario';
import HeroSlide from '../models/HeroSlide';
import Evento from '../models/Evento';
import Noticia from '../models/Noticia';
import Anuncio from '../models/Anuncio';
import Carrera from '../models/Carrera';
import VideoInstitucional from '../models/VideoInstitucional';
import ModeloEducativo from '../models/ModeloEducativo';
import { ProcesoAdmision } from '../models/ProcesoAdmision';
import { TramitesVista } from '../models/TramitesVista';
import { FormularioConfig } from '../models/FormularioConfig';
import { ConvocatoriaTitulo } from '../models/ConvocatoriaTitulo';
import { ConvocatoriaDocumento } from '../models/ConvocatoriaDocumento';
import { PersonalCarrera } from '../models/PersonalCarrera';
import { CarreraSimple } from '../models/CarreraSimple';
import { OpcionReinscripcion } from '../models/OpcionReinscripcion';
import { SeccionReinscripcion } from '../models/SeccionReinscripcion';
import BecaSection from '../models/BecaSection';
import RelojDigital from '../models/RelojDigital';
import EstadiaDocumento from '../models/EstadiaDocumento';
import TipoEstadia from '../models/TipoEstadia';
import ServicioTecnologico from '../models/ServicioTecnologico';
import VinculacionBannerDocumento from '../models/VinculacionBannerDocumento';
import PracticasEstadiasBanner from '../models/PracticasEstadiasBanner';
import EducacionContinuaCurso from '../models/EducacionContinuaCurso';
import EducacionContinuaInfo from '../models/EducacionContinuaInfo';
import ServicioSocialDocumento from '../models/ServicioSocialDocumento';
// import ServicioSocialTipo from '../models/ServicioSocialTipo';
import ServicioTecnologicoRealizado from '../models/ServicioTecnologicoRealizado';
import MovilidadInternacional from '../models/MovilidadInternacional';
import BolsaTrabajoHeader from '../models/BolsaTrabajoHeader';
import BolsaTrabajoItem from '../models/BolsaTrabajoItem';
import EncuentroEgresados from '../models/EncuentroEgresados';
import EntidadCertificacionEvaluacion from '../models/EntidadCertificacionEvaluacion';
import MiembroSniiTipo from '../models/MiembroSniiTipo';
import MiembroSNII from '../models/MiembroSNII';
import Comite from '../models/Comite';
import ComiteCategory from '../models/ComiteCategory';
import DocumentoComite from '../models/DocumentoComite';
import ProgramaDesarrollo from '../models/ProgramaDesarrollo';
import ProgramaDesarrolloCategory from '../models/ProgramaDesarrolloCategory';
import NormatividadCategory from '../models/NormatividadCategory';
import NormatividadDocument from '../models/NormatividadDocument';
import SeminarioCafeRecurso from '../models/SeminarioCafeRecurso';
import Formulario from '../models/Formulario';
import Directorios from '../models/Directorios';
import Archivos from '../models/Archivos';
import Categorias from '../models/Categorias';
import Organigrama from '../models/Organigrama';
import PortalEstudiantes from '../models/PortalEstudiantes';
import ProductoInvestigacion from '../models/ProductoInvestigacion';
import SeminarioCafeRecurso from '../models/SeminarioCafeRecurso';
// Importar asociaciones para que se registren correctamente
import '../models/associations';

export const syncDatabase = async (force: boolean = false): Promise<void> => {
  // Probar conexión primero
  await connectDatabase();

  // Importar todos los modelos para que se registren en Sequelize
  const models = [
    EntidadCertificacionEvaluacion,
    Texto,
    Area,
    SolicitudesConstanciasKardex,
    NosotrosContent,
    Calendario,
    HeroSlide,
    Evento,
    Noticia,
    Anuncio,
    Carrera,
    VideoInstitucional,
    RelojDigital,
    ModeloEducativo,
    ProcesoAdmision,
    TramitesVista,
    FormularioConfig,
    ConvocatoriaTitulo,
    ConvocatoriaDocumento,
    PersonalCarrera,
    CarreraSimple,
    OpcionReinscripcion,
    SeccionReinscripcion,
    BecaSection,
    EstadiaDocumento,
    TipoEstadia,
    ServicioTecnologico,
    VinculacionBannerDocumento,
    PracticasEstadiasBanner,
    EducacionContinuaCurso,
    EducacionContinuaInfo,
    ServicioSocialDocumento,
    // ServicioSocialTipo,
    ServicioTecnologicoRealizado,
    MovilidadInternacional,
    BolsaTrabajoHeader,
    BolsaTrabajoItem,
    EncuentroEgresados,
    MiembroSniiTipo,
    MiembroSNII,
    Comite,
    ComiteCategory,
    DocumentoComite,
    ProgramaDesarrollo,
    ProgramaDesarrolloCategory,
    NormatividadCategory,
    NormatividadDocument,
    Organigrama,
    PortalEstudiantes,
    ProductoInvestigacion,
    SeminarioCafeRecurso,
    Formulario,
    Directorios,
    Archivos,
    Categorias,
    Organigrama,
  ];

  // Sincronizar modelos con la base de datos
  // await sequelize.sync({ force, alter: true });
  
  for (const model of models) {
    try {
      await model.sync({ force, alter: true });
      console.log(`✅ Modelo ${model.name} sincronizado`);
    } catch (error: any) {
      // Ignorar error de "Too many keys" en Area (índices duplicados)
      if (model.name === 'Area' && error.original?.code === 'ER_TOO_MANY_KEYS') {
        console.warn(`⚠️ Advertencia: Se omitió la sincronización de 'Area' debido a índices duplicados (ER_TOO_MANY_KEYS). La tabla ya existe.`);
      } else {
        console.error(`❌ Error al sincronizar modelo ${model.name}:`, error.message);
        // No lanzar error para permitir que otros modelos se sincronicen
        // throw error; 
      }
    }
  }

  if (force) {
    console.log('🔄 Base de datos reiniciada - Tablas creadas');
    console.log('📋 Modelos registrados: Texto, Area, SolicitudesConstanciasKardex, NosotrosContent, Calendario, HeroSlide, Evento, Noticia, Anuncio, Carrera');
  } else {
    console.log('✅ Modelos sincronizados con la base de datos');
    console.log('🔗 Asociaciones registradas correctamente');
  }
};

// Función para insertar datos iniciales (usar scripts separados)
export const seedDatabase = async (): Promise<void> => {
  console.log('💡 Los datos iniciales se insertan con scripts separados:');
  console.log('   - npm run seed:areas');
  console.log('   - ts-node scripts/seed-nosotros.ts');
};