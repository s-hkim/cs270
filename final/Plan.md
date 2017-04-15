Plan
=====

A Near Earth Object (Asteroid) Tracking Application

## Features

##### Search

The most basic feature will be to search the database and list asteroid data. On search, the list displays a brief overview of each asteroid. The list will be able to be sorted on criteria including size, orbital period, and proximity to Earth, and be able to be filtered by criteria such as whether it is potentially hazardous and what body it orbits. Users will be able to select a list item to view more data about the asteroid in an expanded view, with links to outside resources.

This is just a basic search/list display, and it will likely look similar to the [list assignment](https://stark-falls-36193.herokuapp.com/posts). The biggest difference would be that users cannot enter their own data, and individual asteroid data will be displayed on the same page through expansion rather than a separate page.

##### Users

Users will be able to create an account to save data of interest. Saved data can be viewed as a list on the main page like usual or visualized in a solar system view. Nothing fancy, so I will be likely just use devise to set up a basic user model.

##### Visualization

There will be a solar system visualization (like [this](https://s-media-cache-ak0.pinimg.com/originals/dc/2b/d2/dc2bd293cd9e985a749fa939d2055648.jpg)) to display selected asteroids in relation to the Sun/planets. This visualization will be the most interesting and useful part of the application (since otherwise it is just a list view).

Saved asteroids will be displayed in this view, showing their position at the current data and toggleable orbital traces. Users will be able to zoom and pan through the display. By default, only asteroid IDs/names will be displayed next to objects, but hovering over an object will display a tooltip with more information about that object. Objects will be color-coded according to type (asteroid, planet, etc.) and whether it is potentially hazardous.

By default, the visualization will be static and show positions as of the current date. However, there will be a calendar/interface for users to pick/enter a date. Doing so will update the visualization with position data from that day. As an alternative, each saved object has "date of closest approach" data, which will be provided as a link in the tooltip that appears when hovering over the object. Following the link will set the map to that date.

Finally, there will be an animate option, which animates the orbits of all the objects displayed on the map.

The map will be 2D and should be relatively simple to create via [d3](https://d3js.org/). Another option would be to render it in 3D, possibly with [three.js](https://threejs.org/), but, while it would be cooler, I do not see any particular necessity for displaying orbital data in 3D.

If the user is not logged into an account (and therefore has no saved data), I will visualize a few of the closest asteroids at the current date.

## Data

The data for celestial objects will be taken from the following databases:  
- [NASA NeoWs](https://api.nasa.gov/api.html#NeoWS) for NEO data  
- [MPC Orbit Database](http://www.minorplanetcenter.org/iau/MPCORB.html) for minor planet data (also includes NEOs and Potentially Hazardous Asteroids)

Example data:
- [NeoWs list of asteroids](https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY)
- [MPCORB PHA data](http://www.minorplanetcenter.net/iau/MPCORB/PHA.txt)
