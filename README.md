# SportsTG API [![Build Status](https://travis-ci.org/AussieGuy0/sportstg-api.svg?branch=master)](https://travis-ci.org/AussieGuy0/sportstg-api)
A node.js library to scrape sports information from [SportsTG](https://sportstg.com/) based sites.

## Installation
`npm install sportstg-api` 

## Usage
```js
const sportstg = require('/sportstg-api')

//The compId is the 'c' query param that identifies a SportsTG competition
//It will look something like this: "0-3-0-508661-0"
//http://websites.sportstg.com/comp_info.cgi?c=0-3-0-508661-0" 
const compId = "0-3-0-508661-0"

//Parses the ladder table into an array of objects
//Second parameter is an optional round number
sportstg.getLadder(compId, 2)
    .then((ladder) => {
        //Each object key is a table heading. 
        //Example:
        //[{"b": 0, "d": 0, "ff": 0, "fg": 0, "gd": 31, "l": 0, "p": 1, "pos": 1, "pts": 3, "team": "Cool Team", "w": 1},...]
    })
    .catch((error) => {

    })
    

//Parses a specific round's fixtures into an array of objects
//Second parameter is a non-optional round number
sportstg.getRoundFixtures(compId, 2)
    .then((fixtures) => {
        //Example:
        //{homeTeam: 'Team 1', homeScore: 8, awayTeam: 'Team 2', awayScore: 3 }
    })
    .catch((error) => {

    })
```