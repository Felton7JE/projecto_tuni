import { Router } from 'express';
import * as duvidaController from '../controllers/duvidaController.js';
import auth from '../middlewares/auth.js';

const router = Router();

// Criar nova dúvida
router.post('/', auth, duvidaController.create);

// Listar dúvidas por ficha
router.get('/ficha/:fichaId', auth, duvidaController.listByFicha);

// Listar dúvidas por disciplina (compatibilidade)
router.get('/disciplina/:disciplinaId', auth, duvidaController.listByDisciplina);

// Listar todas as dúvidas do usuário
router.get('/usuario', auth, duvidaController.listByUser);

export default router;
