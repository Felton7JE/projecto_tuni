// Service para usuário, exemplo de chamada à API
import type { UserDTO } from '../dto/UserDTO';

export async function cadastrarUsuario(user: UserDTO) {
  // Exemplo de chamada à API
  const response = await fetch('/api/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return response.json();
}
