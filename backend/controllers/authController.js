import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const JWT_SECRET = 'seu_jwt_secret_aqui'; // Em produção, use variável de ambiente

export function register(req, res) {
  const { nome, email, senha, tipo } = req.body;

  // Validações
  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  if (!['aluno', 'docente'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo deve ser "aluno" ou "docente"' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
  }

  // Verificar se email já existe
  db.query('SELECT id FROM usuario WHERE email = ?', [email], async (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    if (rows.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    try {
      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // Inserir usuário
      db.query(
        'INSERT INTO usuario (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
        [nome, email, senhaHash, tipo],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Erro ao criar usuário' });
          }

          // Gerar token
          const token = jwt.sign(
            { id: result.insertId, email, tipo },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.status(201).json({
            message: 'Usuário criado com sucesso',
            token,
            user: {
              id: result.insertId,
              nome,
              email,
              tipo
            }
          });
        }
      );
    } catch (error) {
      res.status(500).json({ error: 'Erro ao processar senha' });
    }
  });
}

export function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  db.query('SELECT * FROM usuario WHERE email = ?', [email], async (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = rows[0];

    try {
      const senhaValida = await bcrypt.compare(senha, user.senha);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar token
      const token = jwt.sign(
        { id: user.id, email: user.email, tipo: user.tipo },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao verificar senha' });
    }
  });
}

export function verifyToken(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    db.query('SELECT id, nome, email, tipo FROM usuario WHERE id = ?', [decoded.id], (err, rows) => {
      if (err || rows.length === 0) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      res.json({ user: rows[0] });
    });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
}
