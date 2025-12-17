import { personalisedTravelItinerary } from '@/ai/flows/personalized-itinerary-generation';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ItineraryRequestSchema = z.object({
  interests: z.string().min(1),
  duration: z.coerce.number().min(1),
  locations: z.string().min(1),
  travelStyle: z.string().optional(),
  budget: z.string().optional(),
  accommodationType: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();



    const parsed = ItineraryRequestSchema.safeParse(requestData);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid input.',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    console.log('[Itinerary API] Generating itinerary for:', {
      place: parsed.data.locations,
      days: parsed.data.duration
    });

    const result = await personalisedTravelItinerary({
      place: parsed.data.locations,
      days: parsed.data.duration
    });

    console.log('[Itinerary API] Result received:', result ? 'Success' : 'Null');

    if (result && result.itinerary) {
      return NextResponse.json({ itinerary: result.itinerary });
    } else {
      console.error('[Itinerary API] No itinerary in result:', result);
      return NextResponse.json(
        { error: 'Failed to generate itinerary.' },
        { status: 500 }
      );
    }
  } catch (e: any) {
    console.error('[Itinerary API] CRITICAL ERROR:', e);
    console.error('[Itinerary API] Error Details:', JSON.stringify(e, Object.getOwnPropertyNames(e), 2));

    return NextResponse.json(
      {
        error: 'An internal server error occurred.',
        details: e.message,
        stack: e.stack
      },
      { status: 500 }
    );
  }
}
