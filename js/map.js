function map(data) {

    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;

    var clustered = false;

    var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");


    //Sets the map projection
    var projection = d3.geo.mercator()
        .center([20, 55 ])
        .scale(800);

    


            //.center([8.25, 56.8])
            //.scale(700);

    //Creates a new geographic path generator and assing the projection        
    var path = d3.geo.path()
                .projection(projection);


    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g");
    
    //console.log("data", geoData.features[0]);
    //Loads geo data
    d3.json("data/uk.json", function (error, uk) {
        if (error) return console.error(error);
        console.log("test", data);
        svg.selectAll(".subunits")
          .datum(topojson.feature(uk, uk.objects.subunits))
          .enter().append("path")
          .attr("d", path)
          
    });

    //Calls the filtering function 
    d3.select("#slider").on("input", function () {
        filterMag(this.value, data);
    });



    //Draws the map and the points
    function draw(countries)
    {

        //draw map
        var country = g.selectAll(".country").data(countries)
                    .enter().insert("path")
                    .attr("class", "country")
                    .attr("d", path)
                    .style('stroke-width', 1)
                    .style("fill", "lightgray")
                    .style("stroke", "white");
            

    };



    //Calls k-means function and changes the color of the points  
    this.cluster = function () {
        //Complete the code
        
        
    };

    //Zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        svg.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    //Prints features attributes
    function printInfo(value) {
        var elem = document.getElementById('info');
        elem.innerHTML = "Place: " + value["place"] + " / Depth: " + value["depth"] + " / Magnitude: " + value["mag"] + "&nbsp;";
    }
}
 