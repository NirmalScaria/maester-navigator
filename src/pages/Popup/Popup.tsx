import React, { useEffect } from 'react';
import './Popup.css';
// @ts-ignore
import { PanZoomImage } from "./panner.jsx";

// @ts-ignore
import mapImage from "../../assets/img/mapImage.jpg"

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
      item: <div style={{ height: 10, width: 10, backgroundColor: 'red' }}></div>,
      x: 20,
      y: 20,
    },
    {
      item: <div style={{ padding: 4, backgroundColor: '#0380fc88', borderRadius: 9999 }}>
        <div style={{ height: 13, width: 13, backgroundColor: '#0380fc', borderRadius: 9999 }}></div>
      </div>,
      x: 60,
      y: 90,
    },
  ]
  return (
    <div className="App">
      <PanZoomImage imageUrl={mapImage} elements={elements} />
    </div>
  );
};

export default Popup;
