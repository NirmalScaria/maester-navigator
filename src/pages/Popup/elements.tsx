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

function ClusterGroup({ group }: { group: any }) {
    var groupHtml="<div style='relative'>"
    var i = 0;
    for (const char of group) {
        if(char.image === undefined) continue;
        groupHtml+=`<div class="avatar-container" style='left:${i * 20}px;'><img src=${char.image} class='avatar' alt=${char.name} />
        <div>${char.name}</div> 
        </div>`
        i += 1;
    }
    groupHtml+="</div>"
    // @ts-ignore
    return <Marker position={group[0].location as LatLngExpression} icon={new L.divIcon({
        className: 'cluster-group',
        html: groupHtml,
        iconSize: [40, 40], // Adjust size as needed
        iconAnchor: [20, 20] // Adjust anchor as needed
    })} />
}
export function Tier1Characters({ characters }: { characters: any }) {
    const groupWise = {}
    const tier1Chars = characters.filter((char: any) => char.priority === 1)
    for (const char of tier1Chars) {
        if (char.location.toString() in groupWise) {
            // @ts-ignore
            groupWise[char.location.toString()].push(char)
        }
        else {
            // @ts-ignore
            groupWise[char.location.toString()] = [char]
        }
    }
    console.log(groupWise)

    return <>{Object.keys(groupWise).map((group: any, index: number) => {
        // @ts-ignore
        return <ClusterGroup key={index} group={groupWise[group]} />
    })}</>
}



export const currentLocationMarker = new L.Icon({
    iconUrl: currentLocationIcon,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
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

export function BigPlaceLabels() {
    return <>{places["bigPlaces"].map((place, index) => {
        return <>
            <TextLabel key={index} text={place.name} coords={place.coordinates} className='big-place-label' />
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

export function SmallPlaceLabels() {
    return <>{places["smallPlaces"].map((place, index) => {
        return <>
            <TextLabel key={index} text={place.name} coords={place.coordinates} className='big-place-label' />
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