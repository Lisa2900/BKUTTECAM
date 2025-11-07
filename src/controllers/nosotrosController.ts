import { NextFunction, Request, Response } from "express";
import NosotrosContent from "../models/Nosotros";
import path from 'path';
import fs from 'fs';

// ============================================
// CONTROLADOR PARA CONTENIDO DE "NOSOTROS"
// ============================================

// GET /api/nosotros/content
// Obtener todo el contenido de la página "Nosotros"
export const getContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener el contenido (debería haber solo un registro)
    const content = await NosotrosContent.findOne();

    if (!content) {
      return res.status(404).json({
        error: "Contenido no encontrado",
        message: "El contenido de 'Nosotros' no ha sido creado aún. Use POST /api/nosotros/content para crear el contenido inicial."
      });
    }

    // Obtener los datos como JSON
    const data = content.toJSON();
    
    // Parsear campos JSON si vienen como string (problema con Sequelize en MySQL)
    const parseIfString = (field: any) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return field;
        }
      }
      return field;
    };

    const parsedData = {
      ...data,
      politicaIntegral: parseIfString(data.politicaIntegral),
      vision: parseIfString(data.vision),
      mision: parseIfString(data.mision),
      valores: parseIfString(data.valores),
      noDiscriminacion: parseIfString(data.noDiscriminacion)
    };

    res.json(parsedData);
  } catch (error) {
    next(error);
  }
};

// PUT /api/nosotros/content
// Actualizar todo el contenido de la página "Nosotros"
export const updateContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      vision,
      mision,
      valores,
      politicaIntegral,
      objetivoIntegral,
      noDiscriminacion
    } = req.body;

    // Validar estructura básica
    if (!vision || !mision || !valores || !politicaIntegral || !objetivoIntegral || !noDiscriminacion) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: "Todas las secciones son requeridas"
      });
    }

    // Buscar o crear el contenido
    let content = await NosotrosContent.findOne();

    if (!content) {
      content = await NosotrosContent.create({
        vision,
        mision,
        valores,
        politicaIntegral,
        objetivoIntegral,
        noDiscriminacion
      });
    } else {
      await content.update({
        vision,
        mision,
        valores,
        politicaIntegral,
        objetivoIntegral,
        noDiscriminacion
      });
    }

    res.json({
      message: "Contenido actualizado exitosamente",
      content: content.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/nosotros/content/:section
// Actualizar una sección específica del contenido
export const updateSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { section } = req.params;
    const updateData = req.body;

    // Validar que la sección sea válida
    const validSections = ['vision', 'mision', 'valores', 'politicaIntegral', 'objetivoIntegral', 'noDiscriminacion'];

    if (!validSections.includes(section)) {
      return res.status(400).json({
        error: "Sección inválida",
        details: `Las secciones válidas son: ${validSections.join(', ')}`
      });
    }

    // Buscar el contenido
    let content = await NosotrosContent.findOne();

    if (!content) {
      return res.status(404).json({
        error: "Contenido no encontrado",
        message: "El contenido de 'Nosotros' no ha sido creado aún. Use POST /api/nosotros/content para crear el contenido inicial."
      });
    }

    // El frontend envía { [section]: data }, extraer los datos de la sección
    const sectionData = updateData[section] || updateData;

    // Actualizar solo la sección especificada
    const updateObj: any = {};
    updateObj[section] = sectionData;

    await content.update(updateObj);
    
    // Recargar el contenido actualizado
    await content.reload();

    // Parsear el campo actualizado si es necesario
    const parseIfString = (field: any) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return field;
        }
      }
      return field;
    };

    const updatedValue = parseIfString(content[section as keyof typeof content]);

    res.json({
      message: `Sección ${section} actualizada exitosamente`,
      [section]: updatedValue
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/nosotros/content
// Crear nuevo contenido (reemplaza el existente si ya hay uno)
export const createContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      vision,
      mision,
      valores,
      politicaIntegral,
      objetivoIntegral,
      noDiscriminacion
    } = req.body;

    // Validar estructura básica
    if (!vision || !mision || !valores || !politicaIntegral || !objetivoIntegral || !noDiscriminacion) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: "Todas las secciones son requeridas"
      });
    }

    // Eliminar contenido existente si hay uno
    await NosotrosContent.destroy({ where: {} });

    // Crear nuevo contenido
    const newContent = await NosotrosContent.create({
      vision,
      mision,
      valores,
      politicaIntegral,
      objetivoIntegral,
      noDiscriminacion
    });

    res.status(201).json({
      message: "Contenido creado exitosamente",
      content: newContent.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/nosotros/content/:section
// Obtener una sección específica del contenido
export const getSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { section } = req.params;

    // Validar que la sección sea válida
    const validSections = ['vision', 'mision', 'valores', 'politicaIntegral', 'objetivoIntegral', 'noDiscriminacion'];

    if (!validSections.includes(section)) {
      return res.status(400).json({
        error: "Sección inválida",
        details: `Las secciones válidas son: ${validSections.join(', ')}`
      });
    }

    // Obtener el contenido
    const content = await NosotrosContent.findOne();

    if (!content) {
      return res.status(404).json({
        error: "Contenido no encontrado",
        message: "El contenido de 'Nosotros' no ha sido creado aún. Use POST /api/nosotros/content para crear el contenido inicial."
      });
    }

    // Parsear el campo si es un string JSON
    let sectionData = content[section as keyof typeof content];
    if (typeof sectionData === 'string' && (section === 'vision' || section === 'mision' || section === 'valores' || section === 'noDiscriminacion')) {
      try {
        sectionData = JSON.parse(sectionData);
      } catch {
        // Si no se puede parsear, dejar como está
      }
    }

    res.json({
      [section]: sectionData
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/nosotros/content
// Eliminar todo el contenido
export const deleteContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedCount = await NosotrosContent.destroy({ where: {} });

    res.json({
      message: "Contenido eliminado exitosamente",
      deletedCount
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/nosotros/content/:section
// Eliminar una sección específica (restaurar valores por defecto)
export const deleteSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { section } = req.params;

    // Validar que la sección sea válida
    const validSections = ['vision', 'mision', 'valores', 'politicaIntegral', 'objetivoIntegral', 'noDiscriminacion'];

    if (!validSections.includes(section)) {
      return res.status(400).json({
        error: "Sección inválida",
        details: `Las secciones válidas son: ${validSections.join(', ')}`
      });
    }

    // Buscar el contenido
    const content = await NosotrosContent.findOne();

    if (!content) {
      return res.status(404).json({
        error: "Contenido no encontrado"
      });
    }

    // Valores por defecto para cada sección
    const defaultValues = {
      vision: {
        imageSrc: 'nosotros/vision_1759772754247.png',
        title: 'Visión',
        description: 'En el año 2027 ser una institución de excelencia, reconocida Nacional e Internacionalmente por su eficiencia, eficacia, pertinencia, equidad, inclusión, vinculación y cuerpos académicos consolidados y comprometidos con las expectativas de los aprendientes y de la sociedad, al brindar educación de calidad y profesionistas con alto sentido humano, competitivos e integrados en el ámbito productivo'
      },
      mision: {
        imageSrc: 'nosotros/general_1761952064258_e361d82abad6d8113e2ec6074b4ef15a.png',
        title: 'Misión',
        description: 'Somos una Institución de Educación Superior comprometida con la excelencia, transparencia y rendición de cuentas, que brinda servicios educativos, científicos y tecnológicos con calidad, equidad, inclusión, responsabilidad social y sentido humano para contribuir al bienestar y desarrollo integral regional, estatal y nacional, cumpliendo los requerimientos de las partes interesadas, mediante un modelo formativo integral.'
      },
      valores: {
        imageSrc: 'nosotros/general_1761952189846_0697273e3d61620d3c56851a66ecec60.png',
        title: 'Valores',
        description: [
          'Austeridad',
          'Honestidad',
          'Empatía',
          'Generosidad',
          'Respeto',
          'Tolerancia',
          'Igualdad',
          'Equidad',
          'Justicia',
          'Fraternidad',
          'Compromiso',
          'Bien Común'
        ]
      },
      politicaIntegral: 'Somos una institución comprometida en la formación de profesionistas con responsabilidad social, sentido humano y ético, que en conjunto con la comunidad universitaria, contribuyen al desarrollo sustentable a través de establecimiento de objetivos integrales, actualización e innovación de los programas educativos, gestión de la propiedad intelectual y la mejora continua del Sistema de Gestión Integral, considerando el desarrollo educativo, científico y técnico, cumpliendo el marco legal aplicable, considerando las necesidades y expectativas de las partes interesadas, atendiendo los criterios ambientales de manera que se pueda controlar y prevenir la contaminación derivada de nuestros procesos y servicios para la preservación del medio ambiente.',
      objetivoIntegral: 'Formar integralmente profesionistas competentes socialmente responsables, creativos, emprendedores e innovadores, comprometidos con el cuidado del medio ambiente y la sustentabilidad, a través del proceso enseñanza-aprendizaje, conducido por una planta docente con sentido humano, perfil profesional, experiencia y capacitación adecuada para la realización de su labor educativa.',
      noDiscriminacion: [
        [
          'Apariencia Física',
          'Cultura',
          'Discapacidad',
          'Idioma'
        ],
        [
          'Estado civil',
          'Religión',
          'Sexo',
          'Embarazo'
        ],
        [
          'Opiniones',
          'Origen étnico o nacional',
          'Género',
          'Edad'
        ]
      ]
    };

    // Actualizar la sección con valores por defecto
    const updateObj: any = {};
    updateObj[section] = defaultValues[section as keyof typeof defaultValues];

    await content.update(updateObj);

    res.json({
      message: `Sección ${section} restaurada a valores por defecto`,
      [section]: content[section as keyof typeof content]
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/nosotros/upload-image
// Subir imagen para una sección específica de "Nosotros"
export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { section, ...additionalData } = req.body;

    // Validar que se especificó la sección
    if (!section) {
      return res.status(400).json({
        error: "Sección requerida",
        message: "Debe especificar la sección (politicaIntegral, vision, mision, valores)"
      });
    }

    // Validar que la sección es válida
    if (!['politicaIntegral', 'vision', 'mision', 'valores'].includes(section)) {
      return res.status(400).json({
        error: "Sección inválida",
        message: "La sección debe ser: politicaIntegral, vision, mision o valores"
      });
    }

    // Verificar que se subió un archivo
    if (!req.file) {
      return res.status(400).json({
        error: "Archivo requerido",
        message: "No se encontró ningún archivo en la solicitud"
      });
    }

    // Obtener el contenido actual
    let content = await NosotrosContent.findOne();
    if (!content) {
      return res.status(404).json({
        error: "Contenido no encontrado",
        message: "Debe crear el contenido de 'Nosotros' antes de subir imágenes"
      });
    }

    // Construir la URL relativa del archivo
    const relativePath = `nosotros/${req.file.filename}`;

    // Obtener el contenido actual de la sección y parsearlo si es necesario
    let sectionData = content[section as keyof typeof content];
    
    // Parsear el campo si es un string JSON
    if (typeof sectionData === 'string') {
      try {
        sectionData = JSON.parse(sectionData);
      } catch {
        return res.status(500).json({
          error: "Error al parsear el contenido de la sección",
          message: "El contenido de la sección no está en el formato correcto"
        });
      }
    }

    // Construir el objeto actualizado con la nueva imagen y datos adicionales
    const updatedSectionData: any = {
      ...(sectionData as object),
      imageSrc: relativePath
    };

    // Procesar los datos adicionales del FormData
    // Parsear description si viene como JSON string (para valores que es un array)
    if (additionalData.description) {
      try {
        updatedSectionData.description = typeof additionalData.description === 'string' 
          ? JSON.parse(additionalData.description)
          : additionalData.description;
      } catch {
        updatedSectionData.description = additionalData.description;
      }
    }

    // Agregar title si se proporcionó
    if (additionalData.title) {
      updatedSectionData.title = additionalData.title;
    }

    // Guardar solo la sección actualizada
    await content.update({
      [section]: updatedSectionData
    });

    res.json({
      message: `Imagen subida exitosamente para la sección ${section}`,
      section: section,
      imageSrc: relativePath,
      filename: req.file.filename
    });

  } catch (error) {
    // Si hay un error, eliminar el archivo subido si existe
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};