import L, { LatLngExpression, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import { GeoJSON, MapContainer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { BigPlaceLabels, CastleLabels, CityLabels, ContinentLabels, CoordinatesCopier, currentLocationMarker, RuinsLabels, SmallPlaceLabels, TextLabel, TownLabels } from './elements';
import geojsonData from './map.json';
import places from './data/places.json'


const currentLocation: LatLngExpression = [
  52.107017102899,
  -32.4634878401302
]

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
  const [levelsToShow, setLevelsToShow] = React.useState<string[]>(["city", "castle", "town", "ruin"]);

  function ZoomSetter() {
    useMapEvents({
      zoom: (e) => {
        if (e.target.getZoom() < 3) {
          setLevelsToShow(["continent"]);
        } else if (e.target.getZoom() < 4) {
          setLevelsToShow(["city"])
        }
        else if (e.target.getZoom() < 4.2) {
          setLevelsToShow(["city", "castle"])
        }
        else if(e.target.getZoom() < 4.4){
          setLevelsToShow(["city", "castle", "town", "ruin"])
        }
        else if(e.target.getZoom() < 5) {
          setLevelsToShow(["city", "castle", "town", "ruin", "bigPlaces"])
        }
        else {
          setLevelsToShow(["city", "castle", "town", "ruin", "bigPlaces", "smallPlaces"])
        }
      }

    })
    return null
  }
  return (
    <MapContainer minZoom={2.32} maxBoundsViscosity={10000} maxBounds={new L.LatLngBounds([-3.8369702166630044, -55.84149843858185], [71.61030647250153, 125.86686650752802])} zoomSnap={0.7} attributionControl={false} center={currentLocation} zoom={5} style={{ height: '100%', width: '100%', margin: 0, padding: 0, backgroundColor: '#66e1e3' }}>
      <GeoJSON data={geojsonData as any} style={style} />
      <Marker position={currentLocation} icon={currentLocationMarker} />
      {levelsToShow.includes('continent') && <ContinentLabels />}
      {levelsToShow.includes('city') && <CityLabels />}
      {levelsToShow.includes('castle') && <CastleLabels />}
      {levelsToShow.includes('town') && <TownLabels />}
      {levelsToShow.includes('ruin') && <RuinsLabels />}
      {levelsToShow.includes('smallPlaces') && <SmallPlaceLabels />}
      {levelsToShow.includes('bigPlaces') && <BigPlaceLabels />}
      <CoordinatesCopier />
      <ZoomSetter />
    </MapContainer>
  );
};

export default GeoJsonMap;
