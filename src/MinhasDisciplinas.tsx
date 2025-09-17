// src/MinhasDisciplinas.tsx
import React, { useEffect, useState } from "react";

interface Disciplina {
  nome: string;
  codigo: string;
  ano: string;
  semestre: string;
}

const MinhasDisciplinas: React.FC = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

  const [novaDisciplina, setNovaDisciplina] = useState<Disciplina>({
    nome: "",
    codigo: "",
    ano: "",
    semestre: "",
  });

    useEffect(() => {
        async function fetchDisciplinas() {
          const res = await fetch("http://localhost:3000/disciplinas");
          const data = await res.json();
          setDisciplinas(data);
        }
        fetchDisciplinas();
    }, []);

  const adicionarDisciplina = async () => {
    if (novaDisciplina.nome && novaDisciplina.codigo && novaDisciplina.ano && novaDisciplina.semestre) {
      const res = await fetch("http://localhost:3000/disciplinas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaDisciplina),
      });

      console.log(res.status)
      setDisciplinas([...disciplinas, novaDisciplina]);
      setNovaDisciplina({ nome: "", codigo: "", ano: "", semestre: "" });
    }
  };

  const removerDisciplina = async (codigo: string) => {
    try {
      const res = await fetch(`http://localhost:3000/disciplinas/${codigo}`, {
        method: "DELETE",
      });

      console.log("Status da remoção:", res.status);

      if (res.ok) {
        setDisciplinas(disciplinas.filter((d) => d.codigo != codigo));
      } else {
        console.error("Erro ao remover disciplina.");
      }
    } catch (err) {
      console.error("Erro de rede:", err);
    }
    setDisciplinas(disciplinas.filter((d) =>d.codigo !== codigo));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Minhas Disciplinas</h1>

      {/* Formulário */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
       
        <input
          type="text"
          placeholder="Código"
          value={novaDisciplina.codigo}
          onChange={(e) => setNovaDisciplina({ ...novaDisciplina, codigo: e.target.value })}
        />
        
        <input
          type="text"
          placeholder="Nome"
          value={novaDisciplina.nome}
          onChange={(e) => setNovaDisciplina({ ...novaDisciplina, nome: e.target.value })}
        />

        <label>Ano</label>
        <select
          value={novaDisciplina.ano}
          onChange={(e) =>
            setNovaDisciplina({ ...novaDisciplina, ano: e.target.value })
          }
        >
          <option value="">Selecione</option>
          <option value="1">1º Ano</option>
          <option value="2">2º Ano</option>
          <option value="3">3º Ano</option>
          <option value="4">4º Ano</option>
        </select>

        <label>Semestre</label>
        <select
          value={novaDisciplina.semestre}
          onChange={(e) =>
            setNovaDisciplina({ ...novaDisciplina, semestre: e.target.value })
          }
        >
          <option value="">Selecione</option>
          <option value="1">1º Semestre</option>
          <option value="2">2º Semestre</option>
        </select>
        <br></br>
        <button
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={adicionarDisciplina}
        >
          + Adicionar disciplina
        </button>
      </div>

      {/* Lista */}
      {disciplinas.map((d, index) => (
        <div
          key={index}
          style={{
            marginTop: "10px",
            backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#f1f1f1",
            padding: "15px",
            borderRadius: "5px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3>{d.nome}</h3>
            <p>
              {d.codigo} — {d.ano} — {d.semestre}
            </p>
          </div>
          <button
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => removerDisciplina(d.codigo)}
          >
            Remover
          </button>
        </div>
      ))}
    </div>
  );
};

export default MinhasDisciplinas;