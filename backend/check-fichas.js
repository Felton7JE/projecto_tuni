import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sistema_academico'
});

console.log('🔍 Verificando fichas no banco de dados...\n');

// Verificar estrutura da tabela
db.query('DESCRIBE ficha', (err, structure) => {
  if (err) {
    console.error('❌ Erro ao verificar estrutura:', err.message);
    return;
  }
  
  console.log('📋 Estrutura da tabela ficha:');
  console.table(structure);
  
  // Verificar dados (sem o campo BLOB para não sobrecarregar)
  db.query(`
    SELECT 
      id,
      disciplina,
      tema,
      conteudo,
      nome_arquivo,
      tipo_arquivo,
      tamanho_arquivo,
      created_at
    FROM ficha 
    ORDER BY id DESC
  `, (err, rows) => {
    if (err) {
      console.error('❌ Erro ao buscar fichas:', err.message);
      return;
    }
    
    console.log('\n📁 Fichas encontradas:');
    if (rows.length === 0) {
      console.log('❗ Nenhuma ficha encontrada. Envie uma ficha primeiro!');
    } else {
      console.table(rows);
      
      // Mostrar informações sobre arquivos PDF
      const pdfs = rows.filter(row => row.tipo_arquivo && row.tipo_arquivo.includes('pdf'));
      console.log(`\n📄 Total de PDFs salvos: ${pdfs.length}`);
      
      if (pdfs.length > 0) {
        console.log('\n💾 PDFs no banco:');
        pdfs.forEach(pdf => {
          const sizeMB = (pdf.tamanho_arquivo / (1024 * 1024)).toFixed(2);
          console.log(`  • ID ${pdf.id}: ${pdf.nome_arquivo} (${sizeMB} MB)`);
        });
      }
    }
    
    db.end();
  });
});