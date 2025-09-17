import db from './config/db.js';

// Criar algumas fichas de exemplo
const fichasExemplo = [
  {
    disciplina: 'Matemática',
    titulo: 'Álgebra Linear',
    conteudo: 'Conteúdo sobre álgebra linear...'
  },
  {
    disciplina: 'Física',
    titulo: 'Mecânica Clássica',
    conteudo: 'Conteúdo sobre mecânica clássica...'
  },
  {
    disciplina: 'Programação',
    titulo: 'JavaScript Avançado',
    conteudo: 'Conteúdo sobre JavaScript avançado...'
  }
];

// Função para inserir fichas de exemplo
async function inserirFichasExemplo() {
  try {
    console.log('Inserindo fichas de exemplo...');
    
    // Aguardar um pouco para garantir que a conexão esteja estabelecida
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    for (const ficha of fichasExemplo) {
      await new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO ficha (disciplina, titulo, conteudo) VALUES (?, ?, ?)',
          [
            ficha.disciplina,
            ficha.titulo,
            ficha.conteudo
          ],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              console.log(`Ficha "${ficha.titulo}" inserida com ID: ${result.insertId}`);
              resolve(result);
            }
          }
        );
      });
    }
    
    console.log('Fichas de exemplo inseridas com sucesso!');
    
    // Verificar se foram inseridas
    db.query('SELECT id, disciplina, titulo FROM ficha', (err, fichas) => {
      if (err) {
        console.error('Erro ao buscar fichas:', err);
      } else {
        console.log('Fichas na base de dados:');
        console.table(fichas);
      }
      process.exit();
    });
    
  } catch (error) {
    console.error('Erro ao inserir fichas:', error);
    process.exit();
  }
}

inserirFichasExemplo();