'use strict';

// change icon for an active twitch tab
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    chrome.browserAction.setIcon({
        path: 'extension/icons/chrome-icon-16.png',
        tabId: sender.tab.id
    });
});