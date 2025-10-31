import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request } from 'express';

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

// Configuración de multer con seguridad
export const uploadNosotros = multer({
  storage: secureStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fieldNameSize: 100,
    fieldSize: 1024,
    fields: 10
  },
  fileFilter: secureFileFilter
});

// Middleware para validación post-upload
export const validateUploadedFile = (req: Request, res: any, next: any) => {
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
    fieldNameSize: 100,
    fieldSize: 1024,
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
    fieldNameSize: 100,
    fieldSize: 2048, // Mayor para permitir descripciones más largas
    fields: 15
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