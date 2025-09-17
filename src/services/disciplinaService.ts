// Service para disciplina
import type { DisciplinaDTO } from '../dto/DisciplinaDTO';

export async function listarDisciplinas() {
  const response = await fetch('/api/disciplinas');
  return response.json();
}

export async function cadastrarDisciplina(disciplina: DisciplinaDTO) {
  const response = await fetch('/api/disciplinas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(disciplina),
  });
  return response.json();
}
