var countries = ['USA', 'France', 'Spain', 'Brazil', 'Mexico', 'China'];
var width =  900;
var height = 500;
var format = d3.format(",");
var path = d3.geoPath();

var tip = d3.tip()
.attr('class', 'd3-tip')
.offset([-10, 0])
.html(function(d) {
  return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "</span>";
})

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
  .style("fill", function(d) {
    let isHightlight = false;
    countries.forEach(c => {
      if (c === d.properties.name) {
        isHightlight = true;
      }
    });
    if (!isHightlight) {
      return 'rgb(158, 202, 255)';
    }
    else {
      return 'rgb(66,146,198)';
    }
  })
  .style('stroke', 'white')
  .style('stroke-width', 1.5)
  .style("opacity",0.8)
  .style("stroke","white")
  .style('stroke-width', 0.3)
  .on('click', function (d) {
    countries.some(c => {
      if (c === d.properties.name) {
        getContent(d.properties.name);
        moveDown('.main');
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
  xhr.open('GET', 'tabs-content/' + country + '-intro.html', true);
  xhr.onreadystatechange= function() {

    if (this.readyState !== 4 && this.status !== 200)
    return;

    var parser = new DOMParser()
    var htmlContent = parser.parseFromString(this.responseText, "text/xml");

    var link = "<a id='link' class='link' target='_blank' href='https://softer-shock-map.herokuapp.com/tabs-content/"; + country + ".html'>Click here for more informations !</a>";

    if (typeof(htmlContent) != undefined) {
      document.getElementById('survey').innerHTML= link + "survey/" + country + ".html'<a>Click here to access complete information !</a>" +
      htmlContent.getElementsByClassName('survey')[0].innerHTML;

      document.getElementById('regulation').innerHTML= link + "regulation/" + country + ".html'<a>Click here to access complete information !</a>" +
      htmlContent.getElementsByClassName('regulation')[0].innerHTML;

      document.getElementById('applications').innerHTML= link + "application/" + country + ".html'<a>Click here to access complete information !</a>" +
      htmlContent.getElementsByClassName('applications')[0].innerHTML;
    }

    var buttons = document.querySelectorAll('.link');

    for (var i=0; i < buttons.length; i++) {
      console.log(buttons[i]);
      buttons[i].setAttribute("style", "margin-bottom: 50px;");
      buttons[i].setAttribute("style", "margin: auto;");
      buttons[i].setAttribute("style", "display: block;");
      buttons[i].setAttribute("style", "font-size: 22px");

      if (buttons[i].href.indexOf('survey') != -1) {
        if (buttons[i].href.indexOf('Brazil') == -1 & buttons[i].href.indexOf('France') == -1 & buttons[i].href.indexOf('Mexico') == -1) {
          buttons[i].parentNode.removeChild(buttons[i]);
        }
      }
    }
  };
  xhr.send();
}
