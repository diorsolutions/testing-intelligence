require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function fixCorrectAnswers() {
  try {
    console.log('Barcha guruhlarni yangilash...');
    
    // Barcha guruhlarni olish
    const groups = await sql`
      SELECT id, questions FROM groups
    `;
    
    console.log(`${groups.length} ta guruh topildi.`);
    
    let updatedCount = 0;
    
    // Har bir guruh uchun correct_answers ni yangilash
    for (const group of groups) {
      const questions = typeof group.questions === 'string' ? JSON.parse(group.questions) : group.questions;
      const correctAnswers = {};
      
      // Har bir savol uchun to'g'ri javobni 'A' qilib belgilash
      questions.forEach((_, index) => {
        correctAnswers[index] = 'A';
      });
      
      // Ma'lumotlar bazasini yangilash
      await sql`
        UPDATE groups 
        SET correct_answers = ${JSON.stringify(correctAnswers)}
        WHERE id = ${group.id}
      `;
      
      updatedCount++;
      console.log(`Guruh #${group.id} yangilandi (${questions.length} ta savol)`);
    }
    
    console.log(`\n✓ ${updatedCount} ta guruh muvaffaqiyatli yangilandi.`);
    console.log('Barcha to\'g\'ri javoblar \'A\' ga belgilandi.');
    
  } catch (error) {
    console.error('✗ Xatolik:', error);
    process.exit(1);
  }
}

fixCorrectAnswers();
