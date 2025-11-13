import dotenv from 'dotenv';
dotenv.config();

import * as db from './server/db.ts';

async function testQueries() {
  try {
    console.log('🔍 Testando queries do banco...\n');
    
    // Test 1: Get all categories
    console.log('1️⃣ Testando getAllCategories()...');
    const categories = await db.getAllCategories();
    console.log(`   ✅ ${categories.length} categorias encontradas`);
    if (categories.length > 0) {
      console.log(`   📦 Primeira categoria: ${categories[0].namePt}`);
    }
    
    // Test 2: Get all menu items
    console.log('\n2️⃣ Testando getAllMenuItems()...');
    const items = await db.getAllMenuItems();
    console.log(`   ✅ ${items.length} itens encontrados`);
    if (items.length > 0) {
      console.log(`   🍽️ Primeiro item: ${items[0].namePt} - €${(items[0].price / 100).toFixed(2)}`);
    }
    
    // Test 3: Get translations
    if (categories.length > 0) {
      console.log('\n3️⃣ Testando getTranslations()...');
      const translations = await db.getTranslations('category', categories[0].id, 'en');
      console.log(`   ✅ ${translations.length} traduções encontradas para categoria ${categories[0].id}`);
      if (translations.length > 0) {
        console.log(`   🌐 Tradução EN: ${translations[0].translatedText}`);
      }
    }
    
    console.log('\n✅ Todos os testes passaram!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro nos testes:', error.message);
    console.error('Detalhes:', error);
    process.exit(1);
  }
}

testQueries();
