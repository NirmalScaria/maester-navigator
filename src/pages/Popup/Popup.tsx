import React, { useEffect } from 'react';
// import logo from '../../assets/img/logo.svg';
// import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const [videoDetails, setVideoDetails] = React.useState<any>(null);
  useEffect(() => {
    console.log("Loading")
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("Executing script")
      console.log("Scripting is ", chrome.scripting)
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
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Maester Navigator
        </p>
        <p>Current Time: {videoDetails?.currentTime ?? "Loading"} / {videoDetails?.duration ?? "Loading"}</p>
      </header>
    </div>
  );
};

export default Popup;
