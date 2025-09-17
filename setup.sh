#!/bin/bash

echo "🚀 Configuraçãoecho "1. Configure o arquivo backend/.env com suas configurações MySQL"
echo "2. Certifique-se que o MySQL está rodando"
echo "3. Execute: cd backend && node setup-completo.js"
echo "4. Para iniciar o projeto:"ática do Projeto - Sistema Acadêmico"
echo "========================================================"

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js primeiro."
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
npm install

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install

# Verificar se arquivo .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📋 Copiando .env.example para .env..."
    cp .env.example .env
    echo "✏️  Por favor, edite o arquivo backend/.env com suas configurações do MySQL"
    echo "   - DB_PASSWORD: sua senha do MySQL"
    echo "   - JWT_SECRET: uma string secreta para JWT"
fi

echo ""
echo "🎯 Próximos passos:"
echo "1. Configure o arquivo backend/.env com suas credenciais MySQL"
echo "2. Certifique-se que o MySQL está rodando"
echo "3. Execute: cd backend && node setup-db.js"
echo "4. Execute: node update-duvidas-fichas.js"
echo "5. Execute: node update-duvidas-collaborative.js"
echo "6. Para iniciar o projeto:"
echo "   - Terminal 1: cd backend && node server.js"
echo "   - Terminal 2: npm run dev"
echo ""
echo "📚 Veja SETUP_COLABORADORES.md para instruções completas!"
echo ""
echo "✨ Sistema colaborativo de dúvidas implementado e pronto para uso!"