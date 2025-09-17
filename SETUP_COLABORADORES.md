# Guia de Configuração para Colaboradores

## 📋 Pré-requisitos
- Node.js (versão 16 ou superior)
- MySQL Server
- Git
- VS Code (recomendado)

## 🚀 Como Configurar o Projeto

### 1. Clonar o Repositório
```bash
git clone [URL-DO-SEU-REPOSITORIO]
cd meu-projecto
```

### 2. Instalar Dependências
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 3. Configurar Banco de Dados MySQL

#### Instalar dependências do backend:
```bash
cd backend
npm install
cd ..
```

#### Criar o sistema completo do zero:
```bash
cd backend
node criar-sistema-completo.js
```

**⚠️ ATENÇÃO: Este script remove qualquer database existente e cria tudo do zero!**

**Este script único faz tudo:**
- 🗑️ Remove database antigo (se existir)
- 🆕 Cria database "sistema_academico" 
- 📋 Cria todas as 7 tabelas necessárias
- 👥 Insere usuários de exemplo (1 docente + 3 alunos)
- 📚 Cria disciplinas e fichas de exemplo
- 💬 Adiciona dúvidas de demonstração
- 🤝 Configura sistema colaborativo
- 🤖 Prepara estrutura para IA

### 4. Configurar Variáveis de Ambiente

Criar arquivo `.env` na pasta `backend/` com:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=sistema_academico
JWT_SECRET=seu_jwt_secret_aqui
```

### 5. Iniciar o Projeto

#### Terminal 1 - Backend:
```bash
cd backend
node server.js
```

#### Terminal 2 - Frontend:
```bash
npm run dev
```

## 🎯 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- Login/Cadastro para Alunos e Docentes
- JWT Authentication
- Middleware de proteção de rotas

### ✅ Dashboard Diferenciado
- **Dashboard Docente**: Gerenciamento de disciplinas e fichas
- **Dashboard Aluno**: Visualização de disciplinas matriculadas

### ✅ Sistema de Fichas
- Upload de PDFs por docentes
- Organização por disciplina e tema
- Visualização para alunos matriculados

### ✅ Sistema Colaborativo de Dúvidas **[NOVO!]**
- **Dúvidas por Ficha**: Mais específicas e práticas
- **Colaboração entre Alunos**: Todos da disciplina podem ver e responder
- **Identificação de Respostas**: Badges para docente/aluno/IA
- **Sistema preparado para IA**: Campos para referências de PDF

## 🤖 Próximas Funcionalidades (IA)

### Estrutura já implementada para:
- **Análise automática de PDFs**
- **Respostas com referências precisas**
- **Nível de confiança das respostas**
- **Destaque de trechos relevantes**

## 🗂️ Estrutura do Projeto

```
meu-projecto/
├── src/                    # Frontend React + TypeScript
│   ├── pages/
│   │   ├── DashboardAluno.tsx
│   │   ├── DashboardDocente.tsx
│   │   ├── FichasAluno.tsx
│   │   ├── DuvidasFicha.tsx  # Sistema colaborativo
│   │   └── ...
│   └── components/
├── backend/                # Backend Node.js + Express
│   ├── controllers/
│   │   ├── duvidaController.js  # Sistema colaborativo
│   │   └── ...
│   ├── routes/
│   ├── middlewares/
│   └── config/
└── uploads/               # Arquivos PDF das fichas
```

## 📊 Banco de Dados

### Tabelas Principais:
- **usuario**: Alunos e docentes
- **disciplina**: Disciplinas do sistema
- **matricula**: Relação aluno-disciplina
- **ficha**: PDFs organizados por tema
- **duvida**: Sistema colaborativo com suporte a IA

### Campos para IA (já implementados):
- `tipo_resposta`: 'aluno' | 'docente' | 'ia'
- `resposta_ia_referencia`: Trecho do PDF
- `resposta_ia_pagina`: Página específica
- `resposta_ia_confianca`: Nível de certeza (0-1)

## 🎨 Design System

### Paleta de Cores:
- **Primário**: #4169e1 (Azul)
- **Gradiente**: #667eea → #764ba2
- **Sucesso**: #4caf50
- **Aviso**: #ff9800
- **Colaborativo**: #e3f2fd

### Componentes Visuais:
- Cards responsivos
- Badges de identificação
- Formulários modernos
- Animações suaves

## 🔧 Como Contribuir

1. **Criar branch para feature**:
   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. **Fazer commits descritivos**:
   ```bash
   git commit -m "feat: adicionar funcionalidade X"
   ```

3. **Push e Pull Request**:
   ```bash
   git push origin feature/nome-da-feature
   ```

## 🚨 Problemas Comuns

### Erro de Conexão MySQL:
- Verificar se MySQL está rodando
- Conferir credenciais no `.env`
- Rodar scripts de setup

### Erro de Módulos:
- Executar `npm install` nas pastas raiz e backend
- Verificar versão do Node.js

### Erro de CORS:
- Backend já configurado com CORS
- Verificar se ambos serviços estão rodando

## 📱 URLs do Projeto

- **Frontend**: http://localhost:5173 ou http://localhost:5174
- **Backend**: http://localhost:3000

## 👥 Credenciais de Teste

Após executar `setup-db.js`, você terá:

**Docente:**
- Email: docente@teste.com
- Senha: 123456

**Aluno:**
- Email: aluno@teste.com  
- Senha: 123456

## 📈 Roadmap Futuro

### Sistema de IA (em desenvolvimento):
1. **Integração com APIs de IA** (OpenAI/Claude)
2. **Parser de PDF** para extração de texto
3. **Sistema de embeddings** para busca semântica
4. **Interface de destaque** no PDF
5. **Sistema de feedback** da qualidade das respostas

---

**Desenvolvido com:** React + TypeScript + Node.js + Express + MySQL

**Sistema Colaborativo Implementado em:** Setembro 2025