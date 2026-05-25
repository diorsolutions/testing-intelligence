import { NextRequest, NextResponse } from 'next/server';
import { sql, initDatabase } from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initDatabase();
    
    const { answers } = await request.json();
    const { id: groupId } = await params;
    
    await sql`
      INSERT INTO answers (group_id, answers)
      VALUES (${groupId}, ${JSON.stringify(answers)})
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Xatolik:', error);
    return NextResponse.json({ error: 'Javoblarni saqlashda xatolik yuz berdi' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initDatabase();
    
    const { id: groupId } = await params;
    
    const result = await sql`
      SELECT answers FROM answers WHERE group_id = ${groupId} ORDER BY created_at DESC LIMIT 1
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
