Sung-Hoon Kim (sk342)

Date started:  2/28/17  
Date completed:  3/1/17  
Time spent: about 8 hours  

I chose to explore the d3 data visualization library. The API provided at https://github.com/d3/d3/blob/master/API.md is fairly detailed, and their website also provides a number of examples to help newcomers. d3 provides many different functions and components to help process and visualize data. For example, my page uses d3 to create an svg world map using its topology json format, to easily transform data with its scaling functions, and to display streaming data with its node enter/exit paradigm. In addition, d3 also provides other features such as common data structures (like hashmaps) and a robust selection system to interact with the DOM. My HTML file has an empty body, and I was able to completely use d3 as a substitute for jQuery, as well.

A clarification on what my webpage does, since it is probably not immediately obvious: it subscribes to Wikipedia's recent edits stream, and keeps track of the last 200 edits. These are displayed on the map according to the wiki to which the edit was made: however only the 20 languages with the most wikipedia articles are shown. Since the wikis are based on language, the map does not actually reflect the location where the edit was made - just a general sense of which wikis are being updated at the moment.

Resources used: https://github.com/d3/d3/blob/master/API.md, https://github.com/topojson/topojson, https://github.com/topojson/world-atlas, https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery, https://wikitech.wikimedia.org/wiki/EventStreams
Assets: https://stream.wikimedia.org/v2/stream/recentchange, https://d3js.org/world-110m.v1.json
