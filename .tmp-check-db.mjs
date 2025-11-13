import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.SUPABASE_DB_URL });
const categories = await pool.query('SELECT * FROM public.categories ORDER BY id');
console.log('categories', categories.rows);
const items = await pool.query('SELECT * FROM public.menu_items ORDER BY id');
console.log('items', items.rows.length);
await pool.end();
