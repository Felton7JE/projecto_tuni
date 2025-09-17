import mysql from 'mysql2/promise';

async function adicionarCampoTema() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'sistema_academico'
        });

        // Adicionar campo tema
        await connection.execute(`
            ALTER TABLE ficha 
            ADD COLUMN tema VARCHAR(255) AFTER titulo
        `);

        console.log('Campo tema adicionado com sucesso!');

        // Atualizar fichas existentes com temas
        const temas = [
            { id: 1, tema: 'Álgebra Linear' },
            { id: 2, tema: 'Mecânica Clássica' },
            { id: 3, tema: 'Estruturas de Dados' },
            { id: 4, tema: 'Cálculo Diferencial' },
            { id: 5, tema: 'Física Quântica' }
        ];

        for (const item of temas) {
            await connection.execute(
                'UPDATE ficha SET tema = ? WHERE id = ?',
                [item.tema, item.id]
            );
        }

        console.log('Temas adicionados às fichas existentes!');

        await connection.end();
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

adicionarCampoTema();