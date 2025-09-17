import db from '../config/db.js';

// Criar uma nova dúvida
export function create(req, res) {
  const { pergunta, id_ficha, disciplina_id } = req.body;
  const userId = req.user.id;
  
  // Suporta tanto dúvidas baseadas em fichas quanto em disciplinas
  const query = `
    INSERT INTO duvida (pergunta, id_ficha, disciplina_id, id_usuario, status, created_at) 
    VALUES (?, ?, ?, ?, 'pendente', NOW())
  `;
  
  db.query(query, [pergunta, id_ficha || null, disciplina_id || null, userId], (err, result) => {
    if (err) {
      console.error('Erro ao criar dúvida:', err);
      return res.status(500).json({ error: 'Erro ao registrar dúvida' });
    }
    res.json({ message: 'Dúvida registrada', id: result.insertId });
  });
}

// Listar dúvidas por ficha (todas as dúvidas de alunos matriculados na disciplina)
export function listByFicha(req, res) {
  const { fichaId } = req.params;
  const userId = req.user.id;
  
  const query = `
    SELECT 
      d.id,
      d.pergunta,
      d.resposta,
      d.status,
      d.created_at,
      d.updated_at,
      d.tipo_resposta,
      d.resposta_ia_referencia,
      d.resposta_ia_pagina,
      d.resposta_ia_confianca,
      f.titulo as ficha_titulo,
      disc.nome as disciplina_nome,
      u_pergunta.nome as pergunta_por,
      u_pergunta.tipo as pergunta_por_tipo,
      u_resposta.nome as respondido_por_nome,
      u_resposta.tipo as respondido_por_tipo
    FROM duvida d
    LEFT JOIN ficha f ON d.id_ficha = f.id
    LEFT JOIN disciplina disc ON f.disciplina_id = disc.id
    LEFT JOIN usuario u_pergunta ON d.id_usuario = u_pergunta.id
    LEFT JOIN usuario u_resposta ON d.respondido_por = u_resposta.id
    WHERE d.id_ficha = ? 
    AND EXISTS (
      SELECT 1 FROM matricula m 
      WHERE m.disciplina_id = disc.id 
      AND m.usuario_id = ?
    )
    ORDER BY d.created_at DESC
  `;
  
  db.query(query, [fichaId, userId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dúvidas por ficha:', err);
      return res.status(500).json({ error: 'Erro ao buscar dúvidas' });
    }
    res.json(results);
  });
}

// Listar dúvidas por disciplina (versão antiga)
export function listByDisciplina(req, res) {
  const { disciplinaId } = req.params;
  const userId = req.user.id;
  
  const query = `
    SELECT 
      d.id,
      d.pergunta,
      d.resposta,
      d.status,
      d.created_at,
      disc.nome as disciplina_nome
    FROM duvida d
    LEFT JOIN disciplina disc ON d.disciplina_id = disc.id
    WHERE d.disciplina_id = ? AND d.id_usuario = ?
    ORDER BY d.created_at DESC
  `;
  
  db.query(query, [disciplinaId, userId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dúvidas por disciplina:', err);
      return res.status(500).json({ error: 'Erro ao buscar dúvidas' });
    }
    res.json(results);
  });
}

// Responder uma dúvida (por aluno, docente ou IA)
export function responderDuvida(req, res) {
  const { duvidaId } = req.params;
  const { resposta, tipo_resposta, ia_referencia, ia_pagina, ia_confianca } = req.body;
  const userId = req.user.id;
  const userType = req.user.tipo;
  
  // Verificar se o usuário pode responder (estar matriculado na disciplina)
  const checkQuery = `
    SELECT d.id, disc.id as disciplina_id
    FROM duvida d
    LEFT JOIN ficha f ON d.id_ficha = f.id
    LEFT JOIN disciplina disc ON f.disciplina_id = disc.id
    WHERE d.id = ?
    AND EXISTS (
      SELECT 1 FROM matricula m 
      WHERE m.disciplina_id = disc.id 
      AND m.usuario_id = ?
    )
  `;
  
  db.query(checkQuery, [duvidaId, userId], (err, checkResults) => {
    if (err) {
      console.error('Erro ao verificar permissão:', err);
      return res.status(500).json({ error: 'Erro ao verificar permissão' });
    }
    
    if (checkResults.length === 0) {
      return res.status(403).json({ error: 'Você não tem permissão para responder esta dúvida' });
    }
    
    // Determinar tipo de resposta baseado no usuário
    const tipoResposta = tipo_resposta || (userType === 'docente' ? 'docente' : 'aluno');
    
    const updateQuery = `
      UPDATE duvida SET 
        resposta = ?,
        status = 'respondida',
        respondido_por = ?,
        tipo_resposta = ?,
        resposta_ia_referencia = ?,
        resposta_ia_pagina = ?,
        resposta_ia_confianca = ?,
        updated_at = NOW()
      WHERE id = ?
    `;
    
    db.query(updateQuery, [
      resposta, 
      userId, 
      tipoResposta,
      ia_referencia || null,
      ia_pagina || null,
      ia_confianca || null,
      duvidaId
    ], (err, result) => {
      if (err) {
        console.error('Erro ao responder dúvida:', err);
        return res.status(500).json({ error: 'Erro ao responder dúvida' });
      }
      res.json({ message: 'Dúvida respondida com sucesso' });
    });
  });
}

// Listar todas as dúvidas do usuário
export function listByUser(req, res) {
  const userId = req.user.id;
  
  const query = `
    SELECT 
      d.id,
      d.pergunta,
      d.resposta,
      d.status,
      d.created_at,
      f.titulo as ficha_titulo,
      disc.nome as disciplina_nome
    FROM duvida d
    LEFT JOIN ficha f ON d.id_ficha = f.id
    LEFT JOIN disciplina disc ON (f.disciplina_id = disc.id OR d.disciplina_id = disc.id)
    WHERE d.id_usuario = ?
    ORDER BY d.created_at DESC
  `;
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dúvidas do usuário:', err);
      return res.status(500).json({ error: 'Erro ao buscar dúvidas' });
    }
    res.json(results);
  });
}
