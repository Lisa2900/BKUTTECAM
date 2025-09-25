import app from './app';
import { dbPing } from './config/db';

const port = Number(process.env.PORT) || 3000;

async function start() {
  try {
    await dbPing();
    console.log('✅ DB OK');
    app.listen(port, () => console.log(`🚀 API en http://localhost:${port}`));
  } catch (e) {
    console.error('❌ Error conectando a la DB', e);
    process.exit(1);
  }
}

start();