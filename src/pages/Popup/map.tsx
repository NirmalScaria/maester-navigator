import L, { LatLngExpression, Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import { ImageOverlay, MapContainer, Marker, useMapEvents } from 'react-leaflet';
import { CoordinatesCopier, currentLocationMarker } from './elements';
// @ts-ignore
import mapImage from "../../assets/img/mapImage.jpg";


const defaultLocation: LatLngExpression = [33.38395654179022, -27.678533609484532]

function GeoJsonMap({ currentLocation }: { currentLocation: LatLngExpression | null }) {
  const [levelsToShow, setLevelsToShow] = React.useState<string[]>(["city", "castle", "town", "ruin"]);
  const [center, setCenter] = React.useState<LatLngExpression>(currentLocation ?? defaultLocation);
  const mapRef = useRef<Map>(null);

  useEffect(() => {
    if (currentLocation && center !== currentLocation) {
      setCenter(currentLocation);
      mapRef.current?.setView(currentLocation, 5);
    }
  })

  return (
    <MapContainer minZoom={2.32} maxZoom={7} maxBoundsViscosity={10000} maxBounds={new L.LatLngBounds([-4.369702166630044, -60.84149843858185], [61.29030647250153, 125.86686650752802])} ref={mapRef} zoomSnap={0.7} attributionControl={false} center={currentLocation ?? defaultLocation} zoom={5} style={{ height: 405, width: '100%', margin: 0, padding: 0, backgroundColor: '#66e1e3' }}>
      {/* <GeoJSON data={geojsonData as any} style={style} /> */}
      {currentLocation && <Marker position={currentLocation} icon={currentLocationMarker} />}
      <ImageOverlay url={mapImage} bounds={[[-20, -66], [72, 130]]} />
      <CoordinatesCopier />
      <ZoomSetter />
    </MapContainer>
  );

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
        else if (e.target.getZoom() < 4.4) {
          setLevelsToShow(["city", "castle", "town", "ruin"])
        }
        else if (e.target.getZoom() < 5) {
          setLevelsToShow(["city", "castle", "town", "ruin", "bigPlaces"])
        }
        else {
          setLevelsToShow(["city", "castle", "town", "ruin", "bigPlaces", "smallPlaces"])
        }
      }
    })
    return null
  }
};

export default GeoJsonMap;
