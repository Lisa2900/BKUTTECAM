import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import ExtensionItem from '../models/ExtensionItem';
import ExtensionSection from '../models/ExtensionSection';

// Tipos MIME permitidos con sus extensiones correspondientes
const ALLOWED_MIME_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/avif': ['.avif'],
  'image/svg+xml': ['.svg']
};

// Función para verificar si el archivo es realmente una imagen
const verifyFileType = (buffer: Buffer, mimetype: string): boolean => {
  const signatures = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/gif': [0x47, 0x49, 0x46],
    'image/webp': [0x52, 0x49, 0x46, 0x46]
  };

  if (mimetype === 'image/svg+xml') {
    const content = buffer.toString('utf8');
    return content.includes('<svg') && content.includes('</svg>');
  }

  const signature = signatures[mimetype as keyof typeof signatures];
  if (!signature) return false;

  for (let i = 0; i < signature.length; i++) {
    if (buffer[i] !== signature[i]) return false;
  }

  return true;
};

// Configuración de almacenamiento segura
const secureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/nosotros');
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    const tipo = req.body.tipo || 'general';
    const timestamp = Date.now();
    const originalExt = path.extname(file.originalname).toLowerCase();
    
    const filename = `${tipo}_${timestamp}_${randomName}${originalExt}`;
    cb(null, filename);
  }
});

// Filtro de archivo seguro
const secureFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = Object.keys(ALLOWED_MIME_TYPES);
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error(`Tipo MIME no permitido: ${file.mimetype}`));
  }

  const allowedExtensions = ALLOWED_MIME_TYPES[file.mimetype as keyof typeof ALLOWED_MIME_TYPES];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (!allowedExtensions.includes(fileExtension)) {
    return cb(new Error(`Extensión ${fileExtension} no permitida`));
  }

  const dangerousPatterns = [
    /\.\./,
    /[<>:"|?*]/,
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i,
    /\x00/,
    /^\./,
    /.php$/i,
    /.js$/i,
    /.exe$/i
  ];

  if (dangerousPatterns.some(pattern => pattern.test(file.originalname))) {
    return cb(new Error('Nombre de archivo contiene patrones no permitidos'));
  }

  if (file.originalname.length > 255) {
    return cb(new Error('Nombre de archivo demasiado largo'));
  }

  cb(null, true);
};

// Default limits and sizes for multipart parsing
// Reasoning: conservative defaults for most endpoints to avoid accepting huge payloads unintentionally.
// We want larger limits only for 'Nosotros' because it can contain larger JSON/text sections.
const DEFAULT_LIMITS = {
  fields: 200, // non-file form fields (e.g., many inputs in a form)
  fieldNameSize: 200,
  fieldSize: 100 * 1024, // 100KB per field (conservative default)
};

// Configuración de multer con seguridad
export const uploadNosotros = multer({
  storage: secureStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    ...DEFAULT_LIMITS,
    fieldSize: 1 * 1024 * 1024, // 1MB per field only for nosotros
    fields: 500 // override default for nosotros form (allow many inputs in admin panels)
  },
  fileFilter: secureFileFilter
});

// Middleware para validación post-upload
export const validateUploadedFile = (req: Request, res: any, next: any) => {
  // Attach field count for debugging and possible error handler formatting
  try {
    (req as any)._fieldCount = req.body ? Object.keys(req.body).length : 0;
    (req as any)._fieldKeys = req.body ? Object.keys(req.body) : [];
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[UPLOAD DEBUG] Uploaded file for ${req.path} - fields: ${(req as any)._fieldCount}`, (req as any)._fieldKeys);
    }
  } catch (e) {
    (req as any)._fieldCount = 0;
  }
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;
  
  try {
    const buffer = fs.readFileSync(filePath, { flag: 'r' });
    const isValidType = verifyFileType(buffer.slice(0, 20), req.file.mimetype);

    if (!isValidType) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: 'Archivo inválido',
        message: 'El archivo no corresponde al tipo declarado'
      });
    }

    if (buffer.length < 100) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: 'Archivo inválido',
        message: 'El archivo parece estar corrupto'
      });
    }

    next();
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    return res.status(500).json({
      error: 'Error procesando archivo',
      message: 'No se pudo validar el archivo'
    });
  }
};

// Configuración de almacenamiento segura para directorios
const secureStorageDirectorios = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/directorios');
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const originalExt = path.extname(file.originalname).toLowerCase();
    
    const filename = `directorio_${timestamp}_${randomName}${originalExt}`;
    cb(null, filename);
  }
});

// Configuración segura de multer para directorios
export const uploadDirectorios = multer({
  storage: secureStorageDirectorios,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    ...DEFAULT_LIMITS,
    fields: 50
  },
  fileFilter: secureFileFilter
});

// ============================================
// CONFIGURACIÓN PARA EXTENSION UNIVERSITARIA (BANNERS)
// ============================================

const getExtensionUploadPath = (slug?: string) => {
  // Map known sections to friendly paths under uploads
  const mapping: { [key: string]: string } = {
    'talleres-culturales': 'Actividades Culturales y Deportivas/Culturales',
    'talleres-deportivos': 'Actividades Culturales y Deportivas/Deportivas',
    'servicio-medico': 'ExtensionUniversitaria/ServicioMedico',
    'ferias-profesoigraficas': 'ExtensionUniversitaria/DifusionyDivulgacion/Ferias',
    'visitas-guiadas': 'ExtensionUniversitaria/DifusionyDivulgacion/Visitas'
  };

  const sanitized = slug ? mapping[slug] || `ExtensionUniversitaria/${slug}` : 'ExtensionUniversitaria/general';
  return path.join(__dirname, '../../uploads', sanitized);
};

const secureStorageExtension = multer.diskStorage({
  destination: (req, file, cb) => {
    (async () => {
      let slug = req.params.slug || req.body.slug || undefined;
      // If updating item by id (PUT /items/:id), try to find its section and derive slug
      if (!slug && (req.params.id || req.body.id)) {
        const itemId = req.params.id || req.body.id;
        try {
          const item = await ExtensionItem.findByPk(Number(itemId));
          if (item) {
            const section = await ExtensionSection.findByPk(item.section_id);
            if (section && section.slug) {
              slug = section.slug;
            }
          }
        } catch (err) {
          // Non-blocking: we'll fallback to 'general' when DB lookup fails
          console.warn('Could not determine slug from item id for upload, falling back to general', err);
        }
      }
      const uploadPath = getExtensionUploadPath(slug as string);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    })();
  },
  filename: (req, file, cb) => {
    (async () => {
      const randomName = crypto.randomBytes(8).toString('hex');
      const timestamp = Date.now();
      const originalExt = path.extname(file.originalname).toLowerCase();
      let slug = req.params.slug || req.body.slug || 'general';
      if ((!req.params.slug && !req.body.slug) && (req.params.id || req.body.id)) {
        try {
          const itemId = req.params.id || req.body.id;
          const item = await ExtensionItem.findByPk(Number(itemId));
          if (item) {
            const section = await ExtensionSection.findByPk(item.section_id);
            if (section && section.slug) {
              slug = section.slug;
            }
          }
        } catch (_) {
          // fallback to general
        }
      }
      const name = `${slug}_${timestamp}_${randomName}${originalExt}`;
      cb(null, name);
    })();
  }
});

export const uploadExtension = multer({
  storage: secureStorageExtension,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB for banners (higher than general uploads)
    files: 1,
    ...DEFAULT_LIMITS,
    fields: 10
  },
  fileFilter: secureFileFilter
});


// Función utilitaria para eliminar archivos de forma segura
export const deleteFile = (filePath: string): boolean => {
  try {
    // Validar que el path está dentro del directorio uploads
    const uploadsDir = path.join(__dirname, '../../uploads');
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadsDir = path.resolve(uploadsDir);
    
    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      console.error('Intento de eliminar archivo fuera del directorio uploads:', filePath);
      return false;
    }
    
    if (fs.existsSync(resolvedPath)) {
      fs.unlinkSync(resolvedPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    return false;
  }
};

// Función para validar si un archivo existe de forma segura
export const fileExists = (filePath: string): boolean => {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads');
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadsDir = path.resolve(uploadsDir);
    
    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      return false;
    }
    
    return fs.existsSync(resolvedPath);
  } catch (error) {
    return false;
  }
};

// ============================================
// CONFIGURACIÓN PARA DOCUMENTOS
// ============================================

// Tipos de archivo permitidos para documentos
const ALLOWED_DOCUMENT_MIME_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'text/plain': ['.txt'],
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar']
};

// Verificar firmas de archivos de documentos
const verifyDocumentFileType = (buffer: Buffer, mimetype: string): boolean => {
  const signatures: { [key: string]: number[] } = {
    'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
    'application/zip': [0x50, 0x4B, 0x03, 0x04], // PK (también para docx, xlsx, pptx)
    'application/x-rar-compressed': [0x52, 0x61, 0x72, 0x21], // Rar!
  };

  // Los archivos de Office modernos (.docx, .xlsx, .pptx) son ZIP
  if (mimetype.includes('openxmlformats')) {
    const zipSignature = signatures['application/zip'];
    for (let i = 0; i < zipSignature.length; i++) {
      if (buffer[i] !== zipSignature[i]) return false;
    }
    return true;
  }

  const signature = signatures[mimetype];
  if (!signature) return true; // Permitir tipos sin firma específica

  for (let i = 0; i < signature.length; i++) {
    if (buffer[i] !== signature[i]) return false;
  }

  return true;
};

// Configuración de almacenamiento para documentos
const secureStorageDocumentos = multer.diskStorage({
  destination: (req, file, cb) => {
    // Crear ruta base directamente en uploads/documentos
    const uploadPath = path.join(__dirname, '../../uploads/documentos');

    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const originalExt = path.extname(file.originalname).toLowerCase();
    const sanitizedOriginalName = file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .substring(0, 50);
    
    const filename = `${timestamp}_${randomName}_${sanitizedOriginalName}`;
    cb(null, filename);
  }
});

// Filtro de archivo para documentos
const secureDocumentFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = Object.keys(ALLOWED_DOCUMENT_MIME_TYPES);
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error(`Tipo de documento no permitido: ${file.mimetype}`));
  }

  const allowedExtensions = ALLOWED_DOCUMENT_MIME_TYPES[file.mimetype as keyof typeof ALLOWED_DOCUMENT_MIME_TYPES];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (!allowedExtensions.includes(fileExtension)) {
    return cb(new Error(`Extensión ${fileExtension} no permitida para este tipo de documento`));
  }

  // Patrones peligrosos
  const dangerousPatterns = [
    /\.\./,
    /[<>:"|?*]/,
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i,
    /\x00/,
    /.exe$/i,
    /.bat$/i,
    /.cmd$/i,
    /.sh$/i
  ];

  if (dangerousPatterns.some(pattern => pattern.test(file.originalname))) {
    return cb(new Error('Nombre de archivo contiene patrones no permitidos'));
  }

  if (file.originalname.length > 255) {
    return cb(new Error('Nombre de archivo demasiado largo'));
  }

  cb(null, true);
};

// Configuración de multer para documentos
export const uploadDocumentos = multer({
  storage: secureStorageDocumentos,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB para documentos
    files: 1,
    ...DEFAULT_LIMITS,
    fields: 80 // documentos may need more fields for metadata
  },
  fileFilter: secureDocumentFileFilter
});

// Middleware para validación post-upload de documentos
export const validateUploadedDocument = (req: Request, res: any, next: any) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'Archivo requerido',
      message: 'Debe proporcionar un archivo para subir'
    });
  }

  const filePath = req.file.path;
  
  try {
    const buffer = fs.readFileSync(filePath, { flag: 'r' });
    const isValidType = verifyDocumentFileType(buffer.slice(0, 20), req.file.mimetype);

    if (!isValidType) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: 'Archivo inválido',
        message: 'El archivo no corresponde al tipo declarado'
      });
    }

    if (buffer.length < 50) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: 'Archivo inválido',
        message: 'El archivo parece estar corrupto o vacío'
      });
    }

    // Agregar información del archivo a la request
    const { ID_Categorias } = req.body;
    req.body.Ruta_Documento = `/uploads/documentos/${req.file.filename}`;
    req.body.Nombre = req.body.Nombre || req.file.originalname;

    next();
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    return res.status(500).json({
      error: 'Error procesando archivo',
      message: 'No se pudo validar el archivo'
    });
  }
};

// Configuración de almacenamiento segura para calendarios
const secureStorageCalendarios = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/calendarios');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const originalExt = path.extname(file.originalname).toLowerCase();

    const filename = `calendario_${timestamp}_${randomName}${originalExt}`;
    cb(null, filename);
  }
});

// Configuración segura de multer para calendarios (PDF e imágenes)
export const uploadCalendarios = multer({
  storage: multer.memoryStorage(), // Usar memory storage para validación antes de guardar
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1,
    ...DEFAULT_LIMITS,
    fields: 50
  },
  fileFilter: (req, file, cb) => {
    // Permitir PDF e imágenes
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Tipo de archivo no permitido. Solo PDF e imágenes.'));
    }

    // Para memory storage, verificar firma usando file.buffer
    const signatures = {
      'application/pdf': [0x25, 0x50, 0x44, 0x46],
      'image/jpeg': [0xFF, 0xD8, 0xFF],
      'image/png': [0x89, 0x50, 0x4E, 0x47],
      'image/gif': [0x47, 0x49, 0x46],
      'image/webp': [0x52, 0x49, 0x46, 0x46]
    };

    const signature = signatures[file.mimetype as keyof typeof signatures];
    if (signature && file.buffer) {
      let isValid = true;
      for (let i = 0; i < signature.length && i < file.buffer.length; i++) {
        if (file.buffer[i] !== signature[i]) {
          isValid = false;
          break;
        }
      }
      if (!isValid) {
        return cb(new Error('Archivo corrupto o tipo incorrecto'));
      }
    }

    cb(null, true);
  }
});

// Middleware para guardar archivo después de validación
export const saveCalendarioFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file || !req.file.buffer) {
    return next();
  }

  const uploadPath = path.join(__dirname, '../../uploads/calendarios');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const randomName = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const originalExt = path.extname(req.file.originalname).toLowerCase();
  const filename = `calendario_${timestamp}_${randomName}${originalExt}`;
  const filePath = path.join(uploadPath, filename);

  try {
    fs.writeFileSync(filePath, req.file.buffer);
    // Actualizar la información del archivo
    req.file.path = filePath;
    req.file.filename = filename;
    req.file.destination = uploadPath;
    next();
  } catch (error) {
    console.error('Error guardando archivo de calendario:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo guardar el archivo'
    });
  }
};

// Configuración para hero slides y noticias
const heroSlideStorage = multer.memoryStorage();

export const uploadHeroSlides = multer({
  storage: heroSlideStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB para videos
    ...DEFAULT_LIMITS,
    files: 2
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, WEBP, GIF) y videos (MP4, WEBM)'));
    }
  }
}).single('archivo');

export const saveHeroSlideFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  const uploadPath = path.join(__dirname, '../../uploads/hero');
  
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const randomName = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const originalExt = path.extname(req.file.originalname).toLowerCase();
  const filename = `hero_${timestamp}_${randomName}${originalExt}`;
  const filePath = path.join(uploadPath, filename);

  try {
    fs.writeFileSync(filePath, req.file.buffer);
    req.file.path = filePath;
    req.file.filename = filename;
    req.file.destination = uploadPath;
    next();
  } catch (error) {
    console.error('Error guardando archivo de hero slide:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo guardar el archivo'
    });
  }
};

// Configuración para noticias
const noticiaStorage = multer.memoryStorage();

export const uploadNoticias = multer({
  storage: noticiaStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    ...DEFAULT_LIMITS,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, WEBP, GIF)'));
    }
  }
}).single('imagen');

export const saveNoticiaFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  const uploadPath = path.join(__dirname, '../../uploads/noticias');
  
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const randomName = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const originalExt = path.extname(req.file.originalname).toLowerCase();
  const filename = `noticia_${timestamp}_${randomName}${originalExt}`;
  const filePath = path.join(uploadPath, filename);

  try {
    fs.writeFileSync(filePath, req.file.buffer);
    req.file.path = filePath;
    req.file.filename = filename;
    req.file.destination = uploadPath;
    next();
  } catch (error) {
    console.error('Error guardando archivo de noticia:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo guardar el archivo'
    });
  }
};

// Configuración para anuncios
export const uploadAnuncios = multer({
  storage: noticiaStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    ...DEFAULT_LIMITS,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, WEBP, GIF)'));
    }
  }
}).single('imagen');

export const saveAnuncioFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  const uploadPath = path.join(__dirname, '../../uploads/anuncios');
  
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const randomName = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const originalExt = path.extname(req.file.originalname).toLowerCase();
  const filename = `anuncio_${timestamp}_${randomName}${originalExt}`;
  const filePath = path.join(uploadPath, filename);

  try {
    fs.writeFileSync(filePath, req.file.buffer);
    req.file.path = filePath;
    req.file.filename = filename;
    req.file.destination = uploadPath;
    next();
  } catch (error) {
    console.error('Error guardando archivo de anuncio:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo guardar el archivo'
    });
  }
};

// Configuración para carreras - imágenes y PDFs
const carreraStorage = multer.memoryStorage();

export const uploadCarrera = multer({
  storage: carreraStorage,
  // NOTE: `fieldSize` for carreras intentionally uses DEFAULT_LIMITS (100KB). If you need to allow
  // large text fields for carreras, explicitly set `fieldSize` here. We intentionally keep large
  // `fieldSize` only for `Nosotros` to avoid accepting huge text fields on other endpoints.
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB para videos
    files: 4,
    ...DEFAULT_LIMITS,
    fields: 1000 // allow complex forms with many fields (mapa curricular, multiple inputs)
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 
      'image/png', 
      'image/webp', 
      'image/gif', 
      'application/pdf',
      'video/mp4',
      'video/webm',
      'video/x-msvideo' // .avi
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, WEBP, GIF), PDF o videos (MP4, WEBM, AVI)'));
    }
  }
}).fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'imagen_portada', maxCount: 1 },
  { name: 'plan_estudios', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

export const saveCarreraFiles = (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
  if (!files) {
    return next();
  }

  try {
    // Guardar imagen (Carátula)
    if (files.imagen && files.imagen[0]) {
      const uploadPath = path.join(__dirname, '../../uploads/carreras/caratulas');
      
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const randomName = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const originalExt = path.extname(files.imagen[0].originalname).toLowerCase();
      const filename = `caratula_${timestamp}_${randomName}${originalExt}`;
      const filePath = path.join(uploadPath, filename);

      fs.writeFileSync(filePath, files.imagen[0].buffer);
      (req as any).savedImagePath = `caratulas/${filename}`;
    }

    // Guardar imagen portada (Cuadrícula)
    if (files.imagen_portada && files.imagen_portada[0]) {
      const uploadPath = path.join(__dirname, '../../uploads/carreras/portadas');
      
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const randomName = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const originalExt = path.extname(files.imagen_portada[0].originalname).toLowerCase();
      const filename = `portada_${timestamp}_${randomName}${originalExt}`;
      const filePath = path.join(uploadPath, filename);

      fs.writeFileSync(filePath, files.imagen_portada[0].buffer);
      (req as any).savedPortadaPath = `portadas/${filename}`;
    }

    // Guardar video
    if (files.video && files.video[0]) {
      const uploadPath = path.join(__dirname, '../../uploads/carreras/videos');
      
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const randomName = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const originalExt = path.extname(files.video[0].originalname).toLowerCase();
      const filename = `video_${timestamp}_${randomName}${originalExt}`;
      const filePath = path.join(uploadPath, filename);

      fs.writeFileSync(filePath, files.video[0].buffer);
      (req as any).savedVideoPath = filename;
    }

    // Guardar plan de estudios (PDF)
    if (files.plan_estudios && files.plan_estudios[0]) {
      const uploadPath = path.join(__dirname, '../../uploads/carreras/planes');
      
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const randomName = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const filename = `plan_${timestamp}_${randomName}.pdf`;
      const filePath = path.join(uploadPath, filename);

      fs.writeFileSync(filePath, files.plan_estudios[0].buffer);
      (req as any).savedPlanPath = filename;
    }

    next();
  } catch (error) {
    console.error('Error guardando archivos de carrera:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo guardar los archivos'
    });
  }
};