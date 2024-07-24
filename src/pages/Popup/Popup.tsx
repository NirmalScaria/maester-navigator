import React, { useEffect, useRef } from 'react';
import './Popup.css';
import GeoJsonMap from './map';
import episodes from './data/knownEpisodes.json'
import locations from './data/knownLocations.json' assert { type: "json" };
import { LatLngExpression } from 'leaflet';
import characters from './data/knownCharacters.json' assert { type: "json" };

interface Character {
  name: string;
  image: string;
  location: LatLngExpression;
  priority: number;
}

const Popup = () => {
  const [currentLocation, setCurrentLocation] = React.useState<LatLngExpression | null>(null);
  const [currentSeason, setCurrentSeason] = React.useState<number>(1);
  const [selectedSeason, setSelectedSeason] = React.useState<number>(1);
  const [currentEpisode, setCurrentEpisode] = React.useState<number>(1);
  const [chars, setChars] = React.useState<Character[]>([]);

  var episodeData = {}

  const currentSeasonRef = useRef(currentSeason);
  const currentEpisodeRef = useRef(currentEpisode);

  var currentSceneValue: any;

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
        async (results) => {
          if (results && results[0] && results[0].result) {
            var currentEpisodeData;
            if (`s${currentSeasonRef.current}e${currentEpisodeRef.current}` in episodeData) {
              // @ts-ignore
              currentEpisodeData = episodeData[`s${currentSeasonRef.current}e${currentEpisodeRef.current}` as string]
            }
            else {
              currentEpisodeData = await importEpisodeData({ season: currentSeasonRef.current, episode: currentEpisodeRef.current })
              // @ts-ignore
              episodeData[`s${currentSeasonRef.current}e${currentEpisodeRef.current}`] = currentEpisodeData
            }
            const scenes = currentEpisodeData.scenes
            const currentTime = results[0].result.currentTime
            const currentScene = scenes.find((scene: any) => stringToNum(scene.start) <= currentTime && stringToNum(scene.end) >= currentTime)
            if(currentSceneValue == currentScene) {
              console.log("Same. skipping")
              return;
            }
            currentSceneValue = currentScene;
            if (currentScene && currentScene.location) {
              const locationName: string = currentScene.location
              // @ts-ignore
              const location: any = locations[locationName]
              if (currentLocation != location)
                setCurrentLocation(location)
            }
            if (currentScene && currentScene.allCharacters) {
              const charactersInScene = currentScene.allCharacters
              const characterList: Character[] = []
              // Loop through the dict
              for (const characterName of Object.keys(charactersInScene)) {
                const thisCharacter = charactersInScene[characterName]
                const characterObject = {
                  name: characterName,
                  // @ts-ignore
                  image: characters[characterName]["characterImageThumb"],
                  // @ts-ignore
                  location: locations[thisCharacter.location],
                  priority: thisCharacter.priority
                }
                characterList.push(characterObject)
              }
              if (chars != characterList) {
                setChars(characterList)
              }
            }
          }
        }
      );
    });
  }

  async function importEpisodeData({ season, episode }: { season: number, episode: number }) {
    const response = await import(`./data/episodes/${season}/${episode}.json`)
    return response;
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
      <GeoJsonMap currentLocation={currentLocation} characters={chars}/>
    </div>
  );
};

function stringToNum(time: string) {
  var res = 0;
  const parts = time.split(':');
  for (let i = 0; i < parts.length; i++) {
    res += parseInt(parts[i], 10) * Math.pow(60, parts.length - 1 - i);
  }
  return res;
}

export default Popup;
