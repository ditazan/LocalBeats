# Project Name


## Project Summary

...

## Developers

1. ...

2. ...

3. ...

## Installation Instructions

- Clone our repo to your computer

- ...


## Animated Gifs/Pictures of App

- Place various screens of your app here after they have been built

## Tech Stack

- What languages is it written with: 

- What libraries are used: 

- Other: 


## APIs

### Ticketmaster Classification API 
Ticketmaster Entertainment, LLC. (www.Ticketmaster.com) is the world’s largest ticket marketer, offering access to 230K+ live events sourced from various platform, including Ticketmaster, Universe, FrontGate Tickets and Ticketmaster Resale (TMR). Ticketmaster utilizes a proprietary, hierarchical coding schema (segment, genre, sub-genre, type, sub-type) to classify events. This code set is published through Ticketmaster's "Classifications" endpoint, located at: 

>>> https://app.Ticketmaster.com/discovery/v2/classifications?apikey=[api key]&locale=*

The proposed application will leverage the genre “id” and “name” codes found within the “music” segment and “en-us” locale of the "Classifications" endpoint’s response. The image below provides an illustration of the JSON response from the API.  

>>> IMAGE

The music genres (i.e., “names”) returned by the Ticketmaster Classification API shall be used to populate a drop-down field in the application’s UI – providing users with a method for selecting the type of music they like. The image below provides a wireframe illustration of the drop-down field.

>>> IMAGE

The genre(s) selected by the user shall be used as a parameter filter in the YouTube and Ticketmaster Events API calls.

### Ticketmaster Events API


## MVP (Minimum Viable Product)

-


## Stretch Goals

-
