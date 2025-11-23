import express, { Router } from 'express';
import cors from 'cors';
import path from 'path';
import rateLimit from 'express-rate-limit';

// Middleware de seguridad
import { securityHeaders, additionalSecurityHeaders, validateContentType } from './middleware/security';
import { apiRateLimit, speedLimiter } from './middleware/rateLimiter';
import { httpLogging, logUnauthorizedAccess, detectAttackPatterns } from './middleware/logging';
import { sanitizeInput } from './middleware/validation';

// IMPORTACIONES DE RUTAS
import textosRouter from './routes/textos';
import nosotrosRouter from './routes/nosotros';
import directorioRouter from './routes/directorio';
import authRouter from './routes/auth';
import solicitudConstanciaRouter from './routes/solicitudConstancia';
import routerDocumentos from './routes/Documentos';
import carreraRouter from './routes/carrera';
import heroSlideRouter from './routes/heroSlide';
import eventoRouter from './routes/evento';
import relojDigitalRouter from './routes/relojDigital';
import noticiaRouter from './routes/noticia';
import anuncioRouter from './routes/anuncio';
import calendarioRouter from './routes/calendario';
import organigramaRouter from './routes/organigrama';
import videoInstitucionalRouter from './routes/videoInstitucional';


// Ruta temporal para formularios (puede expandirse luego)

const formularioRouter = Router();
formularioRouter.get('/', (_req, res) => {
  res.json({ mensaje: 'Módulo de formularios disponible próximamente' });
});

// Error handlers
import { notFound, errorHandler } from './middleware/errorHandler';
import EmailRoute from './routes/EmailRoute';
import fileUpload from 'express-fileupload';

const app = express();

// 1. HEADERS DE SEGURIDAD (aplicar primero)
app.use(securityHeaders);
app.use(additionalSecurityHeaders);

// 2. LOGGING HTTP
app.use(httpLogging);

// 3. DETECCIÓN DE ATAQUES
app.use(detectAttackPatterns);

// 4. RATE LIMITING
app.use(apiRateLimit);
app.use(speedLimiter);

// 5. CORS SEGURO
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://api.uttecam.edu.mx',
    'https://uttecam.edu.mx',
    'https://www.uttecam.edu.mx'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range', 'Accept', 'X-Requested-With'],
  credentials: false, // Importante: no permitir credenciales para mayor seguridad
  maxAge: 86400 // Cache preflight por 24 horas
};

app.use(cors(corsOptions));
// Asegurar que las peticiones preflight OPTIONS respondan correctamente para todas las rutas
app.options('*', cors(corsOptions));

// 6. PARSERS DE BODY (excluir rutas de upload del parsing JSON)
app.use((req, res, next) => {
  // Solo aplicar JSON parser a rutas que no sean de upload
  if (!req.path.includes('/upload-image') && !req.path.includes('/upload')) {
    express.json({
      limit: '1mb',
      strict: true
    })(req, res, next);
  } else {
    next();
  }
});
app.use(express.urlencoded({
  extended: false,
  limit: '1mb'
}));

// 7. VALIDACIÓN DE CONTENT-TYPE
app.use(validateContentType);

// 8. SANITIZACIÓN DE ENTRADA
app.use(sanitizeInput);

// 9. LOGGING DE ACCESOS NO AUTORIZADOS
app.use(logUnauthorizedAccess);

// 10. SERVIR ARCHIVOS ESTÁTICOS DE FORMA SEGURA
app.use('/uploads',
  // Rate limit para downloads
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 200, // máximo 200 descargas por IP cada 15 minutos
    message: { error: 'Límite de descargas excedido' }
  }),
  express.static(path.join(__dirname, '../uploads'), {
    dotfiles: 'deny', // No servir archivos ocultos
    index: false, // No mostrar índices de directorio
    setHeaders: (res, path) => {
      // Validar extensión de archivo (imágenes y documentos)
      const allowedExtensions = [
        // Imágenes
        '.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg',
        // Videos
        '.mp4', '.webm', '.ogg',
        // Documentos
        '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'
      ];
      const fileExtension = require('path').extname(path).toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        res.status(403).end();
        return;
      }

      // Headers de seguridad para archivos estáticos
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir desde cualquier origen para archivos estáticos
      
      // Headers CORS para archivos estáticos - Permitir desde cualquier origen
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');

      // Headers específicos para PDFs y documentos
      if (fileExtension === '.pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline'); // Mostrar en navegador en lugar de descargar
      } else if (['.doc', '.docx'].includes(fileExtension)) {
        res.setHeader('Content-Type', 'application/msword');
      } else if (['.xls', '.xlsx'].includes(fileExtension)) {
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
      } else if (['.ppt', '.pptx'].includes(fileExtension)) {
        res.setHeader('Content-Type', 'application/vnd.ms-powerpoint');
      }

      // Cache diferente según tipo de archivo
      const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'].includes(fileExtension);
      if (isImage) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Imágenes: 1 año
      } else {
        res.setHeader('Cache-Control', 'private, max-age=3600'); // Documentos: 1 hora
      }
    }
  })
);

// 11. RUTA PRINCIPAL CON INFORMACIÓN DE SEGURIDAD
app.get('/', (_req, res) => {
  res.json({
    mensaje: 'API UTTECAM operativa con seguridad OWASP Top 10',
    version: '2.0.0-secure',
    security: {
      authentication: 'JWT Bearer Token required',
      rateLimit: 'Applied',
      headers: 'Security headers enabled',
      cors: 'Restricted origins',
      fileUpload: 'Secure validation enabled'
    },
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      textos: '/api/textos',
      nosotros: '/api/nosotros',
      directorios: '/api/directorios',
      formularios: '/api/formularios',
      solicitudes: '/api/solicitudes-constancia',
      documentos: {
        areas: '/api/documentos/areas',
        categorias: '/api/documentos/categorias',
        archivos: '/api/documentos/archivos',
        estadisticas: '/api/documentos/estadisticas'
      }
    }
  });
});

// 12. RUTAS DE AUTENTICACIÓN (PÚBLICAS)
app.use('/api/auth', authRouter);

// 13. RUTAS DE LA API (PROTEGIDAS)
app.use('/api/textos', textosRouter);
app.use('/api/nosotros', nosotrosRouter);
app.use('/api/directorios', directorioRouter);
app.use('/api/formularios', formularioRouter);
app.use('/api/solicitudes-constancia', solicitudConstanciaRouter);
app.use('/api/documentos', routerDocumentos);
app.use('/api/carreras', carreraRouter);
app.use('/api/hero-slides', heroSlideRouter);
app.use('/api/eventos', eventoRouter);
app.use('/api/reloj-digital', relojDigitalRouter);
app.use('/api/noticias', noticiaRouter);
app.use('/api/anuncios', anuncioRouter);
app.use('/api/calendarios', calendarioRouter);
app.use('/api/organigrama', organigramaRouter);
app.use('/api/video-institucional', videoInstitucionalRouter);
app.use('/api/email', EmailRoute.routes);

// 14. HEALTH CHECK AVANZADO CON MÉTRICAS DE SEGURIDAD
app.get('/health', async (_req, res) => {
  const health: any = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    api_version: '2.0.0-secure',
    security: {
      headers: 'enabled',
      cors: 'restricted',
      rateLimit: 'active',
      authentication: 'jwt',
      fileValidation: 'active',
      logging: 'enabled'
    }
  };

  try {
    // Importar Sequelize y modelo
    const sequelize = require('./config/database').default;
    const Texto = require('./models/Texto').default;

    // Verificar conexión con authenticate
    await sequelize.authenticate();

    // Hacer consulta real para confirmar funcionamiento
    const totalRecords = await Texto.count();

    health.database = 'connected';
    health.sequelize = 'authenticated';
    health.metrics = {
      totalTexts: totalRecords,
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version
    };

  } catch (error: any) {
    health.database = 'disconnected';
    health.db_error = error.message;
    health.status = 'DEGRADED';
  }

  res.json(health);
});

// 15. MIDDLEWARE DE MANEJO DE ERRORES (debe ir al final)
app.use(notFound);
app.use(errorHandler);

export default app;