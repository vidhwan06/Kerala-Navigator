'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

type LeafletMapProps = {
    position: [number, number];
    zoom?: number;
    markers?: Array<{
        position: [number, number];
        title: string;
        description?: string;
    }>;
};

export default function LeafletMap({ position, zoom = 13, markers = [] }: LeafletMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center text-muted-foreground">
                Loading Map...
            </div>
        );
    }

    return (
        <MapContainer
            center={position}
            zoom={zoom}
            scrollWheelZoom={false}
            className="h-full w-full rounded-xl z-0"
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Main Position Marker */}
            <Marker position={position} icon={icon}>
                <Popup>
                    You are here
                </Popup>
            </Marker>

            {/* Additional Markers */}
            {markers.map((marker, idx) => (
                <Marker key={idx} position={marker.position} icon={icon}>
                    <Popup>
                        <strong>{marker.title}</strong>
                        {marker.description && <p className="m-0 text-sm">{marker.description}</p>}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
