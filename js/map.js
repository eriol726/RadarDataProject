function map(data) {


    var self = this;
    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom ;


    //Variable for OPTICS
    var opticsArray = [];
    var distRad;
    var minPts;

    var format = d3.time.format.utc("%Y-%m-%d %H:%M:%S"); 


    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)


    var g = svg.append("g");

    var map = new google.maps.Map(d3.select("#map").node(), {
      zoom: 8,
      center: new google.maps.LatLng(59.3333333, 18.05),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    //Format to geoData
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};
    
    function geoFormat(array) {
        var newData = [];
        array.map(function (d, i) {
            newData.push({
                type: "Feature",
                geometry: {
                    type: 'Point',
                    coordinates: [d.x_coord, d.y_coord]
                },
                "properties" : {
                "id" : d.id,
                "time" : d.date,
                "hired" : d.hired
                }
            });
        });

        return newData;
    }
 
    
    //console.log("data", geoData.features)

    var overlay = new google.maps.OverlayView();

    // Add the container when the overlay is added to the map.
    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "stations");


        // Draw each marker as a separate SVG element.
        // We could use a single SVG, but what size would it have?
        overlay.draw = function() {
            var projection = this.getProjection(),
                  padding = 10;

            var marker = layer.selectAll("svg")
                  .data(geoData.features)
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
                d = new google.maps.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]);
                d = projection.fromLatLngToDivPixel(d);
                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px");
            }

            marker.on("click",  function(d){


                    marker.selectAll("circle")
                        .style("opacity", function(mark){

                        if(mark.properties.id == d.properties.id) {
                            
                            var markedID = 0;
                            self.markedID = d.properties.id;
                           

                            return 1;
                        }
                        else 
                            return 0.1;
                    }) 
                   
                    
                    var points = area1.lineData(); 
                    console.log(points)
                    
                    var transformedPoints = [];

                    points.forEach(function(d){
                        

                        var coord = {lat: d[1], lng: d[0]};
                      
                        transformedPoints.push(coord);
                    })
                    console.log(transformedPoints)
                    var flightPlanCoordinates = [
                        {lat: 37.772, lng: -122.214},
                        {lat: 21.291, lng: -157.821},
                        {lat: -18.142, lng: 178.431},
                        {lat: -27.467, lng: 153.027}
                      ];

  console.log(flightPlanCoordinates)
                    var flightPath = new google.maps.Polyline({
                                path: transformedPoints,
                                geodesic: true,
                                strokeColor: '#FF0000',
                                strokeOpacity: 1.0,
                                strokeWeight: 2
                    });
                    flightPath.setMap(map);                 
            })  

           // d3.selectAll("circle")
             //   .on("click",  function(d) {
               //  return filterID(d.properties.id);
            //});

            
        };
    };

    // Bind our overlay to the map…
    overlay.setMap(map);
 

    //Calls the filtering function 
    d3.select("#slider").on("input", function () {
        filterMag(this.value, data);
    });


    this.filterTime = function (value) {
        //Complete the code
        
        
        var startTime = value[0].getTime();
        var endTime = value[1].getTime();


        d3.selectAll("circle").style("opacity", function(d) {

            var time = new Date(d.properties.time);
          
         return (startTime <= time.getTime() && time.getTime() <= endTime) ? 1 : 0;
        });

    };



    /*Call a given datamining algorithm
    -----------------------------------------------------------------
    Density based clustering algorithms
    - Density-based spatial clustering of applications with noise (DBSCAN)
    - Ordering points to identify the clustering structure (OPTICS)

    Tree classifier
    - CART (binary tree, find patterns in hire)
    */
    this.cluster = function () {

        //OPTICS
        opticsArray = optics(data, distRad, minPts);
        
    };
    

    //Prints features attributes
    function printInfo(value) {
        var elem = document.getElementById('info');
        elem.innerHTML = "Place: " + value["place"] + " / Depth: " + value["depth"] + " / Magnitude: " + value["mag"] + "&nbsp;";
    }

}
 