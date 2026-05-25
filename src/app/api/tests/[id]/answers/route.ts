import { NextRequest, NextResponse } from 'next/server';
import { sql, initDatabase } from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initDatabase();
    
    const { answers } = await request.json();
    const { id } = await params;
    const testId = parseInt(id);
    
    // Mavjud javoblarni tekshirish
    const existing = await sql`
      SELECT id FROM answers WHERE test_id = ${testId}
    `;
    
    if (existing.length > 0) {
      // Mavjud javoblarni yangilash
      await sql`
        UPDATE answers 
        SET answers = ${JSON.stringify(answers)}, updated_at = CURRENT_TIMESTAMP
        WHERE test_id = ${testId}
      `;
    } else {
      // Yangi javob qo'shish
      await sql`
        INSERT INTO answers (test_id, answers)
        VALUES (${testId}, ${JSON.stringify(answers)})
      `;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Xatolik:', error);
    return NextResponse.json({ error: 'Javoblarni saqlashda xatolik yuz berdi' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initDatabase();
    
    const { id } = await params;
    const testId = parseInt(id);
    
    const result = await sql`
      SELECT answers FROM answers WHERE test_id = ${testId}
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ answers: {} });
    }
    
    return NextResponse.json({ answers: result[0].answers });
  } catch (error) {
    console.error('Xatolik:', error);
    return NextResponse.json({ error: 'Javoblarni olishda xatolik yuz berdi' }, { status: 500 });
  }
}
