#!/usr/bin/env node

/**
 * Script para verificar se todas as variáveis de ambiente necessárias estão configuradas
 * Execute antes do deploy: node scripts/check-env.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente do arquivo .env
dotenv.config({ path: resolve(__dirname, '..', '.env') });

const requiredEnvVars = {
  server: [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_DB_URL',
    'ADMIN_EMAIL',
  ],
  client: [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_APP_TITLE',
  ],
};

let hasErrors = false;

console.log('🔍 Verificando variáveis de ambiente...\n');

console.log('📦 Variáveis do Servidor:');
requiredEnvVars.server.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`  ❌ ${varName} - NÃO CONFIGURADA`);
    hasErrors = true;
  } else {
    const displayValue = varName.includes('KEY') || varName.includes('URL') 
      ? `${value.substring(0, 20)}...` 
      : value;
    console.log(`  ✅ ${varName} - ${displayValue}`);
  }
});

console.log('\n🎨 Variáveis do Cliente (Vite):');
requiredEnvVars.client.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`  ❌ ${varName} - NÃO CONFIGURADA`);
    hasErrors = true;
  } else {
    const displayValue = varName.includes('KEY') || varName.includes('URL') 
      ? `${value.substring(0, 20)}...` 
      : value;
    console.log(`  ✅ ${varName} - ${displayValue}`);
  }
});

console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.log('\n❌ ERRO: Algumas variáveis de ambiente não estão configuradas!');
  console.log('\n📝 Para corrigir:');
  console.log('  1. Copie o arquivo .env.example para .env');
  console.log('  2. Preencha todas as variáveis com seus valores do Supabase');
  console.log('  3. Execute este script novamente\n');
  process.exit(1);
} else {
  console.log('\n✅ Todas as variáveis de ambiente estão configuradas!');
  console.log('🚀 Pronto para deploy!\n');
  process.exit(0);
}
