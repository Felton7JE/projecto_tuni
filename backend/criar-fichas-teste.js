import mysql from 'mysql2/promise';

async function criarFichasParaDisciplinas() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'sistema_academico'
        });

        // Primeiro, vamos ver as disciplinas existentes
        const [disciplinas] = await connection.execute('SELECT * FROM disciplina');
        console.log('Disciplinas existentes:', disciplinas);

        // Criar fichas para as disciplinas existentes
        const fichas = [
            {
                titulo: 'Introdução à POO',
                tema: 'Conceitos Básicos',
                disciplina: 'POO', // Nome da primeira disciplina
                conteudo: 'Conceitos fundamentais de programação orientada a objetos...'
            },
            {
                titulo: 'Classes e Objetos',
                tema: 'Estruturas POO',
                disciplina: 'POO',
                conteudo: 'Como criar e utilizar classes e objetos em POO...'
            },
            {
                titulo: 'Herança e Polimorfismo',
                tema: 'Conceitos Avançados',
                disciplina: 'POO2', // Nome da segunda disciplina
                conteudo: 'Implementação de herança e polimorfismo...'
            }
        ];

        for (const ficha of fichas) {
            await connection.execute(
                'INSERT INTO ficha (titulo, tema, disciplina, conteudo) VALUES (?, ?, ?, ?)',
                [ficha.titulo, ficha.tema, ficha.disciplina, ficha.conteudo]
            );
            console.log(`Ficha "${ficha.titulo}" criada para disciplina "${ficha.disciplina}"`);
        }

        console.log('Fichas criadas com sucesso!');
        await connection.end();
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

criarFichasParaDisciplinas();