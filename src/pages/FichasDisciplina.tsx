import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Dashboard.css';

interface Ficha {
  id: number;
  titulo: string;
  tema: string;
  disciplina: string;
  conteudo: string;
  created_at: string;
}

interface Disciplina {
  id: number;
  nome: string;
  codigo: string;
  descricao?: string;
}

const FichasDisciplina: React.FC = () => {
  const { disciplinaId } = useParams<{ disciplinaId: string }>();
  const navigate = useNavigate();
  const [disciplina, setDisciplina] = useState<Disciplina | null>(null);
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFicha, setEditingFicha] = useState<Ficha | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    tema: '',
    arquivo: null as File | null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.tipo !== 'docente') {
      navigate('/dashboard-aluno');
      return;
    }

    loadDisciplina();
    loadFichas();
  }, [disciplinaId, navigate]);

  const loadDisciplina = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/disciplinas/${disciplinaId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDisciplina(data);
      } else {
        setError('Disciplina não encontrada');
      }
    } catch (err) {
      setError('Erro ao carregar disciplina');
      console.error(err);
    }
  };

  const loadFichas = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Carregando fichas para disciplina ID:', disciplinaId);
      
      const response = await fetch(`http://localhost:3000/fichas?disciplina=${disciplinaId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Fichas carregadas:', data);
        setFichas(data);
      } else {
        const errorText = await response.text();
        console.error('Erro ao carregar fichas:', errorText);
      }
    } catch (err) {
      console.error('Erro ao carregar fichas:', err);
    } finally {
      setLoading(false);
    }
  };

  const visualizarFicha = async (fichaId: number, titulo: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/fichas/download/${fichaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${titulo}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Erro ao baixar a ficha');
      }
    } catch (error) {
      console.error('Erro ao baixar ficha:', error);
      alert('Erro ao baixar a ficha');
    }
  };

  const editarFicha = (ficha: Ficha) => {
    setEditingFicha(ficha);
    setFormData({
      titulo: ficha.titulo,
      tema: ficha.tema,
      arquivo: null
    });
    setShowModal(true);
  };

  const apagarFicha = async (fichaId: number, titulo: string) => {
    if (!confirm(`Tem certeza que deseja apagar a ficha "${titulo}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/fichas/${fichaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Ficha apagada com sucesso!');
        loadFichas(); // Recarregar a lista
      } else {
        const errorData = await response.json();
        alert(`Erro ao apagar ficha: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erro ao apagar ficha:', error);
      alert('Erro ao apagar ficha');
    }
  };

  const criarFicha = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Se estamos editando uma ficha existente
      if (editingFicha) {
        const updateData = {
          titulo: formData.titulo,
          tema: formData.tema
        };

        const response = await fetch(`http://localhost:3000/fichas/${editingFicha.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        });

        if (response.ok) {
          alert('Ficha atualizada com sucesso!');
          setShowModal(false);
          setEditingFicha(null);
          setFormData({ titulo: '', tema: '', arquivo: null });
          loadFichas();
        } else {
          const errorData = await response.json();
          alert(`Erro ao atualizar ficha: ${errorData.error}`);
        }
        return;
      }
      
      // Criação de nova ficha
      if (!formData.arquivo) {
        alert('Por favor, selecione um arquivo PDF');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('tema', formData.tema);
      formDataToSend.append('disciplina', disciplinaId || 'Disciplina');
      formDataToSend.append('arquivo', formData.arquivo);

      const response = await fetch('http://localhost:3000/fichas/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      console.log("\nStatus Code: ", response.status, "\nBody: ", response.body, "\n");

      if (response.ok) {
        setShowModal(false);
        setFormData({ titulo: '', tema: '', arquivo: null });
        loadFichas();
        alert('Ficha criada com sucesso!');
      } else {
        const errorData = await response.json();
        console.log(errorData);
        alert(`Erro ao criar ficha: ${errorData.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao criar ficha:', error);
      alert('Erro ao criar ficha');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setEditingFicha(null);
    setFormData({ titulo: '', tema: '', arquivo: null });
    setShowModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Fichas da Disciplina</h1>
          <div className="header-actions">
            <button onClick={() => navigate('/dashboard-docente')} className="btn-secondary">
              Voltar
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          {disciplina && (
            <div className="section-header">
              <div>
                <h2>{disciplina.nome}</h2>
                <div className="disciplina-info">
                  <span className="disciplina-codigo">{disciplina.codigo}</span>
                </div>
                {disciplina.descricao && (
                  <p className="disciplina-descricao">{disciplina.descricao}</p>
                )}
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="section-content">
            <div className="section-header">
              <h3>Fichas Disponíveis ({fichas.length})</h3>
              <button onClick={openModal} className="btn-primary">
                Adicionar Ficha
              </button>
            </div>
            
            {fichas.length > 0 ? (
              <div className="cards-grid">
                {fichas.map((ficha) => (
                  <div key={ficha.id} className="card">
                    <div className="card-icon">
                      📄
                    </div>
                    <h4>{ficha.titulo}</h4>
                    <p><strong>Tema:</strong> {ficha.tema}</p>
                    <div className="file-type-badge">
                      <span className="pdf-icon">📄</span>
                      <span>Arquivo PDF</span>
                    </div>
                    <p><strong>Data:</strong> {new Date(ficha.created_at).toLocaleDateString()}</p>
                    <div className="card-actions">
                      <button 
                        onClick={() => visualizarFicha(ficha.id, ficha.titulo)}
                        className="btn-primary"
                      >
                        Baixar PDF
                      </button>
                      <button 
                        onClick={() => editarFicha(ficha)}
                        className="btn-edit"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => apagarFicha(ficha.id, ficha.titulo)}
                        className="btn-delete"
                      >
                        Apagar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Nenhuma ficha encontrada para esta disciplina.</p>
                <p>As fichas serão exibidas aqui quando os alunos enviarem suas dúvidas e materiais.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal para adicionar ficha */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                {editingFicha ? `Editar Ficha - ${disciplina?.nome}` : `Nova Ficha - ${disciplina?.nome}`}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={criarFicha} className="modal-form">
              <div className="form-group">
                <label htmlFor="titulo">Título da Ficha</label>
                <input
                  type="text"
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  required
                  placeholder="Ex: Introdução ao conceito"
                />
              </div>

              <div className="form-group">
                <label htmlFor="tema">Tema</label>
                <input
                  type="text"
                  id="tema"
                  value={formData.tema}
                  onChange={(e) => setFormData({...formData, tema: e.target.value})}
                  required
                  placeholder="Ex: Álgebra Linear"
                />
              </div>

              <div className="form-group">
                <label htmlFor="arquivo">
                  Arquivo PDF da Ficha {editingFicha ? '(opcional - deixe vazio para manter o arquivo atual)' : ''}
                </label>
                <input
                  type="file"
                  id="arquivo"
                  accept=".pdf"
                  onChange={(e) => setFormData({...formData, arquivo: e.target.files?.[0] || null})}
                  required={!editingFicha}
                />
                <small>Selecione um arquivo PDF (máximo 10MB)</small>
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
                  {loading 
                    ? (editingFicha ? 'Atualizando...' : 'Criando...') 
                    : (editingFicha ? 'Atualizar Ficha' : 'Criar Ficha')
                  }
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

export default FichasDisciplina;