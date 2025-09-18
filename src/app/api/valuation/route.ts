import { NextRequest, NextResponse } from 'next/server';
import { generateValuationReport } from '@/lib/gemini';
import { HotelData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const hotelData: HotelData = await request.json();
    
    // Validate required fields
    if (!hotelData.establishmentType || !hotelData.rooms || !hotelData.municipality) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const report = await generateValuationReport(hotelData);
    
    return NextResponse.json(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    // Provide actionable hint if API key is missing
    const isMissingKey = message.includes('GEMINI_API_KEY is not set');
    console.error('Valuation API error:', message);
    return NextResponse.json(
      {
        error: 'Failed to generate valuation report',
        detail: message,
        hint: isMissingKey
          ? 'Configura GEMINI_API_KEY en .env.local y reinicia el servidor.'
          : undefined,
      },
      { status: 500 }
    );
  }
}