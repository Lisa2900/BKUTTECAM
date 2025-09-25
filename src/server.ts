import app from './app';
import { dbPing } from './config/db';

const port = Number(process.env.PORT) || 3000;

async function start() {
  try {
    // Iniciar servidor independientemente de la DB para desarrollo
    const server = app.listen(port, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
    });

    // Intentar conectar a la base de datos
    try {
      await dbPing();
      console.log('✅ Base de datos conectada correctamente');
    } catch (dbError: any) {
      console.warn('⚠️  Advertencia: No se pudo conectar a la base de datos');
      console.warn('   Verifica tu configuración de DB en el archivo .env');
      console.warn('   Error:', dbError.message);
      console.warn('   El servidor continuará ejecutándose para desarrollo...');
    }

  } catch (e: any) {
    console.error('❌ Error iniciando el servidor:', e.message);
    process.exit(1);
  }
}

start();