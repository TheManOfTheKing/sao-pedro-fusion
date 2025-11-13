#!/usr/bin/env node

/**
 * Script para RESETAR a tabela 'users' no Railway com o schema correto.
 * Uso: node migrate.js
 */

import mysql from 'mysql2/promise';

// URL pública do Railway
const DATABASE_URL = process.env.RAILWAY_DATABASE_URL || 'mysql://root:UQJIuvreeAmZnSFUJODxhgEPeeDiLKIW@switchback.proxy.rlwy.net:31151/railway';

if (!DATABASE_URL.startsWith('mysql://')) {
  console.error('❌ ERRO: A RAILWAY_DATABASE_URL parece estar faltando ou incorreta.');
  process.exit(1);
}

console.log('🚀 Conectando ao Railway MySQL para recriar a tabela `users`...\n');

async function resetUsersTable() {
  let connection;
  
  try {
    connection = await mysql.createConnection(DATABASE_URL);
    console.log('✅ Conectado ao banco de dados!');

    // SQL para apagar e recriar a tabela 'users'
    const resetSql = `
      -- 1. Apaga a tabela antiga, se existir
      DROP TABLE IF EXISTS users;
        
      -- 2. Cria a tabela 'users' com o schema final e correto
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        openId VARCHAR(64) NOT NULL UNIQUE,
        name TEXT,
        email VARCHAR(320) NOT NULL,
        passwordHash VARCHAR(255) NOT NULL,
        loginMethod VARCHAR(64) NOT NULL DEFAULT 'local',
        role ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        
        -- Adiciona o índice único no email
        UNIQUE INDEX idx_users_email (email)
      );
    `;

    // Executar comandos (um por vez)
    const statements = resetSql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`\n⏳ Executando: ${statement.trim().substring(0, 80)}...`);
        await connection.query(statement);
      }
    }
    
    console.log('\n\n✅ Tabela `users` recriada com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao recriar tabela `users`:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexão fechada.');
    }
  }
}

resetUsersTable();