
import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import disciplinaRoutes from './routes/disciplinaRoutes.js';
import fichaRoutes from './routes/fichaRoutes.js';
import duvidaRoutes from './routes/duvidaRoutes.js';
import respostaRoutes from './routes/respostaRoutes.js';
import duvidasRoutes from './routes/duvidasRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());

// Rotas existentes
app.use('/auth', authRoutes);
app.use('/disciplinas', disciplinaRoutes);
app.use('/fichas', fichaRoutes);
app.use('/duvidas', duvidasRoutes);  // Novas rotas colaborativas
app.use('/resposta', respostaRoutes);

// Pasta de uploads
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
