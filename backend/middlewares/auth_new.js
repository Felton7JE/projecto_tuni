import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const JWT_SECRET = 'seu_jwt_secret_aqui';

const authMiddleware = (req, res, next) => {
  console.log('=== Auth Middleware ===');
  const token = req.headers.authorization?.replace('Bearer ', '');
  console.log('Token recebido:', token ? 'Existe' : 'Não existe');

  if (!token) {
    console.log('Token não fornecido');
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decodificado:', decoded);
    
    // Buscar dados atualizados do usuário
    db.query('SELECT id, nome, email, tipo FROM usuario WHERE id = ?', [decoded.id], (err, rows) => {
      if (err || rows.length === 0) {
        console.log('Erro ao buscar usuário ou usuário não encontrado:', err);
        return res.status(401).json({ error: 'Token inválido' });
      }

      req.user = rows[0];
      console.log('Usuário autenticado:', req.user);
      next();
    });
  } catch (error) {
    console.log('Erro ao verificar token:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware específico para docentes
export const docenteOnly = (req, res, next) => {
  if (req.user.tipo !== 'docente') {
    return res.status(403).json({ error: 'Acesso permitido apenas para docentes' });
  }
  next();
};

// Middleware específico para alunos
export const alunoOnly = (req, res, next) => {
  console.log('=== alunoOnly middleware ===');
  console.log('User type:', req.user?.tipo);
  console.log('Full user:', req.user);
  
  if (req.user.tipo !== 'aluno') {
    console.log('Acesso negado - não é aluno');
    return res.status(403).json({ error: 'Acesso permitido apenas para alunos' });
  }
  
  console.log('Acesso liberado para aluno');
  next();
};

export default authMiddleware;