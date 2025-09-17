// Service para docente
import type { DocenteDTO } from '../dto/DocenteDTO';

export async function listarDocentes() {
  const response = await fetch('/api/docentes');
  return response.json();
}

export async function cadastrarDocente(docente: DocenteDTO) {
  const response = await fetch('/api/docentes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(docente),
  });
  return response.json();
}
