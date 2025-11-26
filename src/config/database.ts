import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'uttecam',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  dialect: 'mysql',
  logging: false, // Deshabilitar logs SQL para limpiar la consola
  dialectOptions: {
    // Aumentar max_allowed_packet para permitir JSONs grandes
    maxAllowedPacket: 64 * 1024 * 1024, // 64MB
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  timezone: '-06:00', // Ajustar según tu zona horaria
});

// Función para probar la conexión
export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos establecida correctamente');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
  }
};

export default sequelize;