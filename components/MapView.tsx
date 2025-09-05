import React, { useEffect, useRef } from 'react';
// @ts-ignore
const L = window.L;

interface MapViewProps {
  planData: any;
}

export const MapView: React.FC<MapViewProps> = ({ planData }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current).setView([51.505, -0.09], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);
    }
  }, []);

  useEffect(() => {
    if (mapInstance.current && planData) {
      // Clear existing markers
      mapInstance.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          mapInstance.current.removeLayer(layer);
        }
      });

      const locations: { lat: number, lon: number, title: string, time: string, type: string }[] = [];
      planData.days?.forEach((day: any) => {
        day.segments?.forEach((segment: any) => {
          if (segment.location_coords?.lat && segment.location_coords?.lon) {
            locations.push({
              lat: segment.location_coords.lat,
              lon: segment.location_coords.lon,
              title: segment.title,
              time: segment.start || 'All day',
              type: segment.type
            });
          }
        });
      });

      if (locations.length > 0) {
        const bounds = L.latLngBounds([]);
        locations.forEach(loc => {
          const marker = L.marker([loc.lat, loc.lon]).addTo(mapInstance.current);
          marker.bindPopup(`<b>${loc.title}</b><br>${loc.time} (${loc.type})`);
          bounds.extend([loc.lat, loc.lon]);
        });
        
        // Use a small padding to ensure markers aren't on the edge
        mapInstance.current.fitBounds(bounds, { padding: [50, 50] }); 
      }
    }
  }, [planData]);

  return <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />;
};