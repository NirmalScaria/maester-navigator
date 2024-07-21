import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

function getVideoDetails() {
    let video = document.querySelector('video');
    if (video) {
        return {
            currentTime: video.currentTime,
            duration: video.duration,
            playing: !video.paused
        };
    }
    return null;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getVideoDetails") {
        sendResponse(getVideoDetails());
    }
});
