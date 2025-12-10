'use client';

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

type MapViewProps = {
  position: {
    lat: number;
    lng: number;
  };
};

export function MapView({ position }: MapViewProps) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
        <p>Google Maps API key is missing.</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultCenter={position}
        defaultZoom={15}
        mapId="kerala-navigator-map"
      >
        <AdvancedMarker position={position} />
      </Map>
    </APIProvider>
  );
}
