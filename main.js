// https://stackoverflow.com/questions/1979583/how-can-i-get-the-url-of-the-current-tab-from-a-google-chrome-extension
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let currentURL = tabs[0].url;

    // lmao maybe something like this idk
    const API = `http://api.thegreenwebfoundation.org/greencheck/${currentURL}`;
    let greenCheck;

    fetch(API)
        .then(response => {
            console.log(response);
            greenCheck = response.data.green;
        });

    if (greenCheck) {
        chrome.pageAction.show(); // this is not right but something like this
    } else {
        chrome.pageAction.hide(); // this is not right but something like this
    }
});