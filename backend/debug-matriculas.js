import db from './config/db.js';

console.log('=== Verificando matrículas na base de dados ===');

// Verificar todas as matrículas
db.query('SELECT * FROM matricula', (err, matriculas) => {
  if (err) {
    console.error('Erro ao buscar matrículas:', err);
    return;
  }
  
  console.log('Todas as matrículas:', matriculas);
  
  // Verificar usuários
  db.query('SELECT id, nome, email, tipo FROM usuario WHERE tipo = "aluno"', (err, alunos) => {
    if (err) {
      console.error('Erro ao buscar alunos:', err);
      return;
    }
    
    console.log('Todos os alunos:', alunos);
    
    // Verificar disciplinas
    db.query('SELECT * FROM disciplina', (err, disciplinas) => {
      if (err) {
        console.error('Erro ao buscar disciplinas:', err);
        return;
      }
      
      console.log('Todas as disciplinas:', disciplinas);
      
      // Fazer join completo
      db.query(`
        SELECT 
          m.id as matricula_id,
          m.id_aluno,
          m.id_disciplina,
          u.nome as aluno_nome,
          u.email as aluno_email,
          d.nome as disciplina_nome,
          d.codigo as disciplina_codigo
        FROM matricula m
        JOIN usuario u ON m.id_aluno = u.id
        JOIN disciplina d ON m.id_disciplina = d.id
      `, (err, resultado) => {
        if (err) {
          console.error('Erro no join:', err);
          return;
        }
        
        console.log('Join completo (aluno + disciplina):', resultado);
        
        process.exit(0);
      });
    });
  });
});