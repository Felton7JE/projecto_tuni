import fetch from 'node-fetch';

// Simular uma requisição para testar a rota
const testRoute = async () => {
  try {
    // Primeiro vamos testar sem token para ver se a rota responde
    console.log('Testando rota /disciplinas/aluno...');
    
    const response = await fetch('http://localhost:3000/disciplinas/aluno', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', response.headers.raw());
    
    const text = await response.text();
    console.log('Response:', text);
    
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
};

testRoute();