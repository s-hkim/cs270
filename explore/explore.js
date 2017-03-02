/*
@author: sk342
*/

const URL = "https://stream.wikimedia.org/v2/stream/recentchange";
const DATA_MAX = 200;

// what an eyesore
// Mapping of top 20 wikipedia language prefixes to locations on the map
// In other words, the circles on the map don't actually correspond to locations of edits
var code_map = d3.map()
                .set("en",{
                  "x" : "18%",
                  "y" : "22%"
                })
                .set("ceb",{
                  "x" : "66%",
                  "y" : "39%"
                })
                .set("sv",{
                  "x" : "42%",
                  "y" : "8%"
                })
                .set("de",{
                  "x" : "41%",
                  "y" : "15%"
                })
                .set("nl",{
                  "x" : "40%",
                  "y" : "14%"
                })
                .set("fr",{
                  "x" : "39.5%",
                  "y" : "18%"
                })
                .set("ru",{
                  "x" : "55%",
                  "y" : "8%"
                })
                .set("it",{
                  "x" : "41.5%",
                  "y" : "21%"
                })
                .set("es",{
                  "x" : "38%",
                  "y" : "22%"
                })
                .set("war",{
                  "x" : "66%",
                  "y" : "38.5%"
                })
                .set("pl",{
                  "x" : "43%",
                  "y" : "14.7%"
                })
                .set("vi",{
                  "x" : "62.2%",
                  "y" : "37%"
                })
                .set("ja",{
                  "x" : "69%",
                  "y" : "24%"
                })
                .set("pt",{
                  "x" : "37%",
                  "y" : "22%"
                })
                .set("zh",{
                  "x" : "63%",
                  "y" : "24%"
                })
                .set("uk",{
                  "x" : "46%",
                  "y" : "15.5%"
                })
                .set("ca",{
                  "x" : "39%",
                  "y" : "21.5%"
                })
                .set("fa",{
                  "x" : "49%",
                  "y" : "24.3%"
                })
                .set("ar",{
                  "x" : "48%",
                  "y" : "29%"
                })
                .set("no",{
                  "x" : "40.5%",
                  "y" : "7%"
                });



var source;
var data_queue = [];
var data_map = d3.map();


var csvg = d3.select("body")
              .append("svg")
              .attr("height", 600)
              .attr("width", 1235);
var wmap = csvg.append("g");
var path = d3.geoPath().projection(d3.geoMercator());

// draw a typical map (mercator projection) using topojson
d3.json("https://d3js.org/world-110m.v1.json", function(error, world) {
  if (error) throw error;

  var paths = wmap.selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
  paths.enter()
      .append("path")
      .attr("d",path)
      .attr("fill","gray")
});

if (!!window.EventSource) {
  source = new EventSource(URL);
} else {
  console.error("you're out of luck, my friend");
}

// from https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
// Hash function so that I can assign colors to wikis programmatically
function hashString (str) {
  var hash = 0,
      i,
      chr,
      len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};
// Function to get the wiki prefix
function trimName (str) {
  str = str.replace("www.","").replace(".org","");
  return str.split('.')[0];
};
// colors are assigned using a d3 scale
var color = d3.scaleSequential(d3.interpolateRainbow)
          .domain([2000, 4000]);  // arbitrary limits that result in a good range of colors
color.clamp(true)

// scale for the size of the circles
var r = d3.scaleLinear()
          .domain([1, 100])
          .range([5, 50]);

function x (name) {
  if (code_map.has(name)) {
    return code_map.get(name).x;
  }
  return -999;
};
function y (name) {
  if (code_map.has(name)) {
    return code_map.get(name).y;
  }
  return "50%";
};

function displayData (data) {
  var code = trimName(data.server_name);
  // the queue is to have a sliding window of the stream data
  if (data_queue.length > DATA_MAX) {
    var trash = trimName(data_queue.shift().server_name);
    var val = data_map.get(trash) - 1;
    if (val < 1) {
      data_map.remove(trash)
    } else {
      data_map.set(trash, val);
    }
  }
  data_queue.push(data);
  // data_map contains recent edit counts for each wiki
  if (data_map.has(code)) {
    data_map.set(code, data_map.get(code) + 1);
  } else {
    data_map.set(code, 1);
  }

  // style existing circles
  var nodes = csvg.selectAll("circle")
    .data(data_map.entries());
  // create new circles for new data entries
  nodes.enter().append("circle")
      .attr("cx", d => x(d.key))
      .attr("cy", d => y(d.key))
      .style("fill", d => color(hashString(d.key)))
      .merge(nodes)
      .transition()
      .attr("r", d => r(d.value));
  // delete circles for data outside the window
  nodes.exit().remove();
};


// connect to wikipedia's recent edits stream
source.onopen = function (e) {
  console.log("connected");
};
source.onerror = function (e) {
  console.error(e);
};
source.onmessage = function (e) {
  displayData(JSON.parse(e.data));
};
