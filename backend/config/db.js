import mysql from 'mysql2';

// Simple database connection - will create database if MySQL is running
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  // Don't specify database initially to avoid the error
});

// Try to create the database and then use it
db.query('CREATE DATABASE IF NOT EXISTS sistema_academico', (err) => {
  if (err) {
    console.error('Erro ao criar database (MySQL pode não estar rodando):', err.message);
    console.log('Para resolver: instale e inicie o MySQL ou use outro banco de dados');
    // Don't exit, let the app continue for frontend testing
    return;
  }
  
  console.log('Database sistema_academico criado ou já existe');
  
  // Switch to the database
  db.changeUser({
    database: 'sistema_academico'
  }, (err) => {
    if (err) {
      console.error('Erro ao conectar com database:', err.message);
    } else {
      console.log('Conectado ao MySQL - Database: sistema_academico');
    }
  });
});

export default db;
