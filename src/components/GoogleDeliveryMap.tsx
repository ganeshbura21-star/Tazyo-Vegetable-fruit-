import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Navigation, Store, Home, ExternalLink } from 'lucide-react';
import { TAZYO_STORE_LOCATION } from '../data/mockCoupons';

interface GoogleDeliveryMapProps {
  destinationLat?: number;
  destinationLng?: number;
  destinationLabel?: string;
  driverLat?: number;
  driverLng?: number;
  driverName?: string;
  height?: string;
}

export const GoogleDeliveryMap: React.FC<GoogleDeliveryMapProps> = ({
  destinationLat = 19.0178,
  destinationLng = 72.8397,
  destinationLabel = 'Customer Delivery Address',
  driverLat,
  driverLng,
  driverName = 'Delivery Rider',
  height = '320px',
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCNG3VKSYBvDGD-sgW44vcZKANjNyk8QI0';
  const [mapError, setMapError] = useState(false);

  // Center midway between store and destination
  const centerLat = (TAZYO_STORE_LOCATION.lat + destinationLat) / 2;
  const centerLng = (TAZYO_STORE_LOCATION.lng + destinationLng) / 2;

  // Live driver position (default midway for realism if driverLat not passed)
  const riderPosition = {
    lat: driverLat ?? TAZYO_STORE_LOCATION.lat * 0.4 + destinationLat * 0.6,
    lng: driverLng ?? TAZYO_STORE_LOCATION.lng * 0.4 + destinationLng * 0.6,
  };

  // Google Maps Turn-by-Turn Navigation URL
  const navigationUrl = `https://www.google.com/maps/dir/?api=1&origin=${riderPosition.lat},${riderPosition.lat}&destination=${destinationLat},${destinationLng}&travelmode=driving`;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-emerald-100 shadow-sm bg-stone-100 flex flex-col" style={{ height }}>
      {/* Top Map Navigation Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-stone-200/80 shadow-md text-xs">
        <div className="flex items-center gap-2 font-medium text-stone-800 truncate">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="truncate">Live Route to {destinationLabel}</span>
        </div>
        <a
          href={navigationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-lg shadow-sm transition-colors shrink-0"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Google Maps</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      </div>

      {/* Main Map Container */}
      <div className="w-full flex-1 min-h-[220px]">
        {apiKey && !mapError ? (
          <APIProvider apiKey={apiKey}>
            <Map
              style={{ width: '100%', height: '100%' }}
              defaultCenter={{ lat: centerLat, lng: centerLng }}
              defaultZoom={14}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              disableDefaultUI={false}
              zoomControl={true}
            >
              {/* Hub Marker */}
              <AdvancedMarker position={{ lat: TAZYO_STORE_LOCATION.lat, lng: TAZYO_STORE_LOCATION.lng }}>
                <div className="flex flex-col items-center">
                  <div className="bg-emerald-700 text-white p-2 rounded-full shadow-lg border-2 border-white ring-2 ring-emerald-500">
                    <Store className="w-4 h-4" />
                  </div>
                  <span className="bg-stone-900/90 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                    TAZYO Hub
                  </span>
                </div>
              </AdvancedMarker>

              {/* Rider Marker */}
              <AdvancedMarker position={riderPosition}>
                <div className="flex flex-col items-center animate-bounce">
                  <div className="bg-orange-500 text-white p-2 rounded-full shadow-lg border-2 border-white ring-2 ring-orange-400">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <span className="bg-orange-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                    {driverName}
                  </span>
                </div>
              </AdvancedMarker>

              {/* Customer Destination Marker */}
              <AdvancedMarker position={{ lat: destinationLat, lng: destinationLng }}>
                <div className="flex flex-col items-center">
                  <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-white ring-2 ring-blue-400">
                    <Home className="w-4 h-4" />
                  </div>
                  <span className="bg-stone-900/90 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                    Your Doorstep
                  </span>
                </div>
              </AdvancedMarker>
            </Map>
          </APIProvider>
        ) : (
          /* Fallback visual map if offline or quota reached */
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
              <Navigation className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-stone-800">Live Delivery Route Active</p>
            <p className="text-xs text-stone-500 max-w-xs mt-1">
              TAZYO Hub (Dadar West) → {destinationLabel} (~3.2 km, 15-20 mins)
            </p>
            <a
              href={navigationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5" />
              Open Live Route in Google Maps App
            </a>
          </div>
        )}
      </div>

      {/* Bottom stats banner */}
      <div className="bg-stone-900/90 text-white px-3 py-2 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Fast Electric Delivery</span>
        </div>
        <span className="text-emerald-300 font-medium">Estimated Arrival: 15-20 Mins</span>
      </div>
    </div>
  );
};
