import L, { LatLngExpression, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import { GeoJSON, MapContainer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { ContinentLabels, CoordinatesCopier, currentLocationMarker, TextLabel } from './elements';
import geojsonData from './map.json';
import places from './data/places.json'


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
    <MapContainer minZoom={2.32} maxBoundsViscosity={10000} maxBounds={new L.LatLngBounds([-3.8369702166630044, -55.84149843858185], [71.61030647250153, 125.86686650752802])} zoomSnap={0.7} attributionControl={false} center={currentLocation} zoom={5} style={{ height: '100%', width: '100%', margin: 0, padding: 0, backgroundColor: '#66e1e3' }}>
      <GeoJSON data={geojsonData as any} style={style} />
      <Marker position={currentLocation} icon={currentLocationMarker} />
      <ContinentLabels />
      <CoordinatesCopier />
    </MapContainer>
  );
};

export default GeoJsonMap;
