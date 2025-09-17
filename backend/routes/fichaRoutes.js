import { Router } from 'express';
import * as fichaController from '../controllers/fichaController.js';
import upload from '../config/multer.js';
import authMiddleware, { alunoOnly } from '../middlewares/auth_new.js';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rota específica para alunos - fichas das disciplinas matriculadas
router.get('/aluno', alunoOnly, fichaController.listForAluno);

// Rota para fichas de uma disciplina específica (para alunos)
router.get('/disciplina/:disciplinaId', alunoOnly, fichaController.listByDisciplina);

// Rota para buscar ficha específica por ID
router.get('/:id', fichaController.getById);

router.post('/upload', upload.single('arquivo'), fichaController.upload);
router.post('/', upload.single('ficheiro'), fichaController.upload);
router.post('/create', fichaController.createText);
router.get('/search', fichaController.search);
router.get('/download/:id', fichaController.downloadPdf);
router.get('/', fichaController.list);
router.put('/:id', fichaController.update);
router.delete('/:id', fichaController.delete);

export default router;
