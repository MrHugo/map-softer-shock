var countries = ['USA', 'France', 'Spain', 'Brazil', 'Mexico', 'China'];
var width =  900;
var height = 500;
var format = d3.format(",");
var path = d3.geoPath();

// Set tooltips
var tip = d3.tip()
.attr('class', 'd3-tip')
.offset([-10, 0])
.html(function(d) {
  return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "</span>";
})

var color = d3.scaleThreshold()
.domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
.range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);


var svg = d3.select(".worldmap")
.append("svg")
.attr("viewBox", "0 0 960 500")
.attr("preserveAspectRatio", "xMidYMid meet")
.append('g')
.attr('class', 'map');

var projection = d3.geoMercator()
.scale(130)
.translate( [width / 2, height / 1.5]);

var path = d3.geoPath().projection(projection);

svg.call(tip);

queue()
.defer(d3.json, "world_countries.json")
.await(ready);


function ready(error, data) {
  var ids = {};

  svg.append("g")
  .attr("class", "countries")
  .selectAll("path")
  .data(data.features)
  .enter().append("path")
  .attr("d", path)
  .style("fill", function(d) { return color(6000000); }) // color
  .style('stroke', 'white')
  .style('stroke-width', 1.5)
  .style("opacity",0.8)
  // tooltips
  .style("stroke","white")
  .style('stroke-width', 0.3)
  .on('click', function (d) {
    countries.some(c => {
      if (c === d.properties.name) {
        getContent(d.properties.name);
        moveDown('.main')
        return true;
      }
    });
  })
  .on('mouseover',function(d){
    countries.some(c => {
      if (c === d.properties.name) {
        tip.show(d);
        return true;
      }
    });

    d3.select(this)
    .style("opacity", 1)
    .style("stroke","white")
    .style("stroke-width",3);
  })
  .on('mouseout', function(d){
    tip.hide(d);

    d3.select(this)
    .style("opacity", 0.8)
    .style("stroke","white")
    .style("stroke-width",0.3);
  });

  svg.append("path")
  .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
  .attr("class", "names")
  .attr("d", path);
}

function getContent(country) {
  var xhr= new XMLHttpRequest();
  xhr.open('GET', 'tabs-content/' + country + '.html', true);
  xhr.onreadystatechange= function() {

    if (this.readyState !== 4 && this.status !== 200)
      return;

    var parser = new DOMParser()
    var htmlContent = parser.parseFromString(this.responseText, "text/xml");

    document.getElementById('survey').innerHTML= htmlContent.getElementsByClassName('survey')[0].innerHTML;
    document.getElementById('regulation').innerHTML= htmlContent.getElementsByClassName('regulation')[0].innerHTML;
    document.getElementById('applications').innerHTML= htmlContent.getElementsByClassName('applications')[0].innerHTML;
  };
  xhr.send();
}
