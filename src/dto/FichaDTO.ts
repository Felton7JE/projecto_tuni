// DTO para ficha enviada pelo docente
export interface FichaDTO {
  id?: number;
  disciplina: string;
  tema: string;
  conteudo?: string;
  nome_arquivo?: string;
  tipo_arquivo?: string;
  tamanho_arquivo?: number;
  created_at?: string;
}
