import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.SUPABASE_DB_URL });

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com o banco...');
    console.log('Connection string:', process.env.SUPABASE_DB_URL?.substring(0, 30) + '...');
    
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Conexão bem-sucedida!');
    console.log('Timestamp do servidor:', result.rows[0].now);
    
    const categories = await pool.query('SELECT * FROM categories LIMIT 3');
    console.log('\n📦 Categorias encontradas:', categories.rows.length);
    console.log(categories.rows);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    console.error('Detalhes:', error);
    process.exit(1);
  }
}

testConnection();
