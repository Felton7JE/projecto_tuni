import db from './config/db.js';

console.log('Atualizando estrutura de dúvidas para sistema colaborativo...');

// Adicionar campos para sistema colaborativo e IA
const columnQueries = [
  // Adicionar campos para identificar tipo de resposta e quem respondeu
  `ALTER TABLE duvida ADD COLUMN respondido_por INT NULL`,
  `ALTER TABLE duvida ADD COLUMN tipo_resposta ENUM('aluno', 'docente', 'ia') NULL`,
  `ALTER TABLE duvida ADD COLUMN resposta_ia_referencia TEXT NULL`,
  `ALTER TABLE duvida ADD COLUMN resposta_ia_pagina INT NULL`,
  `ALTER TABLE duvida ADD COLUMN resposta_ia_confianca DECIMAL(3,2) NULL`,
  `ALTER TABLE duvida ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
];

const constraintQueries = [
  // Criar foreign key para quem respondeu (só se a coluna existir)
  `ALTER TABLE duvida ADD CONSTRAINT fk_duvida_respondido_por 
   FOREIGN KEY (respondido_por) REFERENCES usuario(id) ON DELETE SET NULL`,
];

// Executar queries sequencialmente
async function executeQueries() {
  // Primeiro adicionar colunas
  for (const query of columnQueries) {
    try {
      await new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
          if (err) {
            // Ignorar erros de coluna já existente
            if (err.code === 'ER_DUP_FIELDNAME' || err.message.includes('Duplicate column name')) {
              console.log(`Campo já existe: ${query.substring(0, 50)}...`);
              resolve(result);
            } else {
              reject(err);
            }
          } else {
            console.log(`✓ Coluna adicionada: ${query.substring(0, 50)}...`);
            resolve(result);
          }
        });
      });
    } catch (error) {
      console.error('Erro ao adicionar coluna:', error);
    }
  }
  
  // Depois adicionar constraints
  for (const query of constraintQueries) {
    try {
      await new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_KEYNAME' || err.message.includes('Duplicate key name')) {
              console.log(`Constraint já existe: ${query.substring(0, 50)}...`);
              resolve(result);
            } else {
              console.error('Erro na constraint (ignorando):', err.message);
              resolve(result); // Continuar mesmo com erro
            }
          } else {
            console.log(`✓ Constraint adicionada: ${query.substring(0, 50)}...`);
            resolve(result);
          }
        });
      });
    } catch (error) {
      console.error('Erro ao adicionar constraint:', error);
    }
  }
}

executeQueries().then(() => {
  console.log('\n✓ Atualização concluída! Sistema colaborativo pronto.');
  process.exit(0);
}).catch((error) => {
  console.error('Erro na atualização:', error);
  process.exit(1);
});