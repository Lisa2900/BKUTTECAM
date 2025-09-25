import express from 'express';
import cors from 'cors';
import textosRouter from './routes/textos';
import { notFound, errorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ mensaje: 'API uttecam operativa', version: '1.0.0' });
});

app.use('/api/textos', textosRouter);

app.use(notFound);
app.use(errorHandler);

export default app;