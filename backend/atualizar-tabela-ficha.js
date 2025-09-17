import mysql from 'mysql2/promise';

async function atualizarTabelaFicha() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'sistema_academico'
        });

        console.log('Verificando estrutura atual da tabela ficha...');
        
        // Verificar colunas existentes
        const [columns] = await connection.execute('DESCRIBE ficha');
        console.log('Colunas atuais:', columns.map(col => col.Field));

        const existingColumns = columns.map(col => col.Field);

        // Adicionar colunas necessárias se não existirem
        if (!existingColumns.includes('arquivo_pdf')) {
            await connection.execute('ALTER TABLE ficha ADD COLUMN arquivo_pdf LONGBLOB AFTER conteudo');
            console.log('Coluna arquivo_pdf adicionada');
        }

        if (!existingColumns.includes('nome_arquivo')) {
            await connection.execute('ALTER TABLE ficha ADD COLUMN nome_arquivo VARCHAR(255) AFTER arquivo_pdf');
            console.log('Coluna nome_arquivo adicionada');
        }

        if (!existingColumns.includes('tipo_arquivo')) {
            await connection.execute('ALTER TABLE ficha ADD COLUMN tipo_arquivo VARCHAR(100) AFTER nome_arquivo');
            console.log('Coluna tipo_arquivo adicionada');
        }

        if (!existingColumns.includes('tamanho_arquivo')) {
            await connection.execute('ALTER TABLE ficha ADD COLUMN tamanho_arquivo INT AFTER tipo_arquivo');
            console.log('Coluna tamanho_arquivo adicionada');
        }

        console.log('Estrutura da tabela atualizada com sucesso!');

        await connection.end();
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

atualizarTabelaFicha();