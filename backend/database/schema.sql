-- Script para criar as tabelas do sistema acadêmico

CREATE DATABASE IF NOT EXISTS sistema_academico;
USE sistema_academico;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('estudante', 'professor') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de disciplinas
CREATE TABLE IF NOT EXISTS disciplina (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de fichas
CREATE TABLE IF NOT EXISTS ficha (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT,
  disciplina VARCHAR(255) NOT NULL,
  id_professor INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_professor) REFERENCES usuario(id) ON DELETE SET NULL
);

-- Tabela de dúvidas
CREATE TABLE IF NOT EXISTS duvida (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL,
  id_estudante INT NOT NULL,
  id_ficha INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_estudante) REFERENCES usuario(id) ON DELETE CASCADE,
  FOREIGN KEY (id_ficha) REFERENCES ficha(id) ON DELETE SET NULL
);

-- Tabela de respostas
CREATE TABLE IF NOT EXISTS resposta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conteudo TEXT NOT NULL,
  id_duvida INT NOT NULL,
  id_usuario INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_duvida) REFERENCES duvida(id) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Inserir disciplinas padrão
INSERT IGNORE INTO disciplina (nome, codigo) VALUES 
('Matemática', 'MAT001'),
('Física', 'FIS001'),
('Programação Orientada a Objecto', 'POO001'),
('Circuitos Eletrônicos', 'CIR001');