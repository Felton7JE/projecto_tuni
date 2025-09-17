import mysql from 'mysql2';
import bcrypt from 'bcrypt';

// Configuração de conexão sem especificar database
const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

console.log('🚀 Criando sistema completo do zero...');
console.log('📊 Configuração:', {
  host: connectionConfig.host,
  user: connectionConfig.user,
  password: connectionConfig.password ? '***' : 'SEM SENHA'
});

const connection = mysql.createConnection(connectionConfig);

const setupQueries = [
  // 1. Criar database
  `DROP DATABASE IF EXISTS sistema_academico`,
  `CREATE DATABASE sistema_academico CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `USE sistema_academico`,

  // 2. Tabela usuario
  `CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('aluno', 'docente') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // 3. Tabela disciplina
  `CREATE TABLE disciplina (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descricao TEXT,
    id_docente INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_docente) REFERENCES usuario(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // 4. Tabela matricula
  `CREATE TABLE matricula (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    data_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplina(id) ON DELETE CASCADE,
    UNIQUE KEY unique_matricula (usuario_id, disciplina_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // 5. Tabela ficha
  `CREATE TABLE ficha (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    tema VARCHAR(255),
    arquivo VARCHAR(255),
    disciplina_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (disciplina_id) REFERENCES disciplina(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // 6. Tabela duvida (sistema colaborativo com IA)
  `CREATE TABLE duvida (
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
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // 7. Tabela resposta (compatibilidade)
  `CREATE TABLE resposta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conteudo TEXT NOT NULL,
    duvida_id INT NOT NULL,
    docente_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (duvida_id) REFERENCES duvida(id) ON DELETE CASCADE,
    FOREIGN KEY (docente_id) REFERENCES usuario(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
];

async function executarSetup() {
  try {
    console.log('🔄 Conectando ao MySQL...');
    
    // Executar todas as queries de criação
    for (let i = 0; i < setupQueries.length; i++) {
      const query = setupQueries[i];
      
      await new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
          if (err) {
            console.error(`❌ Erro na query ${i + 1}:`, err.message);
            reject(err);
          } else {
            if (query.includes('DROP DATABASE')) {
              console.log('🗑️  Database antigo removido');
            } else if (query.includes('CREATE DATABASE')) {
              console.log('🆕 Database "sistema_academico" criado');
            } else if (query.includes('USE sistema_academico')) {
              console.log('✅ Conectado ao database');
            } else if (query.includes('CREATE TABLE')) {
              const tableName = query.match(/CREATE TABLE (\w+)/)?.[1];
              console.log(`📋 Tabela "${tableName}" criada`);
            }
            resolve(result);
          }
        });
      });
    }

    console.log('\n👥 Criando usuários de exemplo...');
    
    // Hash das senhas
    const senhaHash = await bcrypt.hash('123456', 10);
    
    // Inserir dados de exemplo
    const dadosExemplo = [
      // Usuários
      `INSERT INTO usuario (nome, email, senha, tipo) VALUES 
        ('Prof. João Silva', 'docente@teste.com', '${senhaHash}', 'docente'),
        ('Maria Santos', 'aluno@teste.com', '${senhaHash}', 'aluno'),
        ('Carlos Oliveira', 'aluno2@teste.com', '${senhaHash}', 'aluno'),
        ('Ana Costa', 'aluno3@teste.com', '${senhaHash}', 'aluno')`,

      // Disciplinas
      `INSERT INTO disciplina (nome, codigo, descricao, id_docente) VALUES 
        ('Programação Web Avançada', 'PROG001', 'Desenvolvimento de aplicações web modernas com React e Node.js', 1),
        ('Banco de Dados', 'BD001', 'Fundamentos de sistemas de banco de dados relacionais', 1),
        ('Inteligência Artificial', 'IA001', 'Introdução aos conceitos de IA e Machine Learning', 1)`,

      // Matrículas
      `INSERT INTO matricula (usuario_id, disciplina_id) VALUES 
        (2, 1), (3, 1), (4, 1),
        (2, 2), (3, 2),
        (2, 3), (4, 3)`,

      // Fichas
      `INSERT INTO ficha (titulo, tema, arquivo, disciplina_id) VALUES 
        ('Introdução ao React', 'Frontend', 'react-intro.pdf', 1),
        ('Hooks no React', 'Frontend', 'react-hooks.pdf', 1),
        ('Node.js e Express', 'Backend', 'nodejs-express.pdf', 1),
        ('MySQL Fundamentals', 'Database', 'mysql-fund.pdf', 2),
        ('Consultas Avançadas', 'Database', 'mysql-advanced.pdf', 2),
        ('Fundamentos de IA', 'Machine Learning', 'ia-fundamentos.pdf', 3)`,

      // Dúvidas de exemplo
      `INSERT INTO duvida (pergunta, id_ficha, id_usuario, status) VALUES 
        ('Como criar um componente React funcional?', 1, 2, 'pendente'),
        ('Qual a diferença entre useState e useEffect?', 2, 3, 'pendente'),
        ('Como configurar o Express.js?', 3, 4, 'pendente'),
        ('Como fazer JOIN entre tabelas?', 4, 2, 'pendente'),
        ('O que são algoritmos de machine learning?', 6, 3, 'respondida')`,

      // Resposta de exemplo
      `UPDATE duvida SET 
        resposta = 'Algoritmos de machine learning são métodos computacionais que permitem aos sistemas aprender automaticamente a partir de dados, sem serem explicitamente programados para cada tarefa específica.',
        respondido_por = 1,
        tipo_resposta = 'docente',
        status = 'respondida',
        updated_at = NOW()
        WHERE id = 5`
    ];

    for (const query of dadosExemplo) {
      await new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
          if (err) {
            console.error('❌ Erro ao inserir dados:', err.message);
          } else {
            console.log('✅ Dados inseridos');
          }
          resolve(result);
        });
      });
    }

    console.log('\n🎉 SETUP COMPLETO! Sistema totalmente configurado.');
    console.log('\n📊 Resumo do que foi criado:');
    console.log('   🗄️  Database: sistema_academico');
    console.log('   📋 7 tabelas criadas');
    console.log('   👥 4 usuários (1 docente + 3 alunos)');
    console.log('   📚 3 disciplinas');
    console.log('   📄 6 fichas de exemplo');
    console.log('   💬 5 dúvidas de exemplo');
    
    console.log('\n🔑 CREDENCIAIS DE TESTE:');
    console.log('   📧 Docente: docente@teste.com | 🔐 Senha: 123456');
    console.log('   📧 Aluno 1: aluno@teste.com | 🔐 Senha: 123456');
    console.log('   📧 Aluno 2: aluno2@teste.com | 🔐 Senha: 123456');
    console.log('   📧 Aluno 3: aluno3@teste.com | 🔐 Senha: 123456');
    
    console.log('\n✨ FUNCIONALIDADES ATIVAS:');
    console.log('   🤝 Sistema colaborativo de dúvidas');
    console.log('   📋 Dúvidas organizadas por ficha');
    console.log('   🏷️  Badges de identificação (aluno/docente/IA)');
    console.log('   🤖 Estrutura preparada para IA');
    console.log('   📊 Campos para análise de PDF');
    
    console.log('\n🚀 Para iniciar o sistema:');
    console.log('   Backend: node server.js');
    console.log('   Frontend: npm run dev');

  } catch (error) {
    console.error('💥 Erro fatal no setup:', error);
  } finally {
    connection.end();
    console.log('\n🔌 Conexão MySQL encerrada.');
    process.exit(0);
  }
}

// Executar setup
executarSetup();