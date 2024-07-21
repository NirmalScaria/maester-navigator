import React, { useEffect } from 'react';
import './Popup.css';
// @ts-ignore
import { PanZoomImage } from "./panner.jsx";
import {CurrentLocation} from "./elements"

// import Leaf from 'leaflet';

// @ts-ignore
import mapImage from "../../assets/img/mapImage.jpg"
import GeoJsonMap from './geoJsonMap';

const Popup = () => {
  const [videoDetails, setVideoDetails] = React.useState<any>(null);
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
          console.log(results)
          if (results && results[0] && results[0].result) {
            setVideoDetails(results[0].result);
          }
        }
      );
    });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getDetails();
    }, 1000);
  }, []);
  const bounds = [[0, 0], [1000, 1000]];
  const elements = [
    {
      item: <CurrentLocation />,
      x: 18,
      y: 53.818362,
    },
  ]
  return (
    <div className="App">
      <GeoJsonMap />
    </div>
  );
};

export default Popup;
