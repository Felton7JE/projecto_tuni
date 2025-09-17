import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Dashboard.css';

interface Ficha {
  id: number;
  titulo: string;
  tema: string;
  disciplina_nome: string;
  created_at: string;
}

const FichasAluno: React.FC = () => {
  const navigate = useNavigate();
  const { disciplinaId } = useParams();
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [loading, setLoading] = useState(true);
  const [disciplinaNome, setDisciplinaNome] = useState('');

  useEffect(() => {
    loadFichas();
  }, [disciplinaId]);

  const loadFichas = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Carregando fichas da disciplina:', disciplinaId);
      
      const response = await fetch(`http://localhost:3000/fichas/disciplina/${disciplinaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fichas carregadas:', data);
        setFichas(data);
        if (data.length > 0) {
          setDisciplinaNome(data[0].disciplina_nome);
        }
      } else {
        const errorText = await response.text();
        console.error('Erro na resposta:', response.status, errorText);
      }
    } catch (error) {
      console.error('Erro ao carregar fichas:', error);
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

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Fichas - {disciplinaNome}</h1>
          <div className="header-actions">
            <button onClick={() => navigate('/dashboard-aluno')} className="btn-secondary">
              Voltar
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <div className="section-header">
            <h2>Fichas Disponíveis</h2>
          </div>

          {loading ? (
            <div className="loading">Carregando...</div>
          ) : fichas.length > 0 ? (
            <div className="fichas-grid">
              {fichas.map((ficha) => (
                <div key={ficha.id} className="ficha-card">
                  <div className="ficha-header">
                    <div className="file-icon">📄</div>
                    <div className="ficha-info">
                      <h3>{ficha.titulo}</h3>
                      <span className="ficha-disciplina">{ficha.disciplina_nome}</span>
                    </div>
                  </div>
                  
                  <div className="ficha-content">
                    <p><strong>Tema:</strong> {ficha.tema}</p>
                    <p><strong>Data:</strong> {new Date(ficha.created_at).toLocaleDateString()}</p>
                    
                    <div className="file-type-badge">
                      <span className="pdf-icon">📄</span>
                      <span>Arquivo PDF</span>
                    </div>
                  </div>

                  <div className="ficha-actions">
                    <button 
                      onClick={() => visualizarFicha(ficha.id, ficha.titulo)}
                      className="btn-primary"
                    >
                      Baixar Ficha
                    </button>
                    <button 
                      onClick={() => navigate(`/aluno/ficha/${ficha.id}/duvidas`)}
                      className="btn-secondary"
                    >
                      Dúvidas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Nenhuma ficha disponível para esta disciplina ainda.</p>
              <p>As fichas aparecerão aqui quando o docente as disponibilizar.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>&copy; 2025 Sistema Integrado de Gestão Acadêmica. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default FichasAluno;