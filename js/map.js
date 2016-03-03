function map(data) {


    var self = this;

    var ridesAndIds = calculateDrives(data);
    var ridesPerMonth = totalCoustumerPerMonth(data);

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
    var dataWithRides = {type: "FeatureCollection", features: uniqeIdFormat(data,ridesAndIds)};
    
    function uniqeIdFormat(array,ridesAndIds ) {
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
                "hired" : d.hired,
                "customers": ridesAndIds[0][i]
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
                  .data(dataWithRides.features)
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
            
              
            //Draw data id's coordinates on google.maps
            function transform(d) {
                d = new google.maps.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]);
                d = projection.fromLatLngToDivPixel(d);
                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px");
            }

            //On click highlight the clicked dot by lower the opacity on all others. 
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

                    
                    var transformedPoints = [];

                    points.forEach(function(d){
                        

                        var coord = {lat: d[1], lng: d[0]};
                      
                        transformedPoints.push(coord);
                    })
                    console.log(transformedPoints)
                  
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
        
        var startTime = value[0].getTime();
        var endTime = value[1].getTime();

        d3.selectAll("circle").style("opacity", function(d) {

            var time = new Date(d.properties.time);
          
         return (startTime <= time.getTime() && time.getTime() <= endTime) ? 1 : 0;
        });
            
    };

    //Function that filter to only pickups and dropoffs.
    this.filterUpOff = function (value) {

        console.log("SORTED: " + value);
        //Sort data by id
        var data = value;
        //data.sort();

        //Check if hired

        //Set opacity to 0 for all dots between hired and not hired
    };



    /*Call a given datamining algorithm
    -----------------------------------------------------------------
    Density based clustering algorithms
    - Density-based spatial clustering of applications with noise (DBSCAN)
    - Ordering points to identify the clustering structure (OPTICS)

    Tree classifier
    - CART (binary tree, find patterns in hire)

    Screen Space Quality Method
    */
    this.cluster = function () {

        //OPTICS
        opticsArray = optics(data, distRad, minPts);
        
    };


    this.getDataWithRides = function () {

        return dataWithRides;
        
    };

    this.getRidesPerMonth = function () {

        return ridesPerMonth;
        
    };


    //Prints features attributes
    function printInfo(value) {
        var elem = document.getElementById('info');
        elem.innerHTML = "Place: " + value["place"] + " / Depth: " + value["depth"] + " / Magnitude: " + value["mag"] + "&nbsp;";
    }

    function calculateDrives(data)
    {   
       var nrSpecificIds =[];
        
       var dataSorted = data;
       sortByKey(dataSorted,"id");
       
       var counter = 0;
       var map = [];
        //create id specific map 
       var count = 0;
       do{
            map[counter] = [];
            var inner = 0;

            while(data[count].id == dataSorted[count+1].id){
                map[counter][inner] = dataSorted[count];
                count++;
                inner++;
            }
           
            nrSpecificIds[counter] = dataSorted[count].id;
            map[counter][inner] = dataSorted[count];
            count++;
            counter++;

        }
        while( !(typeof dataSorted[count+1] == "undefined" ))
    


        //map contains an list of arrays
        //where eah array contains an array with
        //an specific id
        //
        // [id 1]              // [id2]
        //[all objs with id1]  // [all objs with id2]
        var format = d3.time.format.utc("%Y-%m-%d %H:%M:%S").parse;
        var data2 = [];
        var index = 0;
        map.forEach(function(d,i){
            var date2 = [];
            data2[i] = [];
            var data3 = sortByKey(d,"date")
            data2[i] = data3;
        })
        //same construction as map sorted on time
        var nrOfRides = [];
        
        data2.forEach(function(d,j)
        {   
            nrOfRides[j] = 0;
            d.forEach(function(di,i)
            {
                
                if(i+1 < d.length)
                {   
                    
                    if(d[i].hired == "f" && d[i+1].hired == "t")
                    {   
                       // console.log("ff")
                        nrOfRides[j]++;
                    }
                }
            })
        })
        //console.log(data2)
        //console.log(nrOfRides[5])
        var selfData = [];
        self.selfData = data2;
        return [nrOfRides,nrSpecificIds]


    }

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }


    function totalCoustumerPerMonth(data){
        var sortedDataByTime = data;
        sortByKey(sortedDataByTime,"date");
        var ridesPerMonthArray = countCustumersPerDay(sortedDataByTime);

        return ridesPerMonthArray;
    }

    function countCustumersPerDay(data){

        var ridesPerMonth = [];
        var monthObject = [];
       
        for (var n = 0; n < 31; n++) {
            
            // define time interval for current day
            var dateStringBegin = "2013-03-"+(n+1)+" 00:00:00";
            var dateStringEnd = "2013-03-"+(n+1)+" 23:59:59";

            var beginTime = new Date(dateStringBegin);
            var endTime = new Date(dateStringEnd);
            
            //reset the rides for current day
            
            var rides = 0;

            data.forEach(function (d ) {
                var currentDate = new Date(d.date);
                
                //find rides for current day
               if(beginTime.getTime() <= currentDate.getTime() &&   endTime.getTime() >= currentDate.getTime()  ){
                  rides++;
               }
            });
            
            //add all the rides for current day
            if ((n+1)>9){
                var objectDateString = "2013-03-"+(n+1)+" 00:00:00";
            }
            else{
                var objectDateString = "2013-03-0"+(n+1)+" 00:00:00";
            }
            var objectDate = new Date(objectDateString);
            monthObject.push({date:  objectDateString, rides: rides});
            
            //ridesPerMonth[n] = monthObject;

        }

      return monthObject
        
    }   


}
 