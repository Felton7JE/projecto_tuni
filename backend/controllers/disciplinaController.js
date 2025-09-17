import db from '../config/db.js';

export function create(req, res) {
  const { codigo, nome, ano, semestre } = req.body;
  db.query('INSERT INTO disciplinas(codigo,nome, ano, semestre) values(?, ?, ?, ?)', [codigo, nome, ano, semestre], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao salvar disciplina' });
    res.json({ message: 'Disciplina registrada', id: result.insertId });
  });
};

export function list(req, res) {
  db.query('SELECT * FROM sistema_academico.disciplinas', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro na pesquisa' });
    res.json(rows);
  });
};

export function del(req, res) {
  const { codigo } = req.params;
  db.query('DELETE FROM disciplinas where codigo = ?', [codigo], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao eliminar disciplina' });
    res.json({ message: 'Disciplina eliminada', id: result.insertId });
  });
};
