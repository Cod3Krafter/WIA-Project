// Establish connection to PostgreSQL database
import pkg from 'pg';
const { Pool } = pkg;

let pool;

export const connectDB = async () => {
  if (!pool) {
    try {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Render Postgres requires SSL
      });

      // Test connection
      await pool.query('SELECT NOW()');
      console.log('✅ Connected to PostgreSQL database');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }
  return pool;
};
