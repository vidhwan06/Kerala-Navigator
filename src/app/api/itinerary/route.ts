'use server';

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

    const result = await personalisedTravelItinerary({
      place: parsed.data.locations,
      days: parsed.data.duration
    });

    if (result.itinerary) {
      return NextResponse.json({ itinerary: result.itinerary });
    } else {
      return NextResponse.json(
        { error: 'Failed to generate itinerary.' },
        { status: 500 }
      );
    }
  } catch (e: any) {
    console.error('API Error:', e);
    return NextResponse.json(
      { error: 'An internal server error occurred.', details: e.message },
      { status: 500 }
    );
  }
}
