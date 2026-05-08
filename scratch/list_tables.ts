
import mysql from 'mysql2/promise';

async function listTables() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'uttecam'
        });

        console.log('Connection established.');

        const [rows]: any = await connection.execute('SHOW TABLES');
        console.log('Tables:');
        rows.forEach((row: any) => {
            console.log(`- ${Object.values(row)[0]}`);
        });

        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

listTables();
