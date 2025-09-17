import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Dashboard.css';

interface Duvida {
  id: number;
  pergunta: string;
  resposta?: string;
  status: 'pendente' | 'respondida';
  ficha_titulo: string;
  disciplina_nome: string;
  created_at: string;
  updated_at?: string;
  pergunta_por: string;
  pergunta_por_tipo: 'aluno' | 'docente';
  respondido_por_nome?: string;
  respondido_por_tipo?: 'aluno' | 'docente' | 'ia';
  tipo_resposta?: 'aluno' | 'docente' | 'ia';
  resposta_ia_referencia?: string;
  resposta_ia_pagina?: number;
  resposta_ia_confianca?: number;
}

interface Ficha {
  id: number;
  titulo: string;
  tema: string;
  disciplina_nome: string;
}

const DuvidasFicha: React.FC = () => {
  const navigate = useNavigate();
  const { fichaId } = useParams();
  const [duvidas, setDuvidas] = useState<Duvida[]>([]);
  const [loading, setLoading] = useState(false);
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [novaDuvida, setNovaDuvida] = useState({ pergunta: '' });
  const [respostaForm, setRespostaForm] = useState<{duvidaId: number | null, resposta: string}>({
    duvidaId: null,
    resposta: ''
  });
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadDuvidas();
    loadFichaInfo();
    loadCurrentUser();
  }, [fichaId]);

  const loadCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  };

  const loadFichaInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/fichas/${fichaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFicha(data);
      }
    } catch (error) {
      console.error('Erro ao carregar informações da ficha:', error);
    }
  };

  const loadDuvidas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/duvidas/ficha/${fichaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDuvidas(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dúvidas:', error);
    }
  };

  const submitDuvida = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaDuvida.pergunta.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/duvidas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id_ficha: fichaId,
          pergunta: novaDuvida.pergunta
        })
      });

      if (response.ok) {
        setNovaDuvida({ pergunta: '' });
        loadDuvidas();
      }
    } catch (error) {
      console.error('Erro ao enviar dúvida:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitResposta = async (duvidaId: number) => {
    if (!respostaForm.resposta.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/duvidas/${duvidaId}/responder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          resposta: respostaForm.resposta
        })
      });

      if (response.ok) {
        setRespostaForm({ duvidaId: null, resposta: '' });
        loadDuvidas();
      }
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
    } finally {
      setLoading(false);
    }
  };

  const openRespostaForm = (duvidaId: number) => {
    setRespostaForm({ duvidaId, resposta: '' });
  };

  const closeRespostaForm = () => {
    setRespostaForm({ duvidaId: null, resposta: '' });
  };

  const getTipoRespostaBadge = (tipo?: string) => {
    switch (tipo) {
      case 'docente':
        return <span className="badge badge-docente">Docente</span>;
      case 'ia':
        return <span className="badge badge-ia">IA Assistant</span>;
      case 'aluno':
        return <span className="badge badge-aluno">Colega</span>;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dúvidas Colaborativas - {ficha?.titulo || 'Carregando...'}</h1>
          <div className="header-actions">
            <button onClick={() => navigate('/dashboard-aluno')} className="btn-secondary">
              Voltar
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <div className="nova-duvida-section">
            <h3>Nova Dúvida sobre: {ficha?.titulo}</h3>
            <p><strong>Disciplina:</strong> {ficha?.disciplina_nome}</p>
            <p><strong>Tema:</strong> {ficha?.tema}</p>
            <p className="colaborativo-info">
              💡 <strong>Sistema Colaborativo:</strong> Suas dúvidas serão vistas por todos os colegas matriculados na disciplina, que podem ajudar com respostas!
            </p>
            
            <form onSubmit={submitDuvida} className="nova-duvida-form">
              <div className="form-group">
                <label htmlFor="pergunta">Sua Dúvida</label>
                <textarea
                  id="pergunta"
                  placeholder="Digite sua dúvida sobre esta ficha... Seja específico para que seus colegas possam ajudar melhor!"
                  value={novaDuvida.pergunta}
                  onChange={(e) => setNovaDuvida({pergunta: e.target.value})}
                  required
                  rows={4}
                />
              </div>
              
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Enviando...' : 'Publicar Dúvida'}
              </button>
            </form>
          </div>

          <div className="duvidas-section">
            <h3>Dúvidas da Turma sobre esta Ficha</h3>
            <p className="info-colaborativo">
              Aqui você vê todas as dúvidas dos colegas matriculados na disciplina. Você pode responder e ajudar outros estudantes!
            </p>
            
            {duvidas.length > 0 ? (
              <div className="duvidas-list">
                {duvidas.map((duvida) => (
                  <div key={duvida.id} className={`duvida-card ${duvida.status}`}>
                    <div className="duvida-header">
                      <h4>{duvida.ficha_titulo}</h4>
                      <div className="status-badges">
                        <span className={`status-badge ${duvida.status}`}>
                          {duvida.status === 'pendente' ? 'Aguardando Resposta' : 'Respondida'}
                        </span>
                        <span className="autor-badge">
                          Por: {duvida.pergunta_por} ({duvida.pergunta_por_tipo})
                        </span>
                      </div>
                    </div>
                    
                    <div className="duvida-content">
                      <div className="pergunta">
                        <strong>Dúvida:</strong>
                        <p>{duvida.pergunta}</p>
                      </div>
                      
                      {duvida.resposta && (
                        <div className="resposta">
                          <div className="resposta-header">
                            <strong>Resposta:</strong>
                            {getTipoRespostaBadge(duvida.tipo_resposta)}
                            {duvida.respondido_por_nome && (
                              <span className="respondido-por">
                                por {duvida.respondido_por_nome}
                              </span>
                            )}
                          </div>
                          <p>{duvida.resposta}</p>
                          
                          {duvida.tipo_resposta === 'ia' && duvida.resposta_ia_referencia && (
                            <div className="ia-metadata">
                              <h5>📄 Referência da IA:</h5>
                              <p>{duvida.resposta_ia_referencia}</p>
                              {duvida.resposta_ia_pagina && (
                                <p><strong>Página:</strong> {duvida.resposta_ia_pagina}</p>
                              )}
                              {duvida.resposta_ia_confianca && (
                                <p><strong>Confiança:</strong> {(duvida.resposta_ia_confianca * 100).toFixed(1)}%</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {duvida.status === 'pendente' && (
                        <div className="resposta-actions">
                          {respostaForm.duvidaId === duvida.id ? (
                            <div className="resposta-form">
                              <textarea
                                placeholder="Digite sua resposta para ajudar seu colega..."
                                value={respostaForm.resposta}
                                onChange={(e) => setRespostaForm({...respostaForm, resposta: e.target.value})}
                                rows={3}
                              />
                              <div className="form-actions">
                                <button 
                                  onClick={() => submitResposta(duvida.id)}
                                  disabled={loading || !respostaForm.resposta.trim()}
                                  className="btn-primary btn-sm"
                                >
                                  {loading ? 'Enviando...' : 'Enviar Resposta'}
                                </button>
                                <button 
                                  onClick={closeRespostaForm}
                                  className="btn-secondary btn-sm"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button 
                              onClick={() => openRespostaForm(duvida.id)}
                              className="btn-outline btn-sm"
                            >
                              💬 Ajudar com uma resposta
                            </button>
                          )}
                        </div>
                      )}
                      
                      <div className="duvida-meta">
                        <small>
                          Publicada em: {new Date(duvida.created_at).toLocaleDateString()} às {new Date(duvida.created_at).toLocaleTimeString()}
                          {duvida.updated_at && duvida.updated_at !== duvida.created_at && (
                            <span> • Atualizada em: {new Date(duvida.updated_at).toLocaleDateString()}</span>
                          )}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>🤔 Ainda não há dúvidas sobre esta ficha.</p>
                <p>Seja o primeiro a fazer uma pergunta ou ajude a explicar o conteúdo!</p>
              </div>
            )}
          </div>

          <div className="ia-section">
            <h3>🤖 Assistente IA (Em Desenvolvimento)</h3>
            <div className="ia-preview">
              <p>
                <strong>Em breve:</strong> Nossa IA poderá analisar o PDF desta ficha e fornecer respostas precisas 
                com referências exatas do documento, destacando onde encontrar a informação.
              </p>
              <div className="ia-features">
                <div className="feature">
                  <span className="feature-icon">📖</span>
                  <span>Análise automática de PDFs</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🎯</span>
                  <span>Respostas com referências precisas</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📊</span>
                  <span>Nível de confiança da resposta</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">⚡</span>
                  <span>Respostas instantâneas 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>&copy; 2025 Sistema Integrado de Gestão Acadêmica - Aprendizado Colaborativo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default DuvidasFicha;