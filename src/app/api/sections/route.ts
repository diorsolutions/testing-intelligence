import { NextRequest, NextResponse } from 'next/server';
import { sql, initDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    
    const { name } = await request.json();
    
    const result = await sql`
      INSERT INTO sections (name)
      VALUES (${name})
      RETURNING id
    `;
    
    return NextResponse.json({ sectionId: result[0].id });
  } catch (error) {
    console.error('Xatolik:', error);
    return NextResponse.json({ error: 'Bo\'lim yaratishda xatolik yuz berdi' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await initDatabase();
    
    const result = await sql`
      SELECT * FROM sections ORDER BY created_at DESC
    `;
    
    return NextResponse.json({ sections: result });
  } catch (error) {
    console.error('Xatolik:', error);
    return NextResponse.json({ error: 'Bo\'limlarni olishda xatolik yuz berdi' }, { status: 500 });
  }
}
