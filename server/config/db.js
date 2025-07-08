// Establish connection to database
import sqlite3 from 'sqlite3'

export const connectDB = async () => {
    try {
        const db = await new Promise((resolve, reject) => {
            const database = new sqlite3.Database('./wia.db', (err) => {
                if (err) {
                    reject(err);
                } else {
                    // console.log('Connected to SQLite database');
                    resolve(database);
                }
            });
        });
        return db;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
}