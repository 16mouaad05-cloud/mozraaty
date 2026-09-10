const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeDatabase() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    
    const statements = schema
      .split(';')
      .filter((stmt) => stmt.trim())
      .map((stmt) => stmt.trim() + ';');

    for (const statement of statements) {
      await pool.query(statement);
    }

    console.log('✅ قاعدة البيانات تم تهيئتها بنجاح');
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ في تهيئة قاعدة البيانات:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
