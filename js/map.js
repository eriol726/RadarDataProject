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

    var timeExt = d3.extent(data.map(function (d) {
        return format.parse(d.time);
    }));

    var filterdData = data;

    //Sets the colormap
    var colors = colorbrewer.Set3[10];

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g");

    //Sets the map projection
    var projection = d3.geo.mercator()
            .center([8.25, 56.8])
            .scale(700);

    //Creates a new geographic path generator and assing the projection        
    var path = d3.geo.path().projection(projection);

    //Formats the data in a feature collection trougth geoFormat()
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};
    //console.log("data", geoData.features[0]);
    //Loads geo data
    d3.json("data/world-topo.json", function (error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        draw(countries);
    });

    //Calls the filtering function 
    d3.select("#slider").on("input", function () {
        filterMag(this.value, data);
    });

    //Formats the data in a feature collection
    function geoFormat(array) {
        var data = [];
        array.map(function (d, i) {
            data.push({
                type: "Feature",
                geometry: {
                    type: 'Point',
                    coordinates: [d.lon, d.lat]
                },
                "properties" : {
                "id" : d.id,
                "time" : d.time,
                "magnitude" : d.mag,
                "place" : d.place,
                "depth" : d.depth
                }
            });
        });
        return data;
    }

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

        //draw point        
        var point = g.selectAll("circle")
            .data(geoData.features)
            .enter().append("circle")
            .attr("cx", function (d) { return projection(d.geometry.coordinates)[0]; })
            .attr("cy", function (d) { return projection(d.geometry.coordinates)[1]; })
            .attr("r",2 )
            .attr("class", "showDot")
            .style("fill", "orange");
            

    };

    //Filters data points according to the specified magnitude
    function filterMag(value) {


        d3.selectAll("circle").style("opacity", function(d) {
            if(clustered){
            return (d.magnitude > value ) ? 1 : 0;
          }  
          else{
            return (d.properties.magnitude > value ) ? 1 : 0;
          }
         
        });
    }
    
    //Filters data points according to the specified time window
    this.filterTime = function (value) {
        //Complete the code
        
        
        var startTime = value[0].getTime();
        var endTime = value[1].getTime();

        d3.selectAll("circle").style("opacity", function(d) {
          if(clustered){
            var time = new Date(d.time);
          }  
          else{
            var time = new Date(d.properties.time);
          }
         return (startTime <= time.getTime() && time.getTime() <= endTime) ? 1 : 0;
        });

    };

    //Calls k-means function and changes the color of the points  
    this.cluster = function () {
        //Complete the code
        
        var k = document.getElementById("k").value;
        var clusterProps = [];
        geoData.features.forEach(function(d) {
            clusterProps.push( {  mag: d.properties.mag, 
                                depth: d.properties.depth
            });
        });

       // console.log("clusterProps: ", clusterProps);

        var kmeansRes = kmeans(clusterProps,k);

        var color = d3.scale.category20();
        
        svg.selectAll("circle")
        .data(data)
        .style("fill", function(d, i){ return color(kmeansRes[i]); });

        clustered = true;
    };

    //Zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    //Prints features attributes
    function printInfo(value) {
        var elem = document.getElementById('info');
        elem.innerHTML = "Place: " + value["place"] + " / Depth: " + value["depth"] + " / Magnitude: " + value["mag"] + "&nbsp;";
    }
 