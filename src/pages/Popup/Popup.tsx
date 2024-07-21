import React, { useEffect } from 'react';
import './Popup.css';
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
    setInterval(() => {
      getDetails();
    }, 1000);
  }, []);

  return (
    <div className="App">
      <GeoJsonMap />
    </div>
  );
};

export default Popup;
