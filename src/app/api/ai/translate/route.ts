import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = body.text || '';
    const target_lang = body.target_language || 'Hindi';

    const translations: Record<string, string> = {
      Hindi: `[हिंदी अनुवाद]: ${text} (सुरक्षित रहें और 112 डायल करें)`,
      Tamil: `[தமிழ் மொழிபெயர்ப்பு]: ${text} (பாதுகாப்பாக இருங்கள்)`,
      Bengali: `[বাংলা অনুবাদ]: ${text} (নিরাপদ থাকুন)`,
      Marathi: `[मराठी भाषांतर]: ${text} (सुरक्षित राहा)`
    };

    const translated_text = translations[target_lang] || `[${target_lang} Translation]: ${text}`;
    return NextResponse.json({ original: text, target_language: target_lang, translated: translated_text });
  } catch (e) {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
