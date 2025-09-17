import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

interface Disciplina {
  id: number;
  nome: string;
  codigo: string;
  descricao?: string;
  docente_nome?: string;
  created_at: string;
}

const DashboardAluno: React.FC = () => {
  const navigate = useNavigate();
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [codigoDisciplina, setCodigoDisciplina] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.tipo !== 'aluno') {
      navigate('/dashboard-docente');
      return;
    }

    setUser(parsedUser);
    loadDisciplinas();
  }, [navigate]);

  const loadDisciplinas = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Carregando disciplinas do aluno...', token ? 'Token exists' : 'No token');
      
      const response = await fetch('http://localhost:3000/disciplinas/aluno', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Disciplinas carregadas:', data);
        setDisciplinas(data);
      } else {
        const errorText = await response.text();
        console.error('Erro na resposta:', response.status, errorText);
      }
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cadastrarEmDisciplina = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/disciplinas/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ codigo: codigoDisciplina })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Cadastrado na disciplina com sucesso!');
        setShowModal(false);
        setCodigoDisciplina('');
        loadDisciplinas();
      } else {
        setError(data.error || 'Erro ao cadastrar na disciplina');
      }
    } catch (error) {
      setError('Erro ao cadastrar na disciplina');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setCodigoDisciplina('');
    setError('');
    setShowModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading && disciplinas.length === 0) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard do Aluno</h1>
          <div className="header-actions">
            <span>Olá, {user?.nome}</span>
            <button onClick={handleLogout} className="logout-btn">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <div className="section-header">
            <h2>Minhas Disciplinas</h2>
            <button onClick={openModal} className="btn-primary">
              Cadastrar em Disciplina
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="disciplinas-grid">
            {disciplinas.map((disciplina) => (
              <div key={disciplina.id} className="disciplina-card">
                <div className="disciplina-header">
                  <h3>{disciplina.nome}</h3>
                  <span className="disciplina-codigo">{disciplina.codigo}</span>
                </div>
                
                {disciplina.descricao && (
                  <p className="disciplina-descricao">{disciplina.descricao}</p>
                )}

                {disciplina.docente_nome && (
                  <p className="disciplina-docente">
                    <strong>Docente:</strong> {disciplina.docente_nome}
                  </p>
                )}

                <div className="disciplina-actions">
                  <button 
                    onClick={() => navigate(`/aluno/disciplina/${disciplina.id}/fichas`)}
                    className="btn-secondary"
                  >
                    Ver Fichas
                  </button>
                  <button 
                    onClick={() => navigate(`/aluno/disciplina/${disciplina.id}/duvidas`)}
                    className="btn-edit"
                  >
                    Dúvidas
                  </button>
                </div>
              </div>
            ))}
          </div>

          {disciplinas.length === 0 && (
            <div className="empty-state">
              <p>Você ainda não está cadastrado em nenhuma disciplina.</p>
              <button onClick={openModal} className="btn-primary">
                Cadastrar na primeira disciplina
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modal para cadastrar em disciplina */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Cadastrar em Disciplina</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={cadastrarEmDisciplina} className="modal-form">
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="codigo">Código da Disciplina</label>
                <input
                  type="text"
                  id="codigo"
                  value={codigoDisciplina}
                  onChange={(e) => setCodigoDisciplina(e.target.value)}
                  required
                  placeholder="Ex: POO001, MAT101"
                />
                <small>Digite o código fornecido pelo docente</small>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>&copy; 2025 Sistema Integrado de Gestão Acadêmica. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardAluno;