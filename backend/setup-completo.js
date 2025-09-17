import db from './config/db.js';

console.log('🚀 Criando todas as tabelas do sistema...');

const createTables = [
  // Tabela usuario
  `CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('aluno', 'docente') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Tabela disciplina
  `CREATE TABLE IF NOT EXISTS disciplina (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descricao TEXT,
    id_docente INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_docente) REFERENCES usuario(id) ON DELETE CASCADE
  )`,

  // Tabela matricula
  `CREATE TABLE IF NOT EXISTS matricula (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    data_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplina(id) ON DELETE CASCADE,
    UNIQUE KEY unique_matricula (usuario_id, disciplina_id)
  )`,

  // Tabela ficha
  `CREATE TABLE IF NOT EXISTS ficha (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    tema VARCHAR(255),
    arquivo VARCHAR(255),
    disciplina_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (disciplina_id) REFERENCES disciplina(id) ON DELETE CASCADE
  )`,

  // Tabela duvida (sistema colaborativo)
  `CREATE TABLE IF NOT EXISTS duvida (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pergunta TEXT NOT NULL,
    resposta TEXT,
    status ENUM('pendente', 'respondida') DEFAULT 'pendente',
    id_ficha INT,
    disciplina_id INT,
    id_usuario INT NOT NULL,
    respondido_por INT,
    tipo_resposta ENUM('aluno', 'docente', 'ia'),
    resposta_ia_referencia TEXT,
    resposta_ia_pagina INT,
    resposta_ia_confianca DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ficha) REFERENCES ficha(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplina(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (respondido_por) REFERENCES usuario(id) ON DELETE SET NULL
  )`,

  // Tabela resposta (se ainda for usada)
  `CREATE TABLE IF NOT EXISTS resposta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conteudo TEXT NOT NULL,
    duvida_id INT NOT NULL,
    docente_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (duvida_id) REFERENCES duvida(id) ON DELETE CASCADE,
    FOREIGN KEY (docente_id) REFERENCES usuario(id) ON DELETE CASCADE
  )`
];

// Dados de exemplo
const insertData = [
  // Usuários de exemplo
  `INSERT IGNORE INTO usuario (nome, email, senha, tipo) VALUES 
    ('Professor João', 'docente@teste.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente'),
    ('Maria Silva', 'aluno@teste.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'aluno'),
    ('João Santos', 'aluno2@teste.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'aluno')`,

  // Disciplina de exemplo
  `INSERT IGNORE INTO disciplina (nome, codigo, descricao, id_docente) VALUES 
    ('Programação Web', 'PROG001', 'Desenvolvimento de aplicações web modernas', 1),
    ('Banco de Dados', 'BD001', 'Fundamentos de sistemas de banco de dados', 1)`,

  // Matrículas de exemplo
  `INSERT IGNORE INTO matricula (usuario_id, disciplina_id) VALUES 
    (2, 1), (3, 1), (2, 2)`,

  // Fichas de exemplo
  `INSERT IGNORE INTO ficha (titulo, tema, arquivo, disciplina_id) VALUES 
    ('Introdução ao React', 'Frontend', 'react-intro.pdf', 1),
    ('Node.js Básico', 'Backend', 'nodejs-basico.pdf', 1),
    ('MySQL Fundamentals', 'Database', 'mysql-fund.pdf', 2)`,

  // Dúvidas de exemplo
  `INSERT IGNORE INTO duvida (pergunta, id_ficha, id_usuario, status) VALUES 
    ('Como criar um componente React funcional?', 1, 2, 'pendente'),
    ('Qual a diferença entre useState e useEffect?', 1, 3, 'pendente'),
    ('Como configurar o Express.js?', 2, 2, 'pendente')`
];

async function setupDatabase() {
  try {
    // Criar tabelas
    for (const query of createTables) {
      await new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
          if (err) {
            console.error('Erro ao criar tabela:', err.message);
            reject(err);
          } else {
            const tableName = query.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1];
            console.log(`✅ Tabela '${tableName}' criada/verificada`);
            resolve(result);
          }
        });
      });
    }

    console.log('\n📊 Inserindo dados de exemplo...');

    // Inserir dados de exemplo
    for (const query of insertData) {
      await new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
          if (err) {
            console.error('Erro ao inserir dados:', err.message);
          } else {
            console.log('✅ Dados inseridos com sucesso');
          }
          resolve(result);
        });
      });
    }

    console.log('\n🎉 Setup completo! Banco de dados pronto para uso.');
    console.log('\n👥 Credenciais de teste criadas:');
    console.log('📧 Docente: docente@teste.com | Senha: 123456');
    console.log('📧 Aluno 1: aluno@teste.com | Senha: 123456');
    console.log('📧 Aluno 2: aluno2@teste.com | Senha: 123456');
    console.log('\n💬 Sistema colaborativo de dúvidas ativo!');
    console.log('🤖 Estrutura preparada para IA de análise de PDFs');

  } catch (error) {
    console.error('❌ Erro no setup:', error);
  } finally {
    process.exit(0);
  }
}

setupDatabase();