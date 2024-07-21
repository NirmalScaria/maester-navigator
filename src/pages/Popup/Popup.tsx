import React, { useEffect } from 'react';
import './Popup.css';


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
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Maester Navigator
        </p>
        <p>Current Time: {videoDetails?.currentTime ?? "Loading"} / {videoDetails?.duration ?? "Loading"}</p>
      </header>
      <img src={mapImage}></img>
    </div>
  );
};

export default Popup;
