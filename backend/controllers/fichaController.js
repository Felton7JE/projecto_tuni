import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
// pdf-parse removed to avoid executing package tests from node_modules

async function extractContent(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error('Arquivo não encontrado para leitura');
  }
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf8');
  }
  // Para PDF, apenas retorna o nome do arquivo (não lê o conteúdo)
  if (ext === '.pdf') {
    return '[PDF enviado: ' + path.basename(filePath) + ']';
  }
  throw new Error('Formato não suportado (use PDF ou TXT)');
}

export async function upload(req, res) {
  try {
    const { disciplina, tema, titulo } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    if (!disciplina || !tema || !titulo) return res.status(400).json({ error: 'Disciplina, tema e título são obrigatórios' });

    const conteudo = await extractContent(req.file.path);
    
    // Ler o arquivo como buffer para salvar no banco
    const arquivoBuffer = fs.readFileSync(req.file.path);
    
    db.query(
      'INSERT INTO ficha (titulo, tema, disciplina_id, conteudo, arquivo, nome_arquivo, tipo_arquivo, tamanho_arquivo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
      [
        titulo,
        tema,
        disciplina, 
        conteudo, 
        arquivoBuffer,
        req.file.originalname,
        req.file.mimetype,
        req.file.size
      ], 
      (err, result) => {
        // Remover arquivo temporário após salvar no banco
        fs.unlinkSync(req.file.path);
        
        if (err) return res.status(500).json({ error: 'Erro ao salvar ficha: ' + err.message });
        res.json({ 
          message: 'Ficha salva com sucesso no banco de dados',
          id: result.insertId,
          disciplina,
          tema,
          titulo,
          nome_arquivo: req.file.originalname
        });
      }
    );
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// Criar ficha com texto apenas (sem arquivo)
export function createText(req, res) {
  try {
    const { titulo, tema, disciplina, conteudo } = req.body;
    
    if (!titulo || !tema || !disciplina || !conteudo) {
      return res.status(400).json({ error: 'Título, tema, disciplina e conteúdo são obrigatórios' });
    }

    db.query(
      'INSERT INTO ficha (titulo, tema, disciplina, conteudo) VALUES (?, ?, ?, ?)',
      [titulo, tema, disciplina, conteudo],
      (err, result) => {
        if (err) {
          console.error('Erro ao inserir ficha:', err);
          return res.status(500).json({ error: 'Erro ao salvar ficha' });
        }

        res.json({ 
          message: 'Ficha criada com sucesso',
          id: result.insertId,
          titulo,
          tema,
          disciplina
        });
      }
    );
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export function search(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query vazia' });

  const like = `%${q}%`;
  db.query('SELECT id, disciplina, tema, conteudo, nome_arquivo, tipo_arquivo, tamanho_arquivo, created_at FROM ficha WHERE tema LIKE ? OR conteudo LIKE ? OR disciplina LIKE ?', [like, like, like], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro na pesquisa' });
    res.json(rows);
  });
}

export function list(req, res) {
  const { disciplina } = req.query;
  
  let query = 'SELECT id, disciplina, titulo, tema, conteudo, nome_arquivo, tipo_arquivo, tamanho_arquivo, created_at FROM ficha';
  let params = [];
  
  if (disciplina) {
    // Se disciplina for um número (ID), buscar pelo nome da disciplina correspondente
    if (!isNaN(disciplina)) {
      // Primeiro buscar o nome da disciplina pelo ID
      db.query('SELECT nome FROM disciplina WHERE id = ?', [disciplina], (err, disciplinaRows) => {
        if (err || disciplinaRows.length === 0) {
          return res.status(500).json({ error: 'Erro ao buscar disciplina' });
        }
        
        const nomeDisciplina = disciplinaRows[0].nome;
        
        // Agora buscar fichas pelo nome da disciplina
        db.query(
          'SELECT id, disciplina, titulo, tema, conteudo, nome_arquivo, tipo_arquivo, tamanho_arquivo, created_at FROM ficha WHERE disciplina = ? ORDER BY id DESC',
          [nomeDisciplina],
          (err, rows) => {
            if (err) return res.status(500).json({ error: 'Erro ao buscar fichas: ' + err.message });
            res.json(rows);
          }
        );
      });
      return;
    } else {
      // Buscar pelo nome da disciplina diretamente
      query += ' WHERE disciplina = ?';
      params.push(disciplina);
    }
  }
  
  query += ' ORDER BY id DESC';
  
  db.query(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar fichas: ' + err.message });
    res.json(rows);
  });
}

// Função para listar fichas das disciplinas do aluno
export function listForAluno(req, res) {
  const id_aluno = req.user.id;

  // Buscar fichas apenas das disciplinas onde o aluno está matriculado
  db.query(`
    SELECT f.id, f.disciplina, f.titulo, f.tema, f.conteudo, f.nome_arquivo, f.tipo_arquivo, f.tamanho_arquivo, f.created_at,
           d.nome as disciplina_nome, d.codigo as disciplina_codigo
    FROM ficha f
    JOIN disciplina d ON f.disciplina = d.nome
    JOIN matricula m ON d.id = m.id_disciplina
    WHERE m.id_aluno = ?
    ORDER BY f.created_at DESC
  `, [id_aluno], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar fichas: ' + err.message });
    }
    res.json(rows);
  });
}

// Função para listar fichas de uma disciplina específica (para alunos)
export function listByDisciplina(req, res) {
  const id_aluno = req.user.id;
  const disciplinaId = req.params.disciplinaId;
  
  console.log('=== listByDisciplina ===');
  console.log('Aluno ID:', id_aluno);
  console.log('Disciplina ID:', disciplinaId);

  // Verificar se o aluno está matriculado na disciplina e buscar fichas
  db.query(`
    SELECT f.id, f.disciplina, f.titulo, f.tema, f.conteudo, f.nome_arquivo, f.tipo_arquivo, f.tamanho_arquivo, f.created_at,
           d.nome as disciplina_nome, d.codigo as disciplina_codigo
    FROM ficha f
    JOIN disciplina d ON f.disciplina = d.nome
    JOIN matricula m ON d.id = m.id_disciplina
    WHERE m.id_aluno = ? AND d.id = ?
    ORDER BY f.created_at DESC
  `, [id_aluno, disciplinaId], (err, rows) => {
    if (err) {
      console.error('Erro na query:', err);
      return res.status(500).json({ error: 'Erro ao buscar fichas: ' + err.message });
    }
    
    console.log('Fichas encontradas:', rows.length);
    console.log('Dados das fichas:', rows);
    res.json(rows);
  });
}

// Função para baixar PDF da ficha
export function downloadPdf(req, res) {
  const { id } = req.params;
  
  db.query(
    'SELECT titulo, tema, disciplina, arquivo_pdf, nome_arquivo, tipo_arquivo FROM ficha WHERE id = ?',
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar ficha' });
      }
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Ficha não encontrada' });
      }
      
      const ficha = rows[0];
      
      if (!ficha.arquivo_pdf) {
        return res.status(404).json({ error: 'Arquivo PDF não encontrado' });
      }
      
      // Configurar headers para download do PDF
      res.setHeader('Content-Type', ficha.tipo_arquivo || 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${ficha.nome_arquivo || ficha.titulo + '.pdf'}"`);
      
      // Enviar o buffer do PDF
      res.send(ficha.arquivo_pdf);
    }
  );
}

// Atualizar ficha
export function update(req, res) {
  const { id } = req.params;
  const { titulo, tema } = req.body;

  if (!titulo || !tema) {
    return res.status(400).json({ error: 'Título e tema são obrigatórios' });
  }

  db.query(
    'UPDATE ficha SET titulo = ?, tema = ? WHERE id = ?',
    [titulo, tema, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar ficha: ' + err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Ficha não encontrada' });
      }

      res.json({ message: 'Ficha atualizada com sucesso' });
    }
  );
}

// Deletar ficha
export function del(req, res) {
  const { id } = req.params;

  db.query('DELETE FROM ficha WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar ficha: ' + err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ficha não encontrada' });
    }

    res.json({ message: 'Ficha deletada com sucesso' });
  });
}

// Buscar ficha específica por ID
export function getById(req, res) {
  const { id } = req.params;
  
  const query = `
    SELECT 
      f.id,
      f.titulo,
      f.tema,
      d.nome as disciplina_nome,
      f.created_at
    FROM ficha f
    LEFT JOIN disciplina d ON f.disciplina_id = d.id
    WHERE f.id = ?
  `;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar ficha:', err);
      return res.status(500).json({ error: 'Erro ao buscar ficha' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Ficha não encontrada' });
    }
    
    res.json(results[0]);
  });
}

// Alias para delete (compatibilidade)
export const delete_ = del;
export { del as delete };
