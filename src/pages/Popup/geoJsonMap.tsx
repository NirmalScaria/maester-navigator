// src/components/GeoJsonMap.tsx

import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { GeoJSON, MapContainer, Marker } from 'react-leaflet';
import geojsonData from './map.json';
// @ts-ignore
import currentLocationIcon from '../../assets/img/currentlocation.png'

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
  iconUrl: currentLocationIcon,
  iconSize: [30, 30],
  iconAnchor: [12, 41],
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
