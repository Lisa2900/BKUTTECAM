/**
 * Script para poblar las áreas de documentos en la base de datos
 * Ejecutar con: npm run seed:areas
 */

import sequelize from '../src/config/database';
import Area from '../src/models/Area';

const AREAS = [
  { ID_Area: 1, Nombre: 'Finanzas' },
  { ID_Area: 2, Nombre: 'Recursos Humanos' },
  { ID_Area: 3, Nombre: 'Gestión Ambiental' },
  { ID_Area: 4, Nombre: 'Información de Estadía' },
  { ID_Area: 5, Nombre: 'Gestión de Calidad' },
  { ID_Area: 6, Nombre: 'Coordinación de Género' },
];

async function seedAreas() {
  try {
    console.log('🌱 Poblando áreas...\n');

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos\n');

    let creadas = 0;
    let existentes = 0;

    for (const areaData of AREAS) {
      try {
        const [area, created] = await Area.findOrCreate({
          where: { ID_Area: areaData.ID_Area },
          defaults: areaData
        });

        if (created) {
          console.log(`✅ Creada: ${area.Nombre} (ID: ${area.ID_Area})`);
          creadas++;
        } else {
          console.log(`⚠️  Ya existe: ${area.Nombre} (ID: ${area.ID_Area})`);
          existentes++;
        }
      } catch (error: any) {
        console.error(`❌ Error con "${areaData.Nombre}": ${error.message}`);
      }
    }

    console.log('\n📊 Resumen:');
    console.log(`   Creadas: ${creadas}`);
    console.log(`   Ya existían: ${existentes}`);
    console.log(`   Total: ${AREAS.length}\n`);

    console.log('✨ Proceso completado\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar
seedAreas()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
