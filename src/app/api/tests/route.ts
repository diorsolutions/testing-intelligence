import { NextRequest, NextResponse } from 'next/server';
import { sql, initDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    
    const { questions, correct_answers } = await request.json();
    
    console.log('Creating test with:', { questions, correct_answers });
    
    const result = await sql`
      INSERT INTO tests (questions, correct_answers)
      VALUES (${JSON.stringify(questions)}, ${JSON.stringify(correct_answers || {})})
      RETURNING id
    `;
    
    console.log('Test created with ID:', result[0].id);
    
    return NextResponse.json({ testId: result[0].id });
  } catch (error) {
    console.error('Xatolik:', error);
    return NextResponse.json({ error: 'Test yaratishda xatolik yuz berdi' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await initDatabase();
    
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('id');
    
    console.log('GET request with testId:', testId);
    
    if (testId) {
      const result = await sql`
        SELECT * FROM tests WHERE id = ${testId}
      `;
      
      console.log('Test query result:', result);
      
      if (result.length === 0) {
        return NextResponse.json({ error: 'Test topilmadi' }, { status: 404 });
      }
      
      return NextResponse.json({ test: result[0] });
    }
    
    const result = await sql`
      SELECT id, name, created_at FROM tests ORDER BY created_at DESC LIMIT 10
    `;
    
    return NextResponse.json({ tests: result });
  } catch (error) {
    console.error('Xatolik:', error);
    return NextResponse.json({ error: 'Testlarni olishda xatolik yuz berdi' }, { status: 500 });
  }
}
