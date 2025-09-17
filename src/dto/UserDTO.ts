// DTO para usuário, baseado em possíveis páginas como Cadastro e Login
export interface UserDTO {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
}
