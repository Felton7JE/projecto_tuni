import mysql from 'mysql2';

async function updateDuvidasTable() {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sistema_academico'
  });

  try {
    // Dropar tabela de resposta primeiro (devido a foreign key)
    await new Promise((resolve, reject) => {
      connection.query('DROP TABLE IF EXISTS resposta', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('Tabela resposta dropada');

    // Dropar tabela existente para recriar com nova estrutura
    await new Promise((resolve, reject) => {
      connection.query('DROP TABLE IF EXISTS duvida', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('Tabela duvida dropada');

    // Criar nova tabela de dúvidas com estrutura correta
    await new Promise((resolve, reject) => {
      connection.query(`
        CREATE TABLE duvida (
          id INT AUTO_INCREMENT PRIMARY KEY,
          pergunta TEXT NOT NULL,
          resposta TEXT,
          disciplina_id INT NOT NULL,
          id_aluno INT NOT NULL,
          status ENUM('pendente', 'respondida') DEFAULT 'pendente',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (id_aluno) REFERENCES usuario(id) ON DELETE CASCADE,
          FOREIGN KEY (disciplina_id) REFERENCES disciplina(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('✅ Tabela duvida recriada com nova estrutura!');

  } catch (error) {
    console.error('❌ Erro ao atualizar tabela:', error.message);
  } finally {
    connection.end();
  }
}

updateDuvidasTable();