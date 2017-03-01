/*
@author: sk342
*/

const URL = "https://stream.wikimedia.org/v2/stream/recentchange";
const DATA_MAX = 100;
const HASH_MAX = Math.pow(2, 31) - 1;

var source;
var allData = [];

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
  return str.replace("www.","").replace(".org","");
};

function styleNode (n) {

  return n;
};
var color = d3.scaleLinear()
  .domain([0, HASH_MAX])
  .range(["#8800e5", "#4bbf00"]);


function displayData (data) {
  // console.log(data);
  if (allData.length > DATA_MAX) {
    allData.shift();
  }
  allData.push(data);

  var nodes = d3.select("body")
    .selectAll("p")
    .data(allData)
      .text(function(d) {return d.server_name;});
  nodes.enter().append("p")
      // .attr("r", 4)
      .style("background", d => color(hashString(d.server_name)))
      .text(d =>  d.server_name);
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
