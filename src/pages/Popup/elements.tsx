// @ts-ignore
import currentLocationIcon from '../../assets/img/currentlocation.png'
import L from 'leaflet';

export const currentLocationMarker = new L.Icon({
    iconUrl: currentLocationIcon,
    iconSize: [30, 30],
    iconAnchor: [12, 41],
});