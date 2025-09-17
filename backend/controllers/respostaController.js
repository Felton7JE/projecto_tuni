import db from '../config/db.js';
export function create(req, res) {
  const { pagina, trecho, id_ficha, id_duvida } = req.body;
  db.query('INSERT INTO resposta (pagina, trecho, id_ficha, id_duvida) VALUES (?, ?, ?, ?)', [pagina, trecho, id_ficha, id_duvida], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao salvar resposta' });
    res.json({ message: 'Resposta registrada', id: result.insertId });
  });
};
