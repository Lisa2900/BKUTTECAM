import sequelize, { connectDatabase } from '../../src/config/database';

async function run() {
  await connectDatabase();

  const candidates = [
    'UC_Nombre_Categoria',
    'Nombre',
    'UC_Nombre'
  ];

  for (const idx of candidates) {
    try {
      console.log(`Intentando eliminar índice único '${idx}' en tabla 'categorias'...`);
      await sequelize.query(`ALTER TABLE categorias DROP INDEX \`${idx}\``);
      console.log(`Índice '${idx}' eliminado correctamente (si existía).`);
      // Si se eliminó uno, terminamos
      return process.exit(0);
    } catch (err: any) {
      // Mostrar advertencia y continuar con siguiente candidato
      console.warn(`No se pudo eliminar índice '${idx}': ${err.message}`);
    }
  }

  console.log('Terminó el intento de eliminación de índices. Si persiste la restricción, revisa manualmente los índices de la tabla `categorias`.');
  process.exit(0);
}

run().catch((err) => {
  console.error('Error ejecutando el script:', err);
  process.exit(1);
});
