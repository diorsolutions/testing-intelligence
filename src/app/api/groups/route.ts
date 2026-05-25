import { NextRequest, NextResponse } from 'next/server';
import { sql, initDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    
    const { section_id, name, questions, correct_answers, group_index } = await request.json();
    
    const result = await sql`
      INSERT INTO groups (section_id, name, questions, correct_answers, group_index)
      VALUES (${section_id}, ${name}, ${JSON.stringify(questions)}, ${JSON.stringify(correct_answers || {})}, ${group_index})
      RETURNING id
    `;
    
    return NextResponse.json({ groupId: result[0].id });
  } catch (error) {
    console.error('Xatolik:', error);
    return NextResponse.json({ error: 'Guruh yaratishda xatolik yuz berdi' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await initDatabase();
    
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('section_id');
    
    if (sectionId) {
      const result = await sql`
        SELECT * FROM groups WHERE section_id = ${sectionId} ORDER BY group_index ASC
      `;
      return NextResponse.json({ groups: result });
    }
    
    const result = await sql`
      SELECT * FROM groups ORDER BY created_at DESC
    `;
    
    return NextResponse.json({ groups: result });
  } catch (error) {
    console.error('Xatolik:', error);
    return NextResponse.json({ error: 'Guruhlarni olishda xatolik yuz berdi' }, { status: 500 });
  }
}
