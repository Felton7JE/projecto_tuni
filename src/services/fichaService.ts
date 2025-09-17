// Service para ficha
import type { FichaDTO } from '../dto/FichaDTO';

export async function enviarFicha(fichaData: {
  disciplina: string;
  tema: string;
  ficheiro: File;
}): Promise<FichaDTO> {
  const formData = new FormData();
  formData.append('disciplina', fichaData.disciplina);
  formData.append('tema', fichaData.tema);
  formData.append('ficheiro', fichaData.ficheiro);

  const response = await fetch('http://localhost:3000/fichas', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error(error.error || 'Erro ao enviar ficha');
  }

  return response.json();
}

export async function buscarFichas(query?: string): Promise<FichaDTO[]> {
  const url = query 
    ? `http://localhost:3000/fichas/search?q=${encodeURIComponent(query)}`
    : 'http://localhost:3000/fichas';
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar fichas');
  }
  
  return response.json();
}

export async function baixarPdf(id: number): Promise<Blob> {
  const response = await fetch(`http://localhost:3000/fichas/download/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao baixar PDF');
  }
  
  return response.blob();
}
