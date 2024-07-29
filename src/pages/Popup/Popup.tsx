import React, { useEffect, useRef } from 'react';
import './Popup.css';
import GeoJsonMap from './map';
import episodes from './data/knownEpisodes.json'
import hotdEpisodes from './data/hotdEpisodes.json'
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
  const [currentSeries, setCurrentSeries] = React.useState<string>("Game of Thrones");
  const [selectedSeason, setSelectedSeason] = React.useState<number>(1);
  const [currentEpisode, setCurrentEpisode] = React.useState<number>(1);
  const [chars, setChars] = React.useState<Character[]>([]);
  // const [remoteCharacters, setRemoteCharacters] = React.useState<any>({});

  var remoteCharacters: any = {};
  var remoteLocations: any = {};
  var episodeData = {}

  const currentSeasonRef = useRef(currentSeason);
  const currentEpisodeRef = useRef(currentEpisode);
  const currentSeriesRef = useRef(currentSeries);

  var currentSceneValue: any;

  useEffect(() => {
    currentSeasonRef.current = currentSeason;
  }, [currentSeason]);

  useEffect(() => {
    currentEpisodeRef.current = currentEpisode;
  }, [currentEpisode]);

  useEffect(() => {
    currentSeriesRef.current = currentSeries;
  }, [currentSeries]);

  useEffect(() => {
    chrome.storage.local.get(['currentSeason', 'currentEpisode', 'currentSeries'], (result) => {
      if (result.currentSeason)
        setCurrentSeason(result.currentSeason)
      if (result.currentEpisode)
        setCurrentEpisode(result.currentEpisode)
      if (result.currentSeries)
        setCurrentSeries(result.currentSeries)
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
            if (`${currentSeriesRef.current}s${currentSeasonRef.current}e${currentEpisodeRef.current}` in episodeData) {
              // @ts-ignore
              currentEpisodeData = episodeData[`${currentSeriesRef.current}s${currentSeasonRef.current}e${currentEpisodeRef.current}` as string]
            }
            else {
              currentEpisodeData = await importEpisodeData({ season: currentSeasonRef.current, episode: currentEpisodeRef.current, series: currentSeriesRef.current })
              // @ts-ignore
              episodeData[`${currentSeriesRef.current}s${currentSeasonRef.current}e${currentEpisodeRef.current}`] = currentEpisodeData
            }
            const scenes = currentEpisodeData.scenes
            const currentTime = results[0].result.currentTime
            const currentScene = scenes.find((scene: any) => stringToNum(scene.start) <= currentTime && stringToNum(scene.end) >= currentTime)
            if (currentSceneValue == currentScene) {
              return;
            }
            currentSceneValue = currentScene;
            console.log("Current scene : ", currentScene)
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
                if (currentSeriesRef.current == "Game of Thrones") {
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
                else {
                  const characterObject = {
                    name: characterName,
                    image: remoteCharacters[characterName].image,
                    // @ts-ignore
                    location: remoteLocations[thisCharacter.location],
                    priority: 1
                  }
                  characterList.push(characterObject)
                }
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

  async function importEpisodeData({ season, episode, series }: { season: number, episode: number, series: string }) {
    var response;
    if (series == "Game of Thrones") {
      response = await import(`./data/episodes/${season}/${episode}.json`)
      return response;
    }
    else {
      console.log("Series is House of the Dragon")
      if (Object.keys(remoteCharacters).length == 0) {
        const url = "https://maester-navigator-dashboard.vercel.app/api/getChars"
        const response = await fetch(url);
        const data = await response.json();
        remoteCharacters = data;
      }
      if (Object.keys(remoteLocations).length == 0) {
        const url = "https://maester-navigator-dashboard.vercel.app/api/getLocations"
        const response = await fetch(url);
        const data = await response.json();
        remoteLocations = data;
      }
      const url = `https://maester-navigator-dashboard.vercel.app/api/getEpisode?season=${season}&episode=${episode}`
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }

  }

  useEffect(() => {
    getDetails();
    setInterval(() => {
      getDetails();
    }, 1000);
  }, []);

  function copyTime() {
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
            const currentTime = results[0].result.currentTime
            const hours = Math.floor(currentTime / 3600);
            const minutes = Math.floor((currentTime % 3600) / 60);
            const seconds = Math.floor(currentTime % 60);
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            navigator.clipboard.writeText(timeString)
          }
        }
      );
    });
  }

  return (
    <div className="App">
      <div className="top-bar custom-select">
        <select
          value={currentSeries}
          onChange={(e) => {
            setCurrentSeries(e.target.value);
            setSelectedSeason(1);
            setCurrentSeason(1);
            setCurrentEpisode(1);
          }}
        >
          <option value="Game of Thrones">Game of Thrones</option>
          <option value="House of the Dragon">House of the Dragon</option>
        </select>
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
        >
          {Object.keys(currentSeries == "Game of Thrones" ? episodes : hotdEpisodes).map((season) => {
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
            setCurrentSeason(selectedSeason)
            setCurrentEpisode(parseInt(e.target.value))
            chrome.storage.local.set({ currentSeason: selectedSeason, currentEpisode: parseInt(e.target.value), currentSeries: currentSeries })
          }}
        >
          {Object.keys(currentSeries == "Game of Thrones" ? episodes[selectedSeason] : hotdEpisodes[selectedSeason]).map((episode) => {
            if (episode === '0')
              return null;
            return <option key={episode} value={episode}>
              Episode {episode} - {(currentSeries == "Game of Thrones" ? episodes : hotdEpisodes)[selectedSeason][Number(episode)].title}
            </option>
          })}
        </select>
        {/* <div className="video-status video-status-playing" onClick={copyTime}>Copy time</div> */}
        {currentLocation ? <div className="video-status video-status-playing">Live</div> :
          <div className="video-status video-status-notfound">ⓘ Start playing</div>}
      </div>
      <GeoJsonMap currentLocation={currentLocation} characters={chars} />
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
