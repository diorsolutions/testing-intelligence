require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function testDatabase() {
  try {
    console.log('Database connection test...');
    console.log('DATABASE_URL:', DATABASE_URL);
    
    // Test query
    const result = await sql`SELECT NOW()`;
    console.log('✓ Database connection successful!');
    console.log('Server time:', result[0].now);
    
    // Test tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Tables:', tables);
    
    // Test tests table
    const tests = await sql`SELECT COUNT(*) as count FROM tests`;
    console.log('Tests count:', tests[0].count);
    
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    process.exit(1);
  }
}

testDatabase();
