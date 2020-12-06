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

document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById('button').addEventListener('click', function() {
        chrome.identity.getAuthToken({ interactive: true }, function(token) {
            if (chrome.runtime.lastError) {
                alert(chrome.runtime.lastError.message);
                return;
            }
            var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
            firebase.auth().signInWithCredential(credential);
        
            fetch ('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token)
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                user = jsonResponse;
                email = user.email;
                document.getElementById('user-email').innerHTML = "Welcome, " + email;
            });
        });
    });
});