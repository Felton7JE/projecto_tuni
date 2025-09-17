@echo off
echo 🚀 Configuração Automática do Projeto - Sistema Acadêmico
echo ========================================================

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado. Por favor, instale o Node.js primeiro.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version

REM Instalar dependências do frontend
echo 📦 Instalando dependências do frontend...
npm install

REM Instalar dependências do backend
echo 📦 Instalando dependências do backend...
cd backend
npm install

REM Verificar se arquivo .env existe
if not exist ".env" (
    echo ⚠️  Arquivo .env não encontrado!
    echo 📋 Copiando .env.example para .env...
    copy .env.example .env
    echo ✏️  Por favor, edite o arquivo backend\.env com suas configurações do MySQL
    echo    - DB_PASSWORD: sua senha do MySQL
    echo    - JWT_SECRET: uma string secreta para JWT
)

echo.
echo 🎯 Próximos passos:
echo 1. Configure o arquivo backend\.env com suas credenciais MySQL
echo 2. Certifique-se que o MySQL está rodando
echo 3. Execute: cd backend ^&^& node setup-completo.js
echo 4. Para iniciar o projeto:
echo    - Terminal 1: cd backend ^&^& node server.js
echo    - Terminal 2: npm run dev
echo.
echo 📚 Veja SETUP_COLABORADORES.md para instruções completas!
echo.
echo ✨ Sistema colaborativo de dúvidas implementado e pronto para uso!
echo.
pause