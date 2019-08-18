//Firebase configuration
var firebaseConfig = { //setting up an object in specific fashion so that the firebase.initializeapp has all the parameters it needs
	apiKey: "AIzaSyCs5iFN-37w0uE_Mmnmy8Gi4vPdikRoB0E",
	authDomain: "watchingthewatchers.firebaseapp.com",
	databaseURL: "https://watchingthewatchers.firebaseio.com",
	projectId: "watchingthewatchers",
	storageBucket: "watchingthewatchers.appspot.com",
	messagingSenderId: "361444087410",
	appId: "1:361444087410:web:ee959f8701907b88"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// the data structure that houses all the meta data we collect 
function writeUserData(userId, _trackers) { //creates a function to write to the fbdb according to it's required parameters for passing in info. takes UserId and _trackers as passed in variables
    firebase.database().ref('data/' + userId).set({ //initializes the first two heirarchies for the nosql database
        '_trackers' : _trackers // initializes the last data structure in the fbdb using the passed in object _trackers
    });
}

// will pull the active tab (if you're watching in the background
// this extension won't work)
//sets up a function that listens for webrequests to complete and then executes code as a callback request
chrome.webNavigation.onCompleted.addListener(function(details) { 
    //sets up a function that gets the current tab and then executes code as a callback request
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) { 
        // uses a built in JS function used for debugging that attempts to run code and returns an error if it failed
        try { 
            // logic structure to compare the web requests url against the tabs url and if it matches executues the code inside the code block. This is the reason it won't compare against the trackers if you switch tabs
            if(details.url == tabs[0].url){ 
                //creates time stamps in a variable.  Calculation is done here as calculations are not allowed to be done in the writing function to fbdb
                let time = window.performance.timing.navigationStart 
                // logs a truncated version of the URL to remove all symbols, www and http(s) to a variable for use in writing to the database
                let initiatorSite2 = tabs[0].url.replace(/[/-\/\\^$*+?.()|[\]{}]/g,'').replace('https','').replace('http','').replace('www','') 
                // puts the truncated url variable and timestamp into one variable
                source = (initiatorSite2 + time) 
                // logs to chrome console when it's about to write to fbdb
                console.log('writing to database')
                // calls function declared above passing in source and _trackers
                writeUserData(source, _trackers);
                // after writing to fbdb, after a 2 second delay (to ensure it finished) resets the keys in the _trackers object back to initial values
                setTimeout(function() {
                    for (var key in _trackers) {
                        _trackers[key].enabled = false
                        _trackers[key].initiator = ""
                    }
                }, 2000) // this is where the 2 second wait is specified
            }
        } catch(e) {} // logs the error in case the code above errored out.  Can log error message to console, instead we are writing {} for ease of recognition in console
      });
}, {urls: ["<all_urls>"]}); // indicates the oncompleted listener should run on all urls


//sets up a function that listens for webrequests and executes the code in the callback function to run before it allows it to complete
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    // iterates through each object in the tracker
    for (var key in _trackers) {
        // indexOf is a built in js function for strings.  Compares webrequests url property against the current object in the loop's url property to see if it matches.  If it does, runs code inside code block
        if(details.url.indexOf(_trackers[key]._url) != -1) { 
            _trackers[key].enabled = true // sets the matched objects enabled property to true
            _trackers[key].initiator = details.initiator // passes the string value of the initiator property of the webrequest to the matched objects initiator property 
            };
    }},
    {urls: ["<all_urls>"]}, // indicates the oncompleted listener should run on all urls
    ["blocking"] // allows the ability to intercept the webrequest
);