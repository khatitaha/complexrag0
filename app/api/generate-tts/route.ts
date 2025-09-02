import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenAI } from '@google/genai';                                                                                                                           

// Initialize Google Generative AI client
// Make sure to set the GEMINI_API_KEY environment variable
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Function to create a WAV file buffer from raw PCM data
function createWavBuffer(pcmData: Buffer, sampleRate: number = 24000): Buffer {
  const numChannels = 1;
  const bitDepth = 16;
  const byteRate = sampleRate * numChannels * (bitDepth / 8);
  const blockAlign = numChannels * (bitDepth / 8);
  const dataSize = pcmData.length;
  const chunkSize = 36 + dataSize;
  const fileSize = 4 + chunkSize;

  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(fileSize, 4);
  buffer.write('WAVE', 8);

  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Sub-chunk size
  buffer.writeUInt16LE(1, 20); // Audio format (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitDepth, 34);

  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // PCM data
  pcmData.copy(buffer, 44);

  return buffer;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let { slides, lessonId } = await req.json();

    if (!slides || !lessonId) {
      return NextResponse.json({ error: 'Missing slides or lessonId' }, { status: 400 });
    }

    // Verify that the user owns the lesson
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id')
      .eq('id', lessonId)
      .eq('user_id', user.id)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json(
        { error: 'Lesson not found or you do not have permission to access it.' },
        { status: 404 }
      );
    }

    const newSlides = await Promise.all(
      slides.map(async (slide: any, index: number) => {
        const textForTTS = slide.mainText.replace(/<highlight>|<\/highlight>/g, '');
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: textForTTS }] }],
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Alnilam' },
                    },
                },
            },
        });

        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioData) {
            throw new Error('Failed to generate audio data from Gemini');
        }
        const audioBuffer = Buffer.from(audioData, 'base64');

        // Convert raw PCM data to a WAV file buffer
        const wavBuffer = createWavBuffer(audioBuffer);

        // Upload audio to Supabase Storage
        const filePath = `${lessonId}/slide-${index}.wav`;
        const { error: uploadError } = await supabase.storage
          .from('narrations')
          .upload(filePath, wavBuffer, {
            contentType: 'audio/wav',
            upsert: true,
          });

        if (uploadError) {
          console.error('Upload Error:', uploadError);
          throw new Error(`Failed to upload audio for slide ${index}`);
        }

        // Get public URL for the uploaded file
        const {
          data: { publicUrl },
        } = supabase.storage.from('narrations').getPublicUrl(filePath);

        return {
          ...slide,
          narrationUrl: publicUrl,
        };
      })
    );

    // --- Update Lesson in Database ---
    const { error: dbError } = await supabase
      .from('lessons')
      .update({ slides: newSlides })
      .eq('id', lessonId);

    if (dbError) {
      console.error('DB Error:', dbError);
      throw new Error('Failed to update lesson with new slides');
    }

    return NextResponse.json(newSlides, { status: 200 });
  } catch (error) {
    console.error('TTS Generation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

