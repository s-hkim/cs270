Sung-Hoon Kim (sk342)

Date started:  4/24/17
Date completed: 4/30/17  
Time spent: about 35 hours  

## A Near Earth Object (Asteroid) Tracking Application

link:  https://frozen-lowlands-71905.herokuapp.com/

what makes your application useful  
- it's got a kickass orbit diagram view (which hopefully makes up for the somewhat lackluster list below it)
- it's a visualization of an interesting dataset: Near Earth Objects (NEOs) / asteroids
- NASA's version is a Java applet that I had to access through Internet Explorer (e.g. https://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2017%20HA5) so mine is clearly better

special instructions needed to set up, run, access, or use your application (like user passwords you have set up, command line utilities, or external programs that need to be run)  
- I've set it up already - the admin account is created in seed.rb, and the database is populated through the link on the admin page
  - admin account:
    - email: "admin@admin"
    - password: "password"  
- JSON data can be accessed here:
    - planets: https://frozen-lowlands-71905.herokuapp.com/planets.json  
    - asteroids: https://frozen-lowlands-71905.herokuapp.com/data.json  
- on the main page, you can click the list elements to expand them  
- you can click the names of NEOs in the visualization to see more info  
- control the visualization with the controls at the top right  

references for your data that establishes its authenticity
- my data comes from here:  https://api.nasa.gov/api.html#neows-feed  


### Libraries:

`three.js`: used to create the 3D orbit diagrams.  
  - the alternative was to make the visualization 2D and use d3, but 3D looks better and three.js allows for easier implementation of camera controls
  - well documented and there are many extensions/add-on libraries available
    - I use TrackballControls to control the camera and `threex.domevents.js` to handle mouse events

`dat.gui`: used to control the orbit visualization
  - very easy to use and the styling looks nice
  - does not have a datepicker built in, but I was able to easily integrate the bootstrap datepicker

`smart_listing`: used to paginate, sort, and filter the list of asteroids
  - unfortunately, has very little documentation
  - the sorting seems a little buggy and does not have many options
  - however, the pagination works well and everything uses ajax calls, which helps immensely since I don't have to reload the visualization each time the list is changed

`gon`: used to pass variables from Ruby to JavaScript
  - simplifies passing the asteroid data to the visualization code


Resources used:  
https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene  
https://space.stackexchange.com/questions/8911/determining-orbital-position-at-a-future-point-in-time  
http://www.davidcolarusso.com/astro/#helioeclipxyz  
http://www.jgiesen.de/kepler/kepler.html  
http://www.stjarnhimlen.se/comp/tutorial.html  
http://farside.ph.utexas.edu/teaching/celestial/Celestialhtml/node34.html  
https://stackoverflow.com/questions/40446915/three-js-keep-label-size-on-zoom/40452050#40452050  

Assets:  
https://github.com/Sology/smart_listing  
https://github.com/dataarts/dat.gui  
https://threejs.org/  
https://github.com/jeromeetienne/threex.domevents  
https://api.nasa.gov/api.html#neows-feed  
https://ssd.jpl.nasa.gov/txt/p_elem_t1.txt  
