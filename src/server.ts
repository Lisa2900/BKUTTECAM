import app from './app';
import { syncDatabase } from './config/syncDatabase';
import { ensureExtensionAreas } from './startup/ensureExtensionAreas';
import { scheduleTempUploadsCleanup } from './helpers/deleteTempFiles';

const PORT = process.env.PORT || 3000;

// Inicializar servidor
const startServer = async () => {
  try {
    // Iniciar servidor primero
    const server = app.listen(PORT, () => {
      scheduleTempUploadsCleanup(24 * 60 * 60 * 1000, { olderThanMs: 15 * 60 * 1000, onlyTmpPrefix: true });
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📡 API disponible en: http://localhost:${PORT}`);
      console.log(`📋 Endpoints: http://localhost:${PORT}/api/textos`);
      console.log(`📊 Estadísticas: http://localhost:${PORT}/api/textos/stats`);
    });

    console.log('🔔 Prioridad 1 establecida');

    // Luego intentar conectar la base de datos
    try {
      await syncDatabase(false); // Cambiar a true para reset completo
      console.log('✅ Sequelize configurado y base de datos sincronizada');
      try {
        await ensureExtensionAreas();
      } catch (err) {
        console.warn('⚠️  Error al asegurar las areas de Extensión:', (err as Error).message || err);
      }
    } catch (dbError: any) {
      console.warn('⚠️  Advertencia: No se pudo conectar a la base de datos');
      console.warn('   Verifica tu configuración de MySQL y el archivo .env');
      console.warn('   Error:', dbError.message);
      console.warn('   💡 Para usar Sequelize necesitas:');
      console.warn('      1. MySQL corriendo');
      console.warn('      2. Base de datos "uttecam" creada');
      console.warn('      3. Archivo .env configurado');
      console.warn('   El servidor continuará ejecutándose...');
    }

  } catch (e: any) {
    console.error('❌ Error crítico al iniciar servidor:', e.message);
    process.exit(1);
  }
};

startServer();