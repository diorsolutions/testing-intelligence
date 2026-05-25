import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Fayl yuklanmadi' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ buffer: Buffer.from(buffer) });
    
    const html = result.value;
    const questions = parseQuestionsFromHtml(html);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Xatolik:', error);
    return NextResponse.json({ error: 'Faylni parse qilishda xatolik yuz berdi' }, { status: 500 });
  }
}

function parseQuestionsFromHtml(html: string) {
  const questions: any[] = [];
  
  // HTML dan jadvallarni olish
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  const tableMatches = html.match(tableRegex);

  if (!tableMatches) {
    return questions;
  }

  tableMatches.forEach(tableHtml => {
    // Qatorlarni olish
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const rows = tableHtml.match(rowRegex);

    if (!rows) return;

    rows.forEach((row, index) => {
      if (index === 0) return; // Header qatorini o'tkazib yuboramiz

      // Kataklarni olish
      const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
      const cells = row.match(cellRegex);

      if (!cells || cells.length < 5) return;

      // HTML teglarini tozalash
      const cleanText = (text: string) => text.replace(/<[^>]*>/g, '').trim();

      const question = {
        number: cleanText(cells[0]),
        text: cleanText(cells[1]),
        options: {
          A: cleanText(cells[2]),
          B: cleanText(cells[3]),
          C: cleanText(cells[4]),
          D: cells[5] ? cleanText(cells[5]) : ''
        },
        correctAnswer: 'A'
      };

      if (question.text) {
        questions.push(question);
      }
    });
  });

  return questions;
}
