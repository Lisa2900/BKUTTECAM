import sequelize, { connectDatabase } from './database';
import Texto from '../models/Texto';
import Area from '../models/Area';
import SolicitudesConstanciasKardex from '../models/Solicitud_Constancia';
// Importar asociaciones para que se registren correctamente
import '../models/associations';

export const syncDatabase = async (force: boolean = false): Promise<void> => {
  // Probar conexión primero
  await connectDatabase();
  
  // Sincronizar modelos con la base de datos
  await sequelize.sync({ force });
  
  if (force) {
    console.log('🔄 Base de datos reiniciada');
    
    // Datos de prueba (opcional)
    await seedDatabase();
  } else {
    console.log('✅ Modelos sincronizados con la base de datos');
    console.log('🔗 Asociaciones de Area → Categorias → Archivos registradas');
  }
};

// Función para insertar datos iniciales
export const seedDatabase = async (): Promise<void> => {
  try {
    const textosIniciales = [
      {
        contenido: 'Bienvenido a la Universidad Tecnológica de Tecamachalco'
      },
      {
        contenido: 'La UTTECAM se compromete con la excelencia académica'
      },
      {
        contenido: 'Ofrecemos carreras técnicas y de ingeniería de vanguardia'
      }
    ];

    await Texto.bulkCreate(textosIniciales);
    console.log('🌱 Datos iniciales insertados');
  } catch (error) {
    console.error('❌ Error al insertar datos iniciales:', error);
  }
};