import { Polygon, useMapEvents } from 'react-leaflet';
// @ts-ignore
import currentLocationIcon from '../../assets/img/currentlocation.png'
// @ts-ignore
import cityIcon from '../../assets/img/city.png'
// @ts-ignore
import castleIcon from '../../assets/img/castle.png'
// @ts-ignore
import pointIcon from '../../assets/img/point.png'
import L, { LatLngExpression } from 'leaflet';
import React from 'react';
import { Marker } from 'react-leaflet';
import places from './data/places.json'

export const currentLocationMarker = new L.Icon({
    iconUrl: currentLocationIcon,
    iconSize: [30, 30],
    iconAnchor: [12, 41],
});

export function ContinentLabels() {
    return <>{places["continent"].map((place, index) => {
        return <TextLabel key={index} text={place.name} coords={place.coordinates} className='continent-label' />
    })}
    </>
}

export function RuinsLabels() {
    return <>{places["ruin"].map((place, index) => {
        return <>
            <TextLabel key={index} text={place.name} coords={place.coordinates} className='ruin-label' />
            <Marker
                position={place.coordinates as LatLngExpression}
                icon={new L.Icon({
                    iconUrl: pointIcon,
                    iconSize: [6, 6],
                    iconAnchor: [3, 27],
                })}
            />
        </>
    })}
    </>
}

export function TownLabels() {
    return <>{places["town"].map((place, index) => {
        return <>
            <TextLabel key={index} text={place.name} coords={place.coordinates} className='town-label' />
            <Marker
                position={place.coordinates as LatLngExpression}
                icon={new L.Icon({
                    iconUrl: pointIcon,
                    iconSize: [6, 6],
                    iconAnchor: [3, 27],
                })}
            />
        </>
    })}
    </>
}

export function CityLabels() {
    return <>

        {places["city"].map((place, index) => {
            return <>
                <TextLabel key={index} text={place.name} coords={place.coordinates} className='city-label' />
                <Marker
                    position={place.coordinates as LatLngExpression}
                    icon={new L.Icon({
                        iconUrl: cityIcon,
                        iconSize: [17, 17.],
                        iconAnchor: [8.5, 2.5],
                    })}
                />
            </>
        })}
    </>
}
export function CastleLabels() {
    return <>{places["castle"].map((place, index) => {
        return <>
            <TextLabel key={index} text={place.name} coords={place.coordinates} className='castle-label' />
            <Marker
                position={place.coordinates as LatLngExpression}
                icon={new L.Icon({
                    iconUrl: castleIcon,
                    iconSize: [17, 17.],
                    iconAnchor: [8.5, 2.5],
                })}
            />
        </>
    })}
    </>
}

export function TextLabel({ text, coords, className }: { text: string, coords: any, className?: string }) {
    return (<>
        <Marker
            position={coords}
            icon={L.divIcon({
                className: className ? ' ' + className : '',
                html: `<div>${text}</div>`,
                iconSize: [200, 40], // Adjust size as needed
                iconAnchor: [100, 20] // Adjust anchor as needed
            })}
        /> </>
    );
}

export function CoordinatesCopier() {
    useMapEvents({
        click: (e) => {
            navigator.clipboard.writeText(`[${e.latlng.lat}, ${e.latlng.lng}]`)
        }
    })
    return <div></div>
}