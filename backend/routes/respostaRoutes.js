import { Router } from 'express';
import * as respostaController from '../controllers/respostaController.js';
import auth from '../middlewares/auth.js';

const router = Router();
router.post('/', auth, respostaController.create);

export default router;
