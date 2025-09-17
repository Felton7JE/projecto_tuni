import { Router } from 'express';
import * as disciplinaController from '../controllers/disciplinaController_new.js';
import authMiddleware, { docenteOnly, alunoOnly } from '../middlewares/auth_new.js';

const router = Router();

// Rotas protegidas - apenas docentes
router.post('/', authMiddleware, docenteOnly, disciplinaController.create);
router.get('/minhas', authMiddleware, docenteOnly, disciplinaController.listByDocente);

// Rotas para alunos (devem vir antes de /:id)
router.get('/aluno', authMiddleware, alunoOnly, disciplinaController.listByAluno);
router.post('/cadastrar', authMiddleware, alunoOnly, disciplinaController.cadastrarAluno);

// Rotas específicas por ID (devem vir após rotas nomeadas)
router.get('/:id', authMiddleware, docenteOnly, disciplinaController.getById);
router.put('/:id', authMiddleware, docenteOnly, disciplinaController.update);
router.delete('/:id', authMiddleware, docenteOnly, disciplinaController.del);

// Rota pública - todos podem ver disciplinas
router.get('/', disciplinaController.listAll);

export default router;
