import React, { useEffect, useRef } from 'react';
import './Popup.css';
import GeoJsonMap from './map';
import episodes from './data/knownEpisodes.json'
import locations from './data/knownLocations.json' assert { type: "json" };
import { LatLngExpression } from 'leaflet';

const Popup = () => {
  const [videoDetails, setVideoDetails] = React.useState<any>(null);
  const [content, setContent] = React.useState<any>(null);
  const [currentLocation, setCurrentLocation] = React.useState<LatLngExpression | null>(null);
  const [currentSeason, setCurrentSeason] = React.useState<number>(1);
  const [selectedSeason, setSelectedSeason] = React.useState<number>(1);
  const [currentEpisode, setCurrentEpisode] = React.useState<number>(1);

  const currentSeasonRef = useRef(currentSeason);
  const currentEpisodeRef = useRef(currentEpisode);

  useEffect(() => {
    currentSeasonRef.current = currentSeason;
  }, [currentSeason]);

  useEffect(() => {
    currentEpisodeRef.current = currentEpisode;
  }, [currentEpisode]);

  useEffect(() => {
    chrome.storage.local.get(['currentSeason', 'currentEpisode'], (result) => {
      if (result.currentSeason)
        setCurrentSeason(result.currentSeason)
      if (result.currentEpisode)
        setCurrentEpisode(result.currentEpisode)
    }
    )
  }, [])

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
    // console.log("Using ", currentSeasonRef.current, currentEpisodeRef.current, currentTime)
    const episode = episodes[currentSeasonRef.current][currentEpisodeRef.current]
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
      <div className="top-bar">
        <select
          value={currentSeason}
          onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
        >
          {Object.keys(episodes).map((season) => {
            if (season === '0')
              return null;
            return <option key={season} value={season}>
              Season {season}
            </option>
          })}
        </select>
        <select
          value={currentEpisode}
          onChange={(e) => {
            console.log("Setting current episode : ", e.target.value)
            setCurrentSeason(selectedSeason)
            setCurrentEpisode(parseInt(e.target.value))
            chrome.storage.local.set({ currentSeason: selectedSeason, currentEpisode: parseInt(e.target.value) })
          }}
        >
          {Object.keys(episodes[selectedSeason]).map((episode) => {
            if (episode === '0')
              return null;
            return <option key={episode} value={episode}>
              Episode {episode} - {episodes[selectedSeason][Number(episode)].title}
            </option>
          })}
        </select>
      </div>
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
