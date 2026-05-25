import { NextRequest, NextResponse } from 'next/server';
import { sql, initDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    
    // Barcha guruhlarni olish
    const groups = await sql`
      SELECT id, questions FROM groups
    `;
    
    let updatedCount = 0;
    
    // Har bir guruh uchun correct_answers ni yangilash
    for (const group of groups) {
      const questions = JSON.parse(group.questions);
      const correctAnswers: Record<number, string> = {};
      
      // Har bir savol uchun to'g'ri javobni 'A' qilib belgilash
      questions.forEach((_: any, index: number) => {
        correctAnswers[index] = 'A';
      });
      
      // Ma'lumotlar bazasini yangilash
      await sql`
        UPDATE groups 
        SET correct_answers = ${JSON.stringify(correctAnswers)}
        WHERE id = ${group.id}
      `;
      
      updatedCount++;
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `${updatedCount} ta guruh yangilandi. Barcha javoblar 'A' ga belgilandi.` 
    });
  } catch (error) {
    console.error('Xatolik:', error);
    return NextResponse.json({ error: 'Ma\'lumotlarni yangilashda xatolik yuz berdi' }, { status: 500 });
  }
}
