import ExtensionSection from '../src/models/ExtensionSection';
import sequelize from '../src/config/database';

const seedExtensionTalleres = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos establecida');

    const sections = [
      {
        slug: 'talleres-culturales',
        title: 'Talleres Culturales',
        description: 'Desarrolla tu creatividad y talento artístico en nuestros talleres especializados',
        banner_url: '/public/Actividades Culturales y Deportivas/Culturales/BANNER DEPORTIVOS CULTURALES_UTTECAM.jpg'
      },
      {
        slug: 'talleres-deportivos',
        title: 'Talleres Deportivos',
        description: 'Fomenta tu salud y espíritu competitivo en nuestros talleres deportivos',
        banner_url: '/public/Actividades Culturales y Deportivas/Deportivas/BANNER DEPORTIVOS_UTTECAM 1-01.jpg'
      }
    ];

    for (const sectionData of sections) {
      const [section, created] = await ExtensionSection.findOrCreate({
        where: { slug: sectionData.slug },
        defaults: sectionData
      });

      if (created) {
        console.log(`✅ Sección creada: ${sectionData.title}`);
      } else {
        console.log(`ℹ️ Sección ya existe: ${sectionData.title}`);
        // Update banner if it's different (optional, but good for fixing broken paths)
        if (section.banner_url !== sectionData.banner_url) {
             await section.update({ banner_url: sectionData.banner_url });
             console.log(`🔄 Banner actualizado para: ${sectionData.title}`);
        }
      }
    }

    console.log('✅ Proceso de seed completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
};

seedExtensionTalleres();
