import sequelize from '../src/config/database';
import ExtensionSection from '../src/models/ExtensionSection';
import ExtensionItem from '../src/models/ExtensionItem';
import ExtensionDocument from '../src/models/ExtensionDocument';

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Check is_enabled column exists in the table
    const [colsResult] = await sequelize.query("SHOW COLUMNS FROM extension_sections LIKE 'is_enabled'");
    const hasIsEnabled = Array.isArray(colsResult) && colsResult.length > 0;

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
      },
      {
        slug: 'servicio-medico',
        title: 'Servicio Médico',
        description: 'Atención médica y primeros auxilios para la comunidad universitaria',
        banner_url: '/public/ExtensionUniversitaria/ServicioMedico/SERVICIO MÉDICO.jpg'
      },
      {
        slug: 'ferias-profesiograficas',
        title: 'Ferias Profesiográficas',
        description: 'Conoce las oportunidades de empleo y prácticas empresariales',
        banner_url: '/public/ExtensionUniversitaria/DifusionyDivulgacion/Ferias/BANNER_FERIAS.jpg'
      },
      {
        slug: 'visitas-guiadas',
        title: 'Visitas Guiadas',
        description: 'Visitas guiadas para conocer la infraestructura y proyectos de UTTECAM',
        banner_url: '/public/ExtensionUniversitaria/DifusionyDivulgacion/Visitas/BANNER_VISITAS.jpg'
      }
    ];

    for (const sectionData of sections) {
      const [section, created] = await ExtensionSection.findOrCreate({
        where: { slug: sectionData.slug },
        defaults: sectionData
      });

      if (created) {
        console.log(`✅ Sección creada: ${sectionData.title}`);
        if (hasIsEnabled) await section.update({ is_enabled: true });
      } else {
        console.log(`ℹ️ Sección ya existe: ${sectionData.title}`);
        if (section.banner_url !== sectionData.banner_url) {
          await section.update({ banner_url: sectionData.banner_url });
          console.log(`🔄 Banner actualizado para: ${sectionData.title}`);
        }
        if (hasIsEnabled && section.is_enabled !== true) {
          await section.update({ is_enabled: true });
          console.log(`🔄 Sección habilitada: ${sectionData.title}`);
        }
      }

      // Create sample items if not present
      const existingItems = await ExtensionItem.findAll({ where: { section_id: section.id } });
      if (existingItems.length === 0) {
        const sampleItems: any = {
          'talleres-culturales': [
            { title: 'Taller de Dibujo', content: 'Clases semanales de dibujo artístico' },
            { title: 'Taller de Teatro', content: 'Sesiones prácticas y obra final' }
          ],
          'talleres-deportivos': [
            { title: 'Fútbol', content: 'Entrenamientos y torneos internos' },
            { title: 'Atletismo', content: 'Programa de acondicionamiento y pruebas' }
          ],
          'servicio-medico': [
            { title: 'Atención general', content: 'Servicios básicos y primeros auxilios' },
            { title: 'Campañas de salud', content: 'Jornadas preventivas y consultas' }
          ],
          'ferias-profesiograficas': [
            { title: 'Próxima Feria', content: 'Regístrate y conoce empresas participantes' }
          ],
          'visitas-guiadas': [
            { title: 'Visita al Laboratorio', content: 'Conoce las instalaciones de investigación' }
          ]
        };

        const itemsToCreate = sampleItems[section.slug] || [];
        for (const it of itemsToCreate) {
          await ExtensionItem.create({ section_id: section.id, title: it.title, content: it.content });
          console.log(`🆕 Item creado: ${it.title} en sección ${sectionData.title}`);
        }
      } else {
        console.log(`ℹ️ La sección ${sectionData.title} ya tiene ${existingItems.length} items`);
      }

      // Create sample documents for extension if not exist for some categories
      const categorySampleDocs: any = {
        'gacetas': [
          { title: 'Gaceta Abril 2025', file_url: '/public/ExtensionUniversitaria/Prensa y difusion/Gaceta_Abril_2025.pdf', mime_type: 'application/pdf', media_type: 'document' }
        ],
        'promocion': [
          { title: 'Flyer Promoción 2025', file_url: '/public/ExtensionUniversitaria/DifusionyDivulgacion/promocion/Flyer_Promo_2025.jpg', mime_type: 'image/jpeg', media_type: 'image' }
        ]
      };

      // We only add a small set of docs for 'promocion' and 'gacetas' categories via ExtensionDocument
      const categoriesToSeed = ['gacetas', 'promocion'];
      for (const cat of categoriesToSeed) {
        const exists = await ExtensionDocument.findAll({ where: { category: cat } });
        if (exists.length === 0) {
          const toCreate = categorySampleDocs[cat] || [];
          for (const d of toCreate) {
            await ExtensionDocument.create({ category: cat, title: d.title, file_url: d.file_url, cover_url: undefined, publication_date: new Date(), mime_type: d.mime_type, media_type: d.media_type });
            console.log(`🆕 Documento creado: ${d.title} (cat: ${cat})`);
          }
        } else {
          console.log(`ℹ️ Existen ${exists.length} documentos en la categoría ${cat}`);
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

seed();
