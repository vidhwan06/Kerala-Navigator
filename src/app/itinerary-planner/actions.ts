'use server';

import { personalisedTravelItinerary } from '@/ai/flows/personalized-itinerary-generation';
import { z } from 'zod';

import { initializeApp, getApps, type App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Helper function to initialize Firebase Admin SDK
function initializeAdminApp(): App {
  const apps = getApps();
  if (apps.length) {
    return apps[0] as App;
  }
  // This will use the GOOGLE_APPLICATION_CREDENTIALS env var
  // which is automatically set in the App Hosting environment
  return initializeApp();
}

const formSchema = z.object({
  interests: z.string().min(3),
  duration: z.coerce.number().min(1),
  locations: z.string().min(3),
  travelStyle: z.string().optional(),
  budget: z.string().optional(),
  accommodationType: z.string().optional(),
});

type ItineraryResult = {
  success: boolean;
  itinerary?: string | null;
  error?: string | null;
};

export async function createItinerary(
  values: unknown
): Promise<ItineraryResult> {
  const parsed = formSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid input. Please check your entries and try again.',
    };
  }

  try {
    const result = await personalisedTravelItinerary({
      place: parsed.data.locations,
      days: parsed.data.duration
    });
    return {
      success: true,
      itinerary: result.itinerary,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error:
        'Failed to generate itinerary. The AI model may be temporarily unavailable.',
    };
  }
}

const ItineraryDataSchema = z.object({
  name: z.string(),
  content: z.string(),
});
type ItineraryData = z.infer<typeof ItineraryDataSchema>;

export async function saveItinerary(userId: string, data: ItineraryData) {
  try {
    const adminApp = initializeAdminApp();
    const firestore = getFirestore(adminApp);
    const itinerariesCollection = firestore.collection(
      `users/${userId}/itineraries`
    );

    await itinerariesCollection.add({
      ...data,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving itinerary to Firestore:', error);
    // In a real app, you'd want to handle this error more gracefully
  }
}
