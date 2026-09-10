const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedDatabase() {
  try {
    // Create a new project
    const projectId = uuidv4();
    await pool.query(
      `INSERT INTO projects (id, name, description, initial_capital, initial_flock_size, currency)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [projectId, 'مزرعتي الأولى', 'مشروع تربية أغنام صغير', 500000, 10, 'DZD']
    );

    // Create flock record
    await pool.query(
      `INSERT INTO flocks (project_id, current_count, total_purchases, total_births, total_sales, total_deaths)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [projectId, 10, 0, 0, 0, 0]
    );

    // Create feed types
    const feedTypes = [
      { name: 'الشعير', unit: 'كغ' },
      { name: 'التبن', unit: 'كغ' },
      { name: 'الدريس', unit: 'كغ' },
    ];

    for (const feed of feedTypes) {
      await pool.query(
        `INSERT INTO feed_types (project_id, name, unit, current_stock, unit_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [projectId, feed.name, feed.unit, 0, 0]
      );
    }

    console.log('✅ تم إضافة البيانات الأولية بنجاح');
    console.log(`📌 معرّف المشروع: ${projectId}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ في إضافة البيانات:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();
