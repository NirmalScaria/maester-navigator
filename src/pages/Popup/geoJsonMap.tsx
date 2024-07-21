import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { GeoJSON, MapContainer, Marker } from 'react-leaflet';
import { currentLocationMarker } from './elements';
import geojsonData from './map.json';


const currentLocation: LatLngExpression = [52.107017102899, -32.4634878401302];

const style = (feature: any) => {
  return {
    color: '#fafaf588', // Line color
    weight: 2, // Line thickness
    fillColor: '#6bcf94', // Polygon fill color
    fillOpacity: 0.5, // Polygon fill opacity
    stroke: true
  };
};


const GeoJsonMap: React.FC = () => {
  return (
    <MapContainer attributionControl={false} center={currentLocation} zoom={5} style={{ height: '100%', width: '100%', margin: 0, padding: 0, backgroundColor: '#66e1e3' }}>
      <GeoJSON data={geojsonData as any} style={style} />
      <Marker position={currentLocation} icon={currentLocationMarker} />
    </MapContainer>
  );
};

export default GeoJsonMap;
