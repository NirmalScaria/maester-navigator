import React, { useEffect } from 'react';
import './Popup.css';
import GeoJsonMap from './map';
import episodes from './data/knownEpisodes.json'
import locations from './data/knownLocations.json' assert { type: "json" };
import { LatLngExpression } from 'leaflet';

const Popup = () => {
  const [videoDetails, setVideoDetails] = React.useState<any>(null);
  const [content, setContent] = React.useState<any>(null);
  const [currentLocation, setCurrentLocation] = React.useState<LatLngExpression | null>(null);
  function getDetails() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id! },
          func: () => {
            const video = document.querySelector('video');
            if (video) {
              return {
                currentTime: video!.currentTime,
                duration: video!.duration,
                playing: !video!.paused
              };
            }
            return null;
          }
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            setVideoDetails(results[0].result);
            getLocation(results[0].result);
          }
        }
      );
    });
  }

  function getLocation({ currentTime }: { currentTime: number }) {
    const episode = episodes[1][6]
    const scenes = episode.scenes
    const currentScene = scenes!.find((scene: any) => stringToNum(scene.start) <= currentTime && stringToNum(scene.end) >= currentTime)
    if (currentScene && currentScene.location) {
      const locationName: string = currentScene.location
      // @ts-ignore
      const location: any = locations[locationName]
      if (currentLocation != location)
        setCurrentLocation(location)
    }
  }

  useEffect(() => {
    getDetails();
    setInterval(() => {
      getDetails();
    }, 1000);
  }, []);

  return (
    <div className="App">
      <GeoJsonMap currentLocation={currentLocation} />
    </div>
  );
};

function stringToNum(time: string) {
  // Takes time like '1:23:45' and returns number of seconds
  var res = 0;
  const parts = time.split(':');
  for (let i = 0; i < parts.length; i++) {
    res += parseInt(parts[i], 10) * Math.pow(60, parts.length - 1 - i);
  }
  return res;
}

export default Popup;
