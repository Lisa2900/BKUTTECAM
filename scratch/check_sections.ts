
import mysql from 'mysql2/promise';

async function checkAllSections() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'uttecam'
        });

        console.log('Connection established.');

        const [rows]: any = await connection.execute('SELECT id, type, module, active, title FROM beca_sections');
        console.log(`Found ${rows.length} sections in total.`);
        
        rows.forEach((row: any) => {
            console.log(`- ID: ${row.id}, Type: ${row.type}, Module: ${row.module}, Active: ${row.active}, Title: ${row.title}`);
        });

        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkAllSections();
