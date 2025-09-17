import db from '../config/db.js';

// Criar nova disciplina (apenas docentes)
export function create(req, res) {
  const { nome, codigo, descricao } = req.body;
  const id_docente = req.user.id;

  if (!nome || !codigo) {
    return res.status(400).json({ error: 'Nome e código são obrigatórios' });
  }

  // Verificar se código já existe
  db.query('SELECT id FROM disciplina WHERE codigo = ?', [codigo], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    if (rows.length > 0) {
      return res.status(400).json({ error: 'Código da disciplina já existe' });
    }

    // Inserir disciplina
    db.query(
      'INSERT INTO disciplina (nome, codigo, descricao, id_docente) VALUES (?, ?, ?, ?)',
      [nome, codigo, descricao || null, id_docente],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao criar disciplina' });
        }

        res.status(201).json({
          message: 'Disciplina criada com sucesso',
          disciplina: {
            id: result.insertId,
            nome,
            codigo,
            descricao
          }
        });
      }
    );
  });
}

// Listar disciplinas do docente
export function listByDocente(req, res) {
  const id_docente = req.user.id;

  db.query(
    'SELECT id, nome, codigo, descricao, created_at FROM disciplina WHERE id_docente = ? ORDER BY created_at DESC',
    [id_docente],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar disciplinas' });
      }

      res.json(rows);
    }
  );
}

// Listar todas as disciplinas (para alunos)
export function listAll(req, res) {
  db.query(
    `SELECT d.id, d.nome, d.codigo, d.descricao, d.created_at, u.nome as docente_nome 
     FROM disciplina d 
     JOIN usuario u ON d.id_docente = u.id 
     ORDER BY d.created_at DESC`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar disciplinas' });
      }

      res.json(rows);
    }
  );
}

// Atualizar disciplina
export function update(req, res) {
  const { id } = req.params;
  const { nome, codigo, descricao } = req.body;
  const id_docente = req.user.id;

  if (!nome || !codigo) {
    return res.status(400).json({ error: 'Nome e código são obrigatórios' });
  }

  // Verificar se a disciplina pertence ao docente
  db.query('SELECT id FROM disciplina WHERE id = ? AND id_docente = ?', [id, id_docente], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Disciplina não encontrada ou sem permissão' });
    }

    // Verificar se código já existe (exceto para esta disciplina)
    db.query('SELECT id FROM disciplina WHERE codigo = ? AND id != ?', [codigo, id], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

      if (rows.length > 0) {
        return res.status(400).json({ error: 'Código da disciplina já existe' });
      }

      // Atualizar disciplina
      db.query(
        'UPDATE disciplina SET nome = ?, codigo = ?, descricao = ? WHERE id = ?',
        [nome, codigo, descricao || null, id],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar disciplina' });
          }

          res.json({
            message: 'Disciplina atualizada com sucesso',
            disciplina: { id, nome, codigo, descricao }
          });
        }
      );
    });
  });
}

// Deletar disciplina
export function del(req, res) {
  const { id } = req.params;
  const id_docente = req.user.id;

  // Verificar se a disciplina pertence ao docente
  db.query('SELECT id FROM disciplina WHERE id = ? AND id_docente = ?', [id, id_docente], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Disciplina não encontrada ou sem permissão' });
    }

    // Deletar disciplina (CASCADE irá deletar fichas relacionadas)
    db.query('DELETE FROM disciplina WHERE id = ?', [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao deletar disciplina' });
      }

      res.json({ message: 'Disciplina deletada com sucesso' });
    });
  });
}

// Buscar disciplina por ID
export function getById(req, res) {
  const { id } = req.params;
  const id_docente = req.user.id;

  db.query(
    'SELECT id, nome, codigo, descricao, created_at FROM disciplina WHERE id = ? AND id_docente = ?',
    [id, id_docente],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Disciplina não encontrada' });
      }

      res.json(rows[0]);
    }
  );
}

// Funções para alunos

// Cadastrar aluno em disciplina por código
export function cadastrarAluno(req, res) {
  const { codigo } = req.body;
  const id_aluno = req.user.id;

  if (!codigo) {
    return res.status(400).json({ error: 'Código da disciplina é obrigatório' });
  }

  // Verificar se a disciplina existe
  db.query('SELECT id, nome FROM disciplina WHERE codigo = ?', [codigo], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Disciplina não encontrada com este código' });
    }

    const disciplina = rows[0];
    
    // Criar tabela de matrícula se não existir
    db.query(`
      CREATE TABLE IF NOT EXISTS matricula (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_aluno INT NOT NULL,
        id_disciplina INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_aluno) REFERENCES usuario(id) ON DELETE CASCADE,
        FOREIGN KEY (id_disciplina) REFERENCES disciplina(id) ON DELETE CASCADE,
        UNIQUE KEY unique_matricula (id_aluno, id_disciplina)
      )
    `, (err) => {
      if (err) {
        console.error('Erro ao criar tabela matricula:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

      // Verificar se aluno já está cadastrado na disciplina
      db.query(
        'SELECT id FROM matricula WHERE id_aluno = ? AND id_disciplina = ?',
        [id_aluno, disciplina.id],
        (err, existing) => {
          if (err) {
            return res.status(500).json({ error: 'Erro interno do servidor' });
          }

          if (existing.length > 0) {
            return res.status(400).json({ error: 'Você já está cadastrado nesta disciplina' });
          }

          // Inserir matrícula
          db.query(
            'INSERT INTO matricula (id_aluno, id_disciplina) VALUES (?, ?)',
            [id_aluno, disciplina.id],
            (err, result) => {
              if (err) {
                return res.status(500).json({ error: 'Erro ao cadastrar na disciplina' });
              }

              res.status(201).json({
                message: `Cadastrado com sucesso na disciplina ${disciplina.nome}`,
                disciplina: disciplina
              });
            }
          );
        }
      );
    });
  });
}

// Listar disciplinas do aluno
export function listByAluno(req, res) {
  console.log('=== listByAluno chamada ===');
  console.log('User:', req.user);
  console.log('User ID:', req.user?.id);
  
  const id_aluno = req.user.id;

  console.log('Executando query para aluno ID:', id_aluno);

  db.query(`
    SELECT d.id, d.nome, d.codigo, d.descricao, d.created_at, u.nome as docente_nome, m.created_at as data_matricula
    FROM disciplina d
    JOIN matricula m ON d.id = m.id_disciplina
    JOIN usuario u ON d.id_docente = u.id
    WHERE m.id_aluno = ?
    ORDER BY m.created_at DESC
  `, [id_aluno], (err, rows) => {
    if (err) {
      console.error('Erro na query:', err);
      return res.status(500).json({ error: 'Erro ao buscar disciplinas' });
    }

    console.log('Resultado da query:', rows);
    console.log('Número de disciplinas encontradas:', rows.length);
    res.json(rows);
  });
}