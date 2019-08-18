# Watching the Watchers

A chrome extension that collects a bunch of meta-data while the user browses the internet in order to visualize and understand how much our every move is being watched online.

## Part 1

- poke around the chrome extension, understand it
- build a list of urls for adtech using ghostrey
- write some code to detect those urls inside of the `webRequest.onBeforeRequest`
- create a data structure that will house all the meta data you need
- figure out when to call the writeUserData function to send data to firebase

## Part 2

- identify a chrome extension event listener that alerts you when the page has completly stopped making network requests
- think about the database schema that we need to create in order to get the data into a single call to firebase
- start thinking about how to generate IDs in order to avoid overwriting data
