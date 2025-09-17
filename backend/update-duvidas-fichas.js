import db from './config/db.js';

console.log('Atualizando estrutura da tabela duvida para relacionar com fichas...');

// Adicionar coluna id_ficha na tabela duvida
db.query(`
  ALTER TABLE duvida 
  ADD COLUMN id_ficha INT,
  ADD FOREIGN KEY (id_ficha) REFERENCES ficha(id) ON DELETE CASCADE
`, (err, result) => {
  if (err) {
    console.log('Coluna id_ficha já existe ou erro:', err.message);
  } else {
    console.log('Coluna id_ficha adicionada com sucesso');
  }
  
  // Tornar disciplina_id nullable já que agora vamos usar id_ficha
  db.query(`
    ALTER TABLE duvida 
    MODIFY COLUMN disciplina_id INT NULL
  `, (err, result) => {
    if (err) {
      console.log('Erro ao modificar disciplina_id:', err.message);
    } else {
      console.log('Coluna disciplina_id modificada para nullable');
    }
    
    process.exit(0);
  });
});