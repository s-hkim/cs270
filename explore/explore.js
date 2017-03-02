/*
@author: sk342
*/

const URL = "https://stream.wikimedia.org/v2/stream/recentchange";
const DATA_MAX = 100;

// what an eyesore
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
                  "x" : "60%",
                  "y" : "37%"
                });


// console.log(code_map)

var source;
var data_queue = [];
var data_map = d3.map();


var csvg = d3.select("body")
              .append("svg")
              .attr("height", 600)
              .attr("width", "100%");
var wmap = csvg.append("g");
var path = d3.geoPath(d3.geoOrthographic()).projection(d3.geoMercator());
// console.log(wmap)

// var context = d3.select("canvas").node().getContext("2d"),
//     path = d3.geoPath(d3.geoOrthographic(), context);

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
function hashString (str) {
  var hash = 0,
      i,
      chr,
      len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
function trimName (str) {
  str = str.replace("www.","").replace(".org","");
  return str.split('.')[0];
};

function styleNode (n) {

  return n;
};
var color = d3.scaleSequential(d3.interpolateRainbow)
          .domain([2000, 4000]);
color.clamp(true)
var r = d3.scaleLinear()
          .domain([1, 100])
          .range([5, 50]);
// var y = d3.scaleLinear()
//           .domain([1, data_map.size()])
//           .range([10, 600]);
// var x = d3.scaleLinear()
//           .domain([1, data_map.size()])
//           .range([10, 900]);
function x (name) {
  if (code_map.has(name)) {
    console.log(name)
    return code_map.get(name).x;
  }
  return 10;
};
function y (name) {
  if (code_map.has(name)) {
    return code_map.get(name).y;
  }
  return 10;
};



function displayData (data) {
  // console.log(data);
  var code = trimName(data.server_name);
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
  if (data_map.has(code)) {
    data_map.set(code, data_map.get(code) + 1);
  } else {
    data_map.set(code, 1);
  }
  // console.log(data_map.entries())
  // console.log(data_map.size())
  var nodes = csvg.selectAll("circle")
    .data(data_map.entries())
      .attr("r", d => r(d.value))

      // .text(d =>  d.key)
      //   .style("font-size", d => + 0.1 * d.value * "em")
      // .style("fill", d => color(hashString(d.key)))
      // .text(function(d) {return d.key;});
  nodes.enter().append("circle")
      // .merge(nodes)    causes major performance issues
      .attr("r", d => r(d.value))
      .attr("cx", d => x(d.key))
      .attr("cy", d => y(d.key))
      .style("fill", d => color(hashString(d.key)));
      // .text(d =>  d.key);

  nodes.exit().remove();
};





source.onopen = function (e) {
  console.log("connected");
};
source.onerror = function (e) {
  console.error(e);
};
source.onmessage = function (e) {
  displayData(JSON.parse(e.data));
};
