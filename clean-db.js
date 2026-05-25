require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function cleanDatabase() {
  try {
    console.log('Cleaning database...');
    
    // Eski jadvallarni o'chirish
    await sql`DROP TABLE IF EXISTS answers CASCADE`;
    await sql`DROP TABLE IF EXISTS tests CASCADE`;
    
    console.log('✓ Old tables dropped');
    
    // Yangi jadvallarni yaratish
    await sql`
      CREATE TABLE IF NOT EXISTS sections (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        questions JSONB NOT NULL,
        correct_answers JSONB NOT NULL DEFAULT '{}',
        group_index INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS answers (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        answers JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✓ New tables created');
    
    // Tekshirish
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Tables:', tables);
    
  } catch (error) {
    console.error('✗ Error:', error);
    process.exit(1);
  }
}

cleanDatabase();
