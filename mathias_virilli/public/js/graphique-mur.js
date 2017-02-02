'use strict';

var walls;
d3.json("data/walls.json", function(error, data) {
    walls = data;
});

function updateAnnee(val) {
    document.getElementById("affichage-annee").innerHTML = val;
    
    replay(generateDisplayData());
}

function generateDisplayData() {

    var annee = document.getElementById("annee").value;
    var displayData = [];

    walls.forEach(function(d) {
	  
        if(d.annee <= annee) {
	
	        var found = displayData.find(function(elem) {
	            return elem['type'] === d.type;
	        });
	    	  
            if(found === undefined) {
                displayData.push({'type': d.type, 'longueur': d.longueur});
            } else {
                found['longueur'] += d.longueur;
            }
        }
    });
    
    return displayData;
}


// Mike Bostock "margin conventions"
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 260 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// D3 scales = just math
// x is a function that transforms from "domain" (data) into "range" (usual pixels)
// domain gets set after the data loads
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

// D3 Axis - renders a d3 scale in SVG
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// create an SVG element (appended to body)
// set size
// add a "g" element (think "group")
// annoying d3 gotcha - the 'svg' variable here is a 'g' element
// the final line sets the transform on <g>, not on <svg>
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")

svg.append("g")
    .attr("class", "y axis")
  .append("text") // just for the title (ticks are automatic)
    //.attr("transform", "rotate(-90)") // rotate the text!
    .attr("x", 140)
    .attr("y", -9)
    //.attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Longueur cumulée des murs (km)");

replay(generateDisplayData());
    

function type(d) {
    // + coerces to a Number from a String (or anything)
    d.longueur = +d.longueur;
    return d;
}

function replay(data) {
    var slices = [];
    for (var i = 0; i < data.length; i++) {
        slices.push(data.slice(0, i+1));
    }
    slices.forEach(function(slice, index){
        draw(slice);
    });
}

function draw(data) {

    // measure the domain
    // now the scales are finished and usable
    x.domain(data.map(function(d) { return d.type; }));
    y.domain([0, d3.max(data, function(d) { return d.longueur; })]);

    // another g element, this time to move the origin to the bottom of the svg element
    // someSelection.call(thing) is roughly equivalent to thing(someSelection[i])
    //   for everything in the selection\
    // the end result is g populated with text and lines!
    svg.select('.x.axis').call(xAxis);

    // same for yAxis but with more transform and a title
    svg.select(".y.axis").call(yAxis)

    // THIS IS THE ACTUAL WORK!
    var bars = svg.selectAll(".bar").data(data, function(d) { return d.type; }) // (data) is an array/iterable thing, second argument is an ID generator function

    bars.exit()
        .attr("y", y(0))
        .attr("height", height - y(0))
        .style('fill-opacity', 1e-6)
        .remove();

    // data that needs DOM = enter() (a set/selection, not an event!)
    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("y", y(0))
        .attr("height", height - y(0));

    // the "UPDATE" set:
    bars.attr("x", function(d) { return x(d.type); }) // (d) is one item from the data array, x is the scale object from above
        .attr("width", x.rangeBand()) // constant, so no callback function(d) here
        .attr("y", function(d) {  return y(d.longueur); })
        .attr("height", function(d) { return height - y(d.longueur); }); // flip the height, because y's domain is bottom up, but SVG renders top down
}
