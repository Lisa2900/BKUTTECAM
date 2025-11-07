// Script de diagnóstico para verificar la configuración de emails
import path from 'path';
import { existsSync } from 'fs';

console.log('🔍 Diagnóstico de configuración de emails\n');

// 1. Variables de entorno
console.log('📧 Variables de entorno:');
console.log(`   MAILER_EMAIL: ${process.env.MAILER_EMAIL ? '✓ Configurada' : '✗ NO configurada'}`);
console.log(`   MAILER_SECRET_KEY: ${process.env.MAILER_SECRET_KEY ? '✓ Configurada' : '✗ NO configurada'}`);
console.log(`   BASE_URL: ${process.env.BASE_URL || '✗ NO configurada (usará CID)'}\n`);

// 2. Imagen de header
const imagePath = path.resolve(process.cwd(), 'public/emailPhotos/motocleEmail2.jpeg');
console.log('🖼️  Imagen de encabezado:');
console.log(`   Ruta: ${imagePath}`);
console.log(`   Existe: ${existsSync(imagePath) ? '✓ SÍ' : '✗ NO'}\n`);

// 3. Configuración SMTP
console.log('⚙️  Configuración SMTP:');
console.log('   Host: smtp.gmail.com');
console.log('   Port: 465');
console.log('   Secure: true\n');

// 4. Recordatorios
console.log('⚠️  Recordatorios:');
console.log('   • Si usas Gmail con 2FA, necesitas una contraseña de aplicación');
console.log('   • El from debe ser un email válido (usa MAILER_EMAIL)');
console.log('   • La imagen se adjunta automáticamente si no hay BASE_URL');

export { };
