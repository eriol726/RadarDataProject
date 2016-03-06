
function map(data, graphData) {
   // area2 = new area();


    var markedTaxi = 0;
    var uniqeTaxiData;
    var self = this;
    
    //Set threshold for circle radius depending on number of ids (LARGE, LARGER, LARGEST)
    const LARGE = 500, LARGER = 1500, LARGEST = 15000;

    var uniqeIdAndRides = totalCoustumerForTaxi(graphData);
    var TotalRidesPerDay = totalCoustumerPerMonth(graphData);

    console.log("uniqeIdAndRides: ", uniqeIdAndRides);
    console.log("ridesPerMonth", TotalRidesPerDay[0])

   // console.log("uniqeIdAndRides: ", uniqeIdAndRides[0]);


    var mapDiv = $("#map");

    //Red, Green
    var color = ["#FF0000", "#008000"];

    var pickUp = true;
    var dropOff = true;

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
        disableDefaultUI: false,
        maxZoom: 18,
        minZoom: 7,
        streetViewControl: false,
        rotateControl: false,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });


    //Define tooltip div
    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);



    //Format to geoData
    var newStructData = {type: "FeatureCollection", features: uniqeIdFormat(data)};
    
    // create a new object array with an other structor, includeing customers 
    function uniqeIdFormat(array,ridesAndIds ) {
        var newData = [];
        array.map(function (d, i) {
            
            var idIndex =0;

            // find total same ID in uniqeIdAndRides as in Data, take the index and use it to get hiredRides
            //3uniqeIdAndRides.forEach( function(Dsmall,n){
            //    if(d.id == Dsmall.id )
            //        idIndex = n;
            //});

            newData.push({
                type: "Feature",
                geometry: {
                    type: 'Point',
                    coordinates: [d.x_coord, d.y_coord],
                    numberOfPoints: d.numberOfPoints

                },
                "properties" : {
                "ids" : d.ids.split(','),
                "date" : d.date.split(','),
                "hired" : d.hired.split(',')
                }
            });
        });

        return newData;
    }

    var area1 = new area(TotalRidesPerDay);


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
                  .data(newStructData.features)
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

            //Changes the circles size depending on how many ids there are in a circle
            marker.selectAll("circle").attr("r", function (d) {
                if (d.properties.ids.length > LARGE && d.properties.ids.length < LARGER) {
                    return 6;
                }
                else if (d.properties.ids.length > LARGEST) {
                    return 10;
                }
                else
                    return 3;
            })

            var rr = {};
            var upOff = {};
            var id;
            marker.selectAll("circle").style("opacity", function (d, i) {
              //  console.log("-----------------" + d.properties.id);
               //console.log("Hired: " + d.properties.hired);
                //console.log("ID: " + d.properties.id);

                if (id != d.properties.ids) {
                    //console.log("OLIKA ID")
                    //console.log("ID" + id)
                    //console.log("DATA ID" + d.properties.id)
                    pickUp = true;
                    dropOff = true;
                }

                //Picks up customer
                if (d.properties.hired == "t" && pickUp) {
                    //console.log("FÅR KUND");
                    rr[d.properties.id] = 1;
                    upOff[d.properties.id] = color[1];
                    id = d.properties.id;
                    pickUp = false;
                    return 1;
                }
                //Drops off customer
                else if (d.properties.hired == "f" && dropOff) {
                    //console.log("SLÄPPER AV KUND");
                    rr[d.properties.id] = 1;
                    upOff[d.properties.ids] = color[0];
                    id = d.properties.ids;
                    pickUp = true;
                    dropOff = false;
                    return 1;
                }
                //Taxi hired and already picked up customer
                else if (d.properties.hired == "t" && id == d.properties.id) {
                    //console.log("HAR KUND");
                    rr[d.properties.id] = 0.3;
                    return 0;
                }
                //Taxi not hired and already droped off customer
                else if (d.properties.hired == "f" && id == d.properties.id) {
                    //console.log("HAR INGEN KUND");
                    rr[d.properties.id] = 0.3;
                    return 0;
                }
                //Incase something slips through
                else
                    rr[d.properties.id] = 1;
                    //console.log("ÖVRIGT")
                    return 1;
            })

            //Marks circles red if the drop off a customer and green if the picked up a customer
            marker.selectAll("circle").style("fill", function (d) { return upOff[d.properties.id] });

            marker.on("click",  function(d){
                    
                var cc = {};
                //var id = d.properties.ids.split(",");
                console.log("CLICK: " + d.properties.hired.length)
               
                var idIndex =0;
                uniqeIdAndRides.forEach( function(dUnique,n){
                   if(d.id == dUnique.id )
                        idIndex = n;
                    console.log("hej")
                });

                markedTaxi = 1;

                area1.update1([uniqeIdAndRides[idIndex]])  


                    
                if(! (typeof self.flightPath == "undefined")){removeLine();}
                    
                var timeUpOff = [];
                var count = 0;
                //On click highlight the clicked dot by lower the opacity on all others.
                marker.selectAll("circle")
                    .style("opacity", function(mark, i){

                          
                    if(mark.properties.id == d.properties.id) {

                        //Saves the time for all the dots with the same id.
                        timeUpOff[count] = mark.properties.time;
                        count++;

                        if (mark.properties.hired == "t") {
                            cc[d.properties.id] = color[1];
                        }
                        else
                            cc[d.properties.id] = color[0];
                          
                        var markedID = 0;
                        self.markedID = d.properties.id;

                        return 1;
                    }
                    else 
                        return 0.1;
                }) 

                marker.selectAll("circle").style("fill", function (d) { return upOff[d.properties.id] });
               

 
                          
                /* Commented for now. It collides with the opacity change in onclick.
                //updates opacity
                marker.selectAll("circle").style("opacity", function (d) {
                    //console.log("-----------------");
                    //console.log("Hired: " + d.properties.hired);
                    //console.log("ID: " + d.properties.id);
                    //console.log("RR: " + rr[d.properties.id]);
                    return rr[d.properties.id]
                });*/
/*
                var points = area1.lineData(); 

                console.log("Points: " + points)

                    
                var transformedPoints = [];

                points.forEach(function(d){
                        

                    var coord = {lat: d[1], lng: d[0]};
                      
                    transformedPoints.push(coord);
                })
                console.log("Transformedpoints: " + transformedPoints)
                  
                self.flightPath = new google.maps.Polyline({
                            path: transformedPoints,
                            geodesic: true,
                            strokeColor: '#FF0000',
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                });
                addLine();*/

                //Tooltip ths shows information for the clicked circle

                //if (timeUpOff[timeUpOff.length - 1] == 'index.html') {
                    
                //} else {
                    //something else.
                //}

                var timeFirst = new Date(timeUpOff[0]);
                var timeLast = new Date(timeUpOff[Number.parseInt(timeUpOff.length) - 1]);

                var col = cc[d.properties.id];

                div.transition()
                   .duration(150)
                   .style("opacity", .9);
                div.html(

                    //Information box that shows id, and the time for the pick up and drop off
                    "<p>ID: " + d.properties.id + "</p>" +
                    "<p>Start: " + timeFirst.getHours() + ":" + timeFirst.getMinutes() + ":" + timeFirst.getSeconds() + "</p>" +
                    "<div id='dot' style='background:" + col + "' ></div>" + "<div id='dot' style='background:" + col + "' ></div>" + "<div id='dot' style='background:" + col + "' ></div>" +
                    "<p>End: " + timeLast.getHours() + ":" + timeLast.getMinutes() + ":" + timeLast.getSeconds() + "</p>")

                   .style("left", (d3.event.pageX) + 10 + "px")
                   .style("top", (d3.event.pageY - 30) + "px");

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

        //console.log("SORTED: " + value);
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


    this.getUniqeTaxi = function () {

        return uniqeIdAndRides;
        
    };

    this.getData = function (d) {

        if(markedTaxi != 0){
            console.log("marked");
            return d;
        }
        else{
            console.log("all");
            return TotalRidesPerDay;
        }
        
    };



    function totalCoustumerForTaxi(data)
    {    
        var dataSorted = data;

       //sort first by id, then by date
        var s = firstBy(function (v1, v2) { return v1.id < v2.id ? -1 : (v1.id > v2.id ? 1 : 0); })
                 .thenBy(function (v1, v2) { 

                    var v1Date = new Date(v1.date);
                    var v2Date = new Date(v2.date);

                    return v1Date.getTime() - v2Date.getTime(); 
        });
        
        dataSorted.sort(s);


        var uniqeIdAndRides =[];
        var hiredRides = 0;
        var BreakException= {};
        var month = [];
        

        // counting hired rides and push total hired rides for each ID into a new array

        var n = 0;


        var count = 0;
        for(var i = 1; i < dataSorted.length; i++){
            // check if we are out of bounds


            var currentDate = new Date(dataSorted[i].date);
            var prevDate= new Date(dataSorted[i-1].date);
            var currentDay = currentDate.getDate();
            var prevDay = prevDate.getDate();

            
            if(i+1 == dataSorted.length){
                break;
            }
            // define time interval for current day
            
            
            // check absolut first element
            if (i ==1 && dataSorted[i-1].hired == "t") {
                 hiredRides++;
            }

            //check first element in a block, hapends when id changeing
            if (dataSorted[i-1].id != dataSorted[i].id){

                if(dataSorted[i].hired == 't' ){
                    hiredRides++;
                }
            }

            // this is a date block, hapends when prev id is same as current
            if(currentDay ==  prevDay && dataSorted[i-1].id == dataSorted[i].id ){

                //check if next taxi is hired in same block
                if(dataSorted[i].hired == 'f' &&  dataSorted[i+1].hired == 't' ){
                    hiredRides++;
                }
                
            }



            // push hiredRides for same ID into monthArray when day i changed
            // dont taka care of singel sampels
            if(currentDay !=  prevDay && dataSorted[i-1].id == dataSorted[i].id){
                month = [];
                for(var n = 0; n < 30; n++){
                     var dateString = "2013-03-"+n+" 00:00:01";
                    var monthDate = new Date(dateString);
                    if(n+1 == currentDay){
                        month[n] = {date: dateString, rides:  hiredRides};
                    }
                    else{
                        month[n] = {date: dateString, rides:  0};
                    }
                }
                // console.log("currentDay: ", prevDay);
             
            }

            // push month to uniqeID object array
            if(dataSorted[i-1].id != dataSorted[i].id){

                uniqeIdAndRides.push({id: dataSorted[i].id, month: month});

                hiredRides=0;
                count++;
            }
            


            //console.log("utanför: ", uniqeIdAndRides[count].month[4].rides) ;
        }


    return uniqeIdAndRides;

    }


    function addLine() {
      self.flightPath.setMap(map);  
    }

    function removeLine() {
      self.flightPath.setMap(null);
    }

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }


    function totalCoustumerPerMonth(data){

        //sorting data by date
        var dataSorted = data;

       //sort first by id, then by date
        var s = firstBy(function (v1, v2) { return v1.id < v2.id ? -1 : (v1.id > v2.id ? 1 : 0); })
                 .thenBy(function (v1, v2) { 

                    var v1Date = new Date(v1.date);
                    var v2Date = new Date(v2.date);

                    return v1Date.getTime() - v2Date.getTime(); });
        
        dataSorted.sort(s);

        var uniqeIdAndRides =[];
        var BreakException= {};
        

        var ridesPerMonth = [];
        var monthObject = [];
        var totalIds = [];
       
        for (var n = 0; n < 31; n++) {
            
            // define time interval for current day
            var dateStringBegin = "2013-03-"+(n+1)+" 00:00:00";
            var dateStringEnd = "2013-03-"+(n+1)+" 23:59:59";

            var beginTime = new Date(dateStringBegin);
            var endTime = new Date(dateStringEnd);
            
            //reset the rides for current day
            
            var hiredRides = 0;
            try{
                dataSorted.forEach(function (d,i ) {
                    var currentDate = new Date(d.date);
                    
                    //find rides for current day
                    if(beginTime.getTime() <= currentDate.getTime() &&   endTime.getTime() >= currentDate.getTime()  ){
                           
                        if(typeof dataSorted[i+1] === "undefined"){
                            throw BreakException;
                        } 
                        //check if next taxi is hired in same block
                        else if (dataSorted[i+1].id == dataSorted[i].id){
                            if(dataSorted[i].hired == 'f' &&  dataSorted[i+1].hired == 't'){
                                hiredRides++;
                            }
                        }
                        //check last sample in a block
                        else if (dataSorted[i+1].id != dataSorted[i].id){
                            // if it is a uniqe id and hired is true, count one 
                            if(dataSorted[i].hired == 't'  && dataSorted[i-1].id != dataSorted[i].id){
                                hiredRides++;
                            }
                        }
                    }
                });
            }catch(e) {
                if (e!==BreakException) throw e;
            } 
            
            //add all the rides for all taxis for current day
            var objectDateString = "2013-03-"+(n+1)+" 00:00:00";
            var objectDate = new Date(objectDateString);
            monthObject.push({date:  objectDateString, rides: hiredRides});
            

            //ridesPerMonth[n] = monthObject;

        }
        totalIds.push({id: 1, month: monthObject});

      return totalIds
        
    }   

}
 