# 🎓 Sistema Integrado de Gestão Acadêmica

Um sistema colaborativo para gestão de disciplinas, fichas de estudo e dúvidas entre alunos e docentes.

## ✨ Funcionalidades Principais

### 🔐 Sistema de Autenticação
- Login diferenciado para **Alunos** e **Docentes**
- JWT Authentication com middleware de proteção
- Dashboards personalizados por tipo de usuário

### 📚 Gestão de Disciplinas e Fichas
- **Docentes**: Criação e gerenciamento de disciplinas e fichas em PDF
- **Alunos**: Matrícula em disciplinas e acesso às fichas
- Upload e organização de conteúdo por tema

### 💬 Sistema Colaborativo de Dúvidas **[DESTAQUE]**
- **Dúvidas específicas por ficha** (mais práticas que por disciplina)
- **Colaboração entre alunos**: Todos da disciplina podem ver e responder
- **Identificação visual**: Badges para docente/aluno/IA
- **Sistema preparado para IA**: Estrutura para análise de PDFs

### 🤖 Preparado para IA (Em Desenvolvimento)
- Campos para referências precisas do PDF
- Sistema de confiança das respostas
- Interface para destaque de trechos relevantes

## 🚀 Para Colaboradores

### Setup Rápido:
```bash
# Windows
setup.bat

# Linux/Mac
chmod +x setup.sh
./setup.sh
```

### Setup Manual:
📋 **Veja [SETUP_COLABORADORES.md](SETUP_COLABORADORES.md) para instruções detalhadas**

## 🛠️ Stack Tecnológica

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Banco**: MySQL
- **Auth**: JWT
- **UI**: CSS Moderno com Gradientes

## 📱 Interface

### Dashboard Aluno
- Cards de disciplinas matriculadas
- Acesso direto às fichas
- Sistema de dúvidas colaborativo

### Dashboard Docente  
- Gestão de disciplinas
- Upload de fichas em PDF
- Acompanhamento de dúvidas

### Sistema de Dúvidas Colaborativo
- Interface moderna e intuitiva
- Respostas em tempo real
- Badges de identificação
- Preparado para IA

## 🎯 Diferenciais

### ✅ Implementado:
- **Sistema colaborativo**: Alunos ajudam alunos
- **Dúvidas por ficha**: Mais específicas e práticas  
- **Visual moderno**: Gradientes e animações
- **Responsivo**: Funciona em mobile e desktop

### 🔄 Em Desenvolvimento:
- **IA Assistant**: Análise automática de PDFs
- **Referências precisas**: Destaque de trechos relevantes
- **Sistema de feedback**: Qualidade das respostas

## 📊 Arquitetura do Banco

```sql
-- Principais tabelas
usuario (id, nome, email, tipo, senha)
disciplina (id, nome, id_docente, codigo)
matricula (usuario_id, disciplina_id)
ficha (id, titulo, tema, arquivo, disciplina_id)
duvida (id, pergunta, resposta, id_ficha, id_usuario, 
        tipo_resposta, resposta_ia_referencia, ...)
```

## 🌟 Roadmap

### Próximas Funcionalidades:
1. **Sistema de IA completo**
   - Integração com OpenAI/Claude
   - Parser de PDF avançado
   - Busca semântica

2. **Melhorias na Colaboração**
   - Sistema de pontuação
   - Gamificação
   - Notificações em tempo real

3. **Analytics**
   - Dashboard de métricas
   - Relatórios de engajamento
   - Identificação de dúvidas frequentes

## 👥 Como Contribuir

1. Clone o repositório
2. Execute `setup.bat` (Windows) ou `setup.sh` (Linux/Mac)
3. Configure o `.env` com suas credenciais MySQL
4. Execute os scripts de setup do banco
5. Inicie frontend e backend
6. Veja o sistema colaborativo em ação! 🎉

---

**Desenvolvido com foco na colaboração entre estudantes** 🤝

**Sistema moderno preparado para o futuro da educação** 🚀

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
