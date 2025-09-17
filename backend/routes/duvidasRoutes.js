import express from 'express';
import * as duvidaController from '../controllers/duvidaController.js';
import authMiddleware from '../middlewares/auth_new.js';

const router = express.Router();

// Criar nova dúvida
router.post('/', authMiddleware, duvidaController.create);

// Listar dúvidas por ficha (todos os alunos da disciplina)
router.get('/ficha/:fichaId', authMiddleware, duvidaController.listByFicha);

// Listar dúvidas por disciplina (versão antiga)
router.get('/disciplina/:disciplinaId', authMiddleware, duvidaController.listByDisciplina);

// Responder uma dúvida
router.put('/:duvidaId/responder', authMiddleware, duvidaController.responderDuvida);

// Listar todas as dúvidas do usuário
router.get('/minhas', authMiddleware, duvidaController.listByUser);

export default router;