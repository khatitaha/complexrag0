import { NextRequest, NextResponse } from 'next/server';

// Based on the Gemini documentation, there isn't a dynamic API to fetch voices.
// So, we are using a hardcoded list of compatible voices.
const geminiVoices = [
    { name: 'echo', languageCodes: ['en-US'], ssmlGender: 'MALE', description: 'A deep, resonant male voice.' },
    { name: 'onyx', languageCodes: ['en-US'], ssmlGender: 'MALE', description: 'A deep, gravelly male voice.' },
    { name: 'nova', languageCodes: ['en-US'], ssmlGender: 'FEMALE', description: 'A clear, bright female voice.' },
    { name: 'shimmer', languageCodes: ['en-US'], ssmlGender: 'FEMALE', description: 'An airy, ethereal female voice.' },
    { name: 'alloy', languageCodes: ['en-US'], ssmlGender: 'MALE', description: 'A metallic, robotic male voice.' },
    { name: 'fable', languageCodes: ['en-US'], ssmlGender: 'MALE', description: 'A warm, narrative male voice.' },
];

export async function GET(req: NextRequest) {
  try {
    // The frontend expects a `naturalSampleRateHertz` property, so we add it here.
    const voicesForClient = geminiVoices.map(v => ({ ...v, naturalSampleRateHertz: 24000 }));
    return NextResponse.json(voicesForClient);
  } catch (error) {
    console.error('Failed to fetch voices:', error);
    return NextResponse.json({ error: 'Failed to fetch voices' }, { status: 500 });
  }
}
