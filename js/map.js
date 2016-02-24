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

    var map = new google.maps.Map(d3.select("#map").node(), {
      zoom: 8,
      center: new google.maps.LatLng(59.3333333, 18.05),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });
        
    
    d3.json("data/stations.json", function(error, data) {
        if (error) throw error;

        var overlay = new google.maps.OverlayView();

        // Add the container when the overlay is added to the map.
        overlay.onAdd = function() {
            var layer = d3.select(this.getPanes().overlayLayer).append("div")
                .attr("class", "stations");

            // Draw each marker as a separate SVG element.
            // We could use a single SVG, but what size would it have?
            overlay.draw = function() {
                var projection = this.getProjection(),
                      padding = 10;

                var marker = layer.selectAll("svg")
                      .data(d3.entries(data))
                      .each(transform) // update existing markers
                    .enter().append("svg")
                      .each(transform)
                      .attr("class", "marker");

                // Add a circle.
                marker.append("circle")
                      .attr("r", 4.5)
                      .attr("cx", padding)
                      .attr("cy", padding);

                // Add a label.
                marker.append("text")
                      .attr("x", padding + 7)
                      .attr("y", padding)
                      .attr("dy", ".31em")
                      .text(function(d) { return d.key; });

                function transform(d) {
                    d = new google.maps.LatLng(d.value[1], d.value[0]);
                    d = projection.fromLatLngToDivPixel(d);
                    return d3.select(this)
                        .style("left", (d.x - padding) + "px")
                        .style("top", (d.y - padding) + "px");
                }
            };
        };

      // Bind our overlay to the map…
      overlay.setMap(map);
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
 