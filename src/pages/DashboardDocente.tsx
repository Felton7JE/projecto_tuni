import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

interface Disciplina {
  id: number;
  nome: string;
  codigo: string;
  descricao?: string;
  created_at: string;
}

const DashboardDocente: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDisciplina, setEditingDisciplina] = useState<Disciplina | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    descricao: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.tipo !== 'docente') {
      navigate('/dashboard-aluno');
      return;
    }

    setUser(parsedUser);
    loadDisciplinas();
  }, [navigate]);

  const loadDisciplinas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/disciplinas/minhas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        throw new Error('Erro ao carregar disciplinas');
      }

      const data = await response.json();
      setDisciplinas(data);
    } catch (err) {
      setError('Erro ao carregar disciplinas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = editingDisciplina 
        ? `http://localhost:3000/disciplinas/${editingDisciplina.id}`
        : 'http://localhost:3000/disciplinas';
      
      const method = editingDisciplina ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar disciplina');
      }

      setShowModal(false);
      setEditingDisciplina(null);
      setFormData({ nome: '', codigo: '', descricao: '' });
      loadDisciplinas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (disciplina: Disciplina) => {
    setEditingDisciplina(disciplina);
    setFormData({
      nome: disciplina.nome,
      codigo: disciplina.codigo,
      descricao: disciplina.descricao || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta disciplina?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/disciplinas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao deletar disciplina');
      }

      loadDisciplinas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    }
  };

  const openModal = () => {
    setEditingDisciplina(null);
    setFormData({ nome: '', codigo: '', descricao: '' });
    setShowModal(true);
  };

  if (loading && disciplinas.length === 0) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard do Docente</h1>
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
              Nova Disciplina
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

                <div className="disciplina-actions">
                  <button 
                    onClick={() => navigate(`/docente/disciplina/${disciplina.id}/fichas`)}
                    className="btn-secondary"
                  >
                    Ver Fichas
                  </button>
                  <button 
                    onClick={() => handleEdit(disciplina)}
                    className="btn-edit"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(disciplina.id)}
                    className="btn-delete"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {disciplinas.length === 0 && (
            <div className="empty-state">
              <p>Nenhuma disciplina cadastrada ainda.</p>
              <button onClick={openModal} className="btn-primary">
                Criar primeira disciplina
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                {editingDisciplina ? 'Editar Disciplina' : 'Nova Disciplina'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="nome">Nome da Disciplina</label>
                <input
                  type="text"
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                  placeholder="Ex: Programação Orientada a Objetos"
                />
              </div>

              <div className="form-group">
                <label htmlFor="codigo">Código</label>
                <input
                  type="text"
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                  required
                  placeholder="Ex: POO001"
                />
              </div>

              <div className="form-group">
                <label htmlFor="descricao">Descrição (opcional)</label>
                <textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descrição da disciplina"
                  rows={3}
                />
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
                  {loading ? 'Salvando...' : 'Salvar'}
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

export default DashboardDocente;