
var firebaseConfig = {
    apiKey: "AIzaSyDBgFH0trwdSnwKq30Lj4H2EfDu8xCsGKU",
    authDomain: "chrome-duke.firebaseapp.com",
    projectId: "chrome-duke",
    storageBucket: "chrome-duke.appspot.com",
    messagingSenderId: "919440526614",
    appId: "1:919440526614:web:2d21458b94ff325b951437"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
let user = {};

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        var tabUrl = new URL(tab.url);
        var shorterUrl = tabUrl.origin;
        var strippedUrl = shorterUrl.replace(/(^\w+:|^)\/\//, '');
        const API = `http://api.thegreenwebfoundation.org/greencheck/${strippedUrl}`;
        var greenCheck;
        var url;

        fetch(API, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => {
            response.json().then((data) => {
                greenCheck = data.green;
                url = data.url;
                console.log("green check", greenCheck)
                // need to figure out what to do if greencheck returns undefined bc then it calls firebase error w invalid data
                if (greenCheck == true) {
                    chrome.browserAction.setIcon({path:'images/green-logo.png', tabId: activeInfo.tabId}); 
                } else if (greenCheck == false) {
                    chrome.browserAction.setIcon({path:'images/purple-logo.png', tabId: activeInfo.tabId}); 
                } else {
                    greenCheck = null;
                }
                // this would be a username from authentication if authenticated
                if (user !== {}) {
                    db.collection("website").add({
                        website: strippedUrl,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        green: greenCheck,
                    })
                    .then(function(docRef) {
                        console.log("Document written in ID: ", docRef.id);
                        // this puts the made website reference in an array of websites attached to the user
                        db.collection("users").doc(user.email).set({
                            websites: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                        }, { merge: true })
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                    });
                }
            });
        }).catch(error => {
            console.log("Error fetching response: ", error);
        });
    });
});

/* chrome.tabs.onCreated.addListener((tab) => {
    console.log(performance.now());
    chrome.storage.local.set({[tab.tabId]: performance.now()});
}); */