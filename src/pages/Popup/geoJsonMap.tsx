// src/components/GeoJsonMap.tsx

import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { GeoJSON, MapContainer, Marker } from 'react-leaflet';
import geojsonData from './map.json';

const center: LatLngExpression = [52.107017102899, -32.4634878401302]; // Change this to your desired map center coordinates

const style = (feature: any) => {
  return {
    color: '#fafaf588', // Line color
    weight: 2, // Line thickness
    fillColor: '#6bcf94', // Polygon fill color
    fillOpacity: 0.5, // Polygon fill opacity
    stroke: true
  };
};

const customMarkerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});
const GeoJsonMap: React.FC = () => {
  return (
    <MapContainer attributionControl={false} center={center} zoom={1} style={{ height: '100%', width: '100%', margin: 0, padding: 0, backgroundColor: '#66e1e3' }}>
      <GeoJSON data={geojsonData as any} style={style} />
      <Marker
        position={center}
        icon={customMarkerIcon}
      ></Marker>
    </MapContainer>
  );
};

export default GeoJsonMap;
