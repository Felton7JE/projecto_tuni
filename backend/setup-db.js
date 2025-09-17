import mysql from 'mysql2';

async function setupDatabase() {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
  });

  try {
    // Criar database
    await new Promise((resolve, reject) => {
      connection.query('CREATE DATABASE IF NOT EXISTS sistema_academico', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Usar database
    await new Promise((resolve, reject) => {
      connection.query('USE sistema_academico', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Tabela de usuários (alunos e docentes)
    await new Promise((resolve, reject) => {
      connection.query(`
        CREATE TABLE IF NOT EXISTS usuario (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          senha VARCHAR(255) NOT NULL,
          tipo ENUM('aluno', 'docente') NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Tabela de disciplinas
    await new Promise((resolve, reject) => {
      connection.query(`
        CREATE TABLE IF NOT EXISTS disciplina (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          codigo VARCHAR(50) UNIQUE NOT NULL,
          descricao TEXT,
          id_docente INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (id_docente) REFERENCES usuario(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Tabela de fichas com tipo (teórica/prática)
    await new Promise((resolve, reject) => {
      connection.query(`
        CREATE TABLE IF NOT EXISTS ficha (
          id INT AUTO_INCREMENT PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          tema VARCHAR(255) NOT NULL,
          tipo ENUM('teorica', 'pratica') NOT NULL,
          conteudo TEXT,
          arquivo_pdf LONGBLOB,
          nome_arquivo VARCHAR(255),
          tipo_arquivo VARCHAR(100),
          tamanho_arquivo INT,
          id_disciplina INT NOT NULL,
          id_docente INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (id_disciplina) REFERENCES disciplina(id) ON DELETE CASCADE,
          FOREIGN KEY (id_docente) REFERENCES usuario(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Tabela de dúvidas
    await new Promise((resolve, reject) => {
      connection.query(`
        CREATE TABLE IF NOT EXISTS duvida (
          id INT AUTO_INCREMENT PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          conteudo TEXT NOT NULL,
          id_aluno INT NOT NULL,
          id_ficha INT NOT NULL,
          status ENUM('pendente', 'respondida') DEFAULT 'pendente',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (id_aluno) REFERENCES usuario(id) ON DELETE CASCADE,
          FOREIGN KEY (id_ficha) REFERENCES ficha(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Tabela de respostas
    await new Promise((resolve, reject) => {
      connection.query(`
        CREATE TABLE IF NOT EXISTS resposta (
          id INT AUTO_INCREMENT PRIMARY KEY,
          conteudo TEXT NOT NULL,
          id_duvida INT NOT NULL,
          id_usuario INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (id_duvida) REFERENCES duvida(id) ON DELETE CASCADE,
          FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('✅ Database e todas as tabelas criadas com sucesso!');
    console.log('✅ Sistema acadêmico completo configurado!');
  } catch (error) {
    console.error('❌ Erro ao criar database:', error.message);
  } finally {
    connection.end();
  }
}

setupDatabase();