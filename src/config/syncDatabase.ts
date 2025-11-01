import sequelize, { connectDatabase } from './database';
import Texto from '../models/Texto';
import Area from '../models/Area';
import SolicitudesConstanciasKardex from '../models/Solicitud_Constancia';
import NosotrosContent from '../models/Nosotros';
import Calendario from '../models/Calendario';
// Importar asociaciones para que se registren correctamente
import '../models/associations';

export const syncDatabase = async (force: boolean = false): Promise<void> => {
  // Probar conexión primero
  await connectDatabase();

  // Importar todos los modelos para que se registren en Sequelize
  const models = [
    Texto,
    Area,
    SolicitudesConstanciasKardex,
    NosotrosContent,
    Calendario
  ];

  // Sincronizar modelos con la base de datos
  await sequelize.sync({ force });

  if (force) {
    console.log('🔄 Base de datos reiniciada - Tablas creadas');
    console.log('📋 Modelos registrados: Texto, Area, SolicitudesConstanciasKardex, NosotrosContent, Calendario');
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