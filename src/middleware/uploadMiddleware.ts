import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/nosotros');
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar nombre único: tipo_timestamp.extension
    const tipo = req.body.tipo || 'general';
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `${tipo}_${timestamp}${extension}`;
    
    cb(null, filename);
  }
});

// Filtros de archivo
const fileFilter = (req: any, file: any, cb: any) => {
  // Tipos de archivo permitidos
  const allowedTypes = /jpeg|jpg|png|gif|webp|avif|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp, avif, svg)'));
  }
};

// Configuración de multer
export const uploadNosotros = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: fileFilter
});

// Configuración de almacenamiento para directorios
const storageDirectorios = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/directorios');
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar nombre único: directorio_timestamp.extension
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `directorio_${timestamp}${extension}`;
    
    cb(null, filename);
  }
});

// Configuración de multer para directorios
export const uploadDirectorios = multer({
  storage: storageDirectorios,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: fileFilter
});

// Función utilitaria para eliminar archivos
export const deleteFile = (filePath: string): boolean => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    return false;
  }
};

// Función para validar si un archivo existe
export const fileExists = (filePath: string): boolean => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
};