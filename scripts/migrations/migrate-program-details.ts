
import Carrera from '../src/models/Carrera';
import sequelize from '../src/config/database';

interface ProgramDetail {
  programId: number;
  targetName: string;
  targetSiglas: string;
  targetNivel: 'TSU' | 'Ingenieria' | 'Licenciatura';
  admissionProfile: string;
  graduateProfile: string;
  laborField: string[];
  studyPlan: { semester: string; subjects: string[] }[];
  competencies?: string[];
  educationalObjectives?: string[];
  graduateAttributes?: string[];
  profileImage: string;
}

const programDetails: ProgramDetail[] = [
  //SOFTWARE
  {
    programId: 1,
    targetName: "Ingeniería en Desarrollo y Gestión de Software",
    targetSiglas: "IDGS",
    targetNivel: "Ingenieria",
    profileImage: "SOFTWARE.jpg",
    admissionProfile: `
Habilidades y capacidades del aspirante:
Indagar, analizar, transmitir y comunicar información eficazmente a través del trabajo colaborativo e iniciativa propia para la resolución de problemas metodológicamente, guiando sus actividades con respeto a la diversidad cultural de forma cívica y ética para mejorar su entorno.

Habilidades y capacidades específicas del aspirante:
Pensamiento crítico, conocimientos básicos en matemáticas y ciencias, capacidad de organización para el desarrollo de proyectos e interés en el desarrollo tecnológico.
  `,

    graduateProfile: `
El Ingeniero en Tecnologías de la Información e Innovación Digital posee las competencias profesionales esenciales que respaldan su desempeño en el dinámico entorno laboral, tanto en el ámbito local, como regional y nacional, que le permitan desarrollar soluciones innovadoras de integración de tecnologías de la información mediante metodologías y herramientas de desarrollo de software, redes inteligentes, seguridad informática, internet de las cosas, sistemas inteligentes y administración de proyectos; con base en las normas y estándares aplicables enfocados a atender las áreas de oportunidad y optimizar los procesos y recursos de los diversos sectores empresariales.
  `,

    laborField: [
      "Desarrollador Front-End, Back-End o Full Stack",
      "Desarrollador de aplicaciones móviles",
      "Líder de proyectos de Tecnologías de la Información",
      "Director de proyectos de innovación digital",
      "Desarrollador de videojuegos",
      "Creador de contenidos digitales",
      "Director de negocios digitales",
      "Ingeniero de redes digitales",
      "Ingeniero de cómputo en la nube y virtualización",
      "Ingeniero DevOps",
      "Especialista en ciberseguridad y protección de datos",
      "Integrador de soluciones de infraestructura de redes inteligentes",
      "Líder de proyectos de infraestructura de redes inteligentes y ciberseguridad",
      "Administrador de TI",
      "Auditor de TI",
      "Administrador de redes",
      "Analista de Ciberseguridad",
      "Administrador de bases de datos",
      "Científico de datos",
      "Integrador de proyectos IoT",
      "Integrador de proyectos de Inteligencia Artificial y aprendizaje automático",
      "Consultor de proyectos de Tecnologías de la Información",
      "Educador tecnológico",
      "Ingeniero de calidad de software y pruebas",
      "Ingeniero de soporte y servicios",
      "Director de TI",
      "Arquitecto de software",
      "Diseñador de experiencia de usuario"
    ],

    studyPlan: [
      {
        semester: "Primero",
        subjects: [
          "Inglés I",
          "Desarrollo Humano y Valores",
          "Fundamentos Matemáticos",
          "Fundamentos de Redes",
          "Física",
          "Fundamentos de Programación",
          "Comunicación y Habilidades Digitales"
        ],
      },
      {
        semester: "Segundo",
        subjects: [
          "Inglés II",
          "Habilidades Socioemocionales y Manejo de Conflictos",
          "Cálculo Diferencial",
          "Conmutación y Enrutamiento de Redes",
          "Probabilidad y Estadística",
          "Programación Estructurada",
          "Sistemas Operativos"
        ],
      },
      {
        semester: "Tercero",
        subjects: [
          "Inglés III",
          "Desarrollo del Pensamiento y Toma de Decisiones",
          "Cálculo Integral",
          "Tópicos de Calidad para el Diseño de Software",
          "Bases de Datos",
          "Programación Orientada a Objetos",
          "Proyecto Integrador I"
        ],
      },
      {
        semester: "Cuarto",
        subjects: [
          "Inglés IV",
          "Ética Profesional",
          "Cálculo de Varias Variables",
          "Aplicaciones Web",
          "Estructura de Datos",
          "Desarrollo de Aplicaciones Móviles",
          "Análisis y Diseño de Software"
        ],
      },
      {
        semester: "Quinto",
        subjects: [
          "Inglés V",
          "Liderazgo de Equipos de Alto Desempeño",
          "Ecuaciones Diferenciales",
          "Aplicaciones Web Orientadas a Servicios",
          "Bases de Datos Avanzadas",
          "Estándares y Métricas para el Desarrollo de Software",
          "Proyecto Integrador II"
        ],
      },
      {
        semester: "Sexto",
        subjects: ["Estadía"]
      },
      {
        semester: "Séptimo",
        subjects: [
          "Inglés VI",
          "Habilidades Gerenciales",
          "Formulación de Proyectos de Tecnología",
          "Fundamentos de Inteligencia Artificial",
          "Ética y Legislación en Tecnologías de la Información",
          "Optativa I",
          "Seguridad Informática"
        ],
      },
      {
        semester: "Octavo",
        subjects: [
          "Inglés VII",
          "Electrónica Digital",
          "Gestión de Proyectos de Tecnología",
          "Programación para Inteligencia Artificial",
          "Administración de Servidores",
          "Optativa II",
          "Informática Forense"
        ],
      },
      {
        semester: "Noveno",
        subjects: [
          "Inglés VIII",
          "Internet de las Cosas",
          "Evaluación de Proyectos de Tecnología",
          "Ciencia de Datos",
          "Tecnologías Disruptivas",
          "Optativa III",
          "Proyecto Integrador III"
        ],
      },
      {
        semester: "Décimo",
        subjects: ["Estadía"]
      }
    ]
  },
  //REDES
  {
    programId: 2,
    targetName: "Ingeniería en Redes Inteligentes y Ciberseguridad",
    targetSiglas: "IRIC",
    targetNivel: "Ingenieria",
    profileImage: "TICS.jpg",
    admissionProfile: `
Habilidades y capacidades del aspirante:
Indagar, analizar, transmitir y comunicar información eficazmente a través del trabajo colaborativo e iniciativa propia para la resolución de problemas metodológicamente, guiando sus actividades con respeto a la diversidad cultural de forma cívica y ética para mejorar su entorno.

Habilidades y capacidades específicas del aspirante:
Pensamiento crítico, conocimientos básicos en matemáticas y ciencias, capacidad de organización para el desarrollo de proyectos e interés en el desarrollo tecnológico.
  `,

    graduateProfile: `
El Ingeniero en Tecnologías de la Información e Innovación Digital posee las competencias profesionales esenciales que respaldan su desempeño en el dinámico entorno laboral, tanto en el ámbito local, como regional y nacional, que le permitan desarrollar soluciones innovadoras de integración de tecnologías de la información mediante metodologías y herramientas de desarrollo de software, redes inteligentes, seguridad informática, internet de las cosas, sistemas inteligentes y administración de proyectos; con base en las normas y estándares aplicables enfocados a atender las áreas de oportunidad y optimizar los procesos y recursos de los diversos sectores empresariales.
  `,

    laborField: [
      "Desarrollador Front-End, Back-End o Full Stack",
      "Desarrollador de aplicaciones móviles",
      "Líder de proyectos de Tecnologías de la Información",
      "Director de proyectos de innovación digital",
      "Desarrollador de videojuegos",
      "Creador de contenidos digitales",
      "Director de negocios digitales",
      "Ingeniero de redes digitales",
      "Ingeniero de cómputo en la nube y virtualización",
      "Ingeniero DevOps",
      "Especialista en ciberseguridad y protección de datos",
      "Integrador de soluciones de infraestructura de redes inteligentes",
      "Líder de proyectos de infraestructura de redes inteligentes y ciberseguridad",
      "Administrador de TI",
      "Auditor de TI",
      "Administrador de redes",
      "Analista de Ciberseguridad",
      "Administrador de bases de datos",
      "Científico de datos",
      "Integrador de proyectos IoT",
      "Integrador de proyectos de Inteligencia Artificial y aprendizaje automático",
      "Consultor de proyectos de Tecnologías de la Información",
      "Educador tecnológico",
      "Ingeniero de calidad de software y pruebas",
      "Ingeniero de soporte y servicios",
      "Director de TI",
      "Arquitecto de software",
      "Diseñador de experiencia de usuario"
    ],

    studyPlan: [
      {
        semester: "Primero",
        subjects: [
          "Inglés I",
          "Desarrollo Humano y Valores",
          "Fundamentos Matemáticos",
          "Fundamentos de Redes",
          "Física",
          "Fundamentos de Programación",
          "Comunicación y Habilidades Digitales"
        ],
      },
      {
        semester: "Segundo",
        subjects: [
          "Inglés II",
          "Habilidades Socioemocionales y Manejo de Conflictos",
          "Cálculo Diferencial",
          "Conmutación y Enrutamiento de Redes",
          "Probabilidad y Estadística",
          "Programación Estructurada",
          "Sistemas Operativos"
        ],
      },
      {
        semester: "Tercero",
        subjects: [
          "Inglés III",
          "Desarrollo del Pensamiento y Toma de Decisiones",
          "Cálculo Integral",
          "Tópicos de Calidad para el Diseño de Software",
          "Bases de Datos",
          "Programación Orientada a Objetos",
          "Proyecto Integrador I"
        ],
      },
      {
        semester: "Cuarto",
        subjects: [
          "Inglés IV",
          "Ética Profesional",
          "Cálculo de Varias Variables",
          "Escalabilidad de Redes",
          "Programación de Redes",
          "Centro de Datos",
          "Infraestructura de Redes de Datos"
        ],
      },
      {
        semester: "Quinto",
        subjects: [
          "Inglés V",
          "Liderazgo de Equipos de Alto Desempeño",
          "Ecuaciones Diferenciales",
          "Conexión de Redes WAN",
          "Cómputo en la Nube",
          "Seguridad en Redes",
          "Proyecto Integrador II"
        ],
      },
      {
        semester: "Sexto",
        subjects: ["Estadía"]
      },
      {
        semester: "Séptimo",
        subjects: [
          "Inglés VI",
          "Habilidades Gerenciales",
          "Formulación de Proyectos de Tecnología",
          "Fundamentos de Inteligencia Artificial",
          "Ética y Legislación en Tecnologías de la Información",
          "Optativa I",
          "Seguridad Informática"
        ],
      },
      {
        semester: "Octavo",
        subjects: [
          "Inglés VII",
          "Electrónica Digital",
          "Gestión de Proyectos de Tecnología",
          "Programación para Inteligencia Artificial",
          "Administración de Servidores",
          "Optativa II",
          "Informática Forense"
        ],
      },
      {
        semester: "Noveno",
        subjects: [
          "Inglés VIII",
          "Internet de las Cosas",
          "Evaluación de Proyectos de Tecnología",
          "Ciencia de Datos",
          "Tecnologías Disruptivas",
          "Optativa III",
          "Proyecto Integrador III"
        ],
      },
      {
        semester: "Décimo",
        subjects: ["Estadía"]
      }
    ]
  }
];

async function migrateProgramDetails() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');

    for (const detail of programDetails) {
      console.log(`Procesando carrera: ${detail.targetName}...`);
      
      let carrera = await Carrera.findOne({ where: { nombre: detail.targetName } });
      
      const updateData: any = {
        nombre: detail.targetName,
        siglas: detail.targetSiglas,
        nivel: detail.targetNivel,
        modalidad: 'Escolarizada', // Default
        duracion: '3 años 8 meses', // Default for Engineering
        objetivo: detail.graduateProfile.substring(0, 250) + '...', // Truncate for summary if needed, or use full
        perfil_ingreso: detail.admissionProfile.trim(),
        perfil_egreso: detail.graduateProfile.trim(),
        campo_laboral: JSON.stringify(detail.laborField),
        mapa_curricular: detail.studyPlan,
        imagen: detail.profileImage,
        orden: detail.programId,
        activo: true
      };

      if (detail.competencies) updateData.competencias = JSON.stringify(detail.competencies);
      if (detail.educationalObjectives) updateData.objetivos_educacionales = JSON.stringify(detail.educationalObjectives);
      if (detail.graduateAttributes) updateData.atributos_egreso = JSON.stringify(detail.graduateAttributes);

      if (carrera) {
        await carrera.update(updateData);
        console.log(`Carrera actualizada: ${detail.targetName}`);
      } else {
        await Carrera.create(updateData);
        console.log(`Carrera creada: ${detail.targetName}`);
      }
    }

    console.log('Migración completada.');
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    await sequelize.close();
  }
}

migrateProgramDetails();
