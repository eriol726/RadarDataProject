function map(data) {
    var self = this;

    //Set threshold for circle radius depending on number of ids (LARGE, LARGER, LARGEST)
    const LARGE = 500, LARGER = 1500, LARGEST = 15000;

    // new structure and sorting
    var graphData = prepareGraphData(data);

    var uniqeIdAndRides = totalCoustumerForTaxi(graphData);

    var TotalRidesPerDay = totalCoustumerPerMonth(graphData);

    var area1 = new area(TotalRidesPerDay);

     //creating a new data structure for map data
    var newStructData = {type: "FeatureCollection", features: mapData(data)};
    
    // create a new object array with an other structure 
    function mapData(array ) {
        var newData = [];
        array.map(function (d, i) {
            
            var idIndex =0;

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

    

    var mapDiv = $("#map");

    //Red, Green
    var color = ["#f03b20"];

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


    var overlay = new google.maps.OverlayView();

    // Add the container when the overlay is added to the map.
    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "stations");
        if(! (typeof self.flightPath == "undefined")){removeLine();}


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

            //Changes the circles' size depending on how many ids there are in a circle
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

            list1 = new list();
            //Marks circles red if the drop off a customer and green if the picked up a customer
            marker.on("click", function (d) {
                list1.update1(d, uniqeIdAndRides, marker);
         
            if(! (typeof self.flightPath == "undefined")){removeLine();}

                var idIndex = 0;

                //find index for marked point
                uniqeIdAndRides.forEach( function(dUnique,n){
                    if(d.properties.ids[0] == dUnique.id ){
                        console.log(dUnique.id);
                        idIndex = n;
                    }
                });

                map1.click(marker, uniqeIdAndRides, idIndex);
        });
    }

        self.click = function (marker, uniqeIdAndRides, idIndex) {

            console.log("IDINDEX: " + idIndex)
                           
        //send marked pont to the graph
        area1.update1([uniqeIdAndRides[idIndex]])  
        
        var cc = {};
                   
        if(! (typeof self.flightPath == "undefined")){removeLine();}
                    
        var timeUpOff = [];
        var count = 0;
        //On click highlight the clicked dot by lower the opacity on all others.

           

        var points = area1.lineData(data, uniqeIdAndRides[idIndex].id); 
        var transformedPoints = [];

        points.forEach(function(d){
            var coord = {lat: d.y_coord, lng: d.x_coord};
            transformedPoints.push(coord);
        })
        // console.log("Transformedpoints: " + transformedPoints)
                
        self.flightPath = new google.maps.Polyline({
            path: transformedPoints,
            geodesic: true,
            strokeColor: '#f03b20',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });


        marker.selectAll("circle")
              .style("opacity", function (di) {
                  var contains = false;
                  for(var i = 0; i < di.properties.ids.length; i++){
                      if(parseFloat(di.properties.ids[i]) == uniqeIdAndRides[idIndex].id){
                          return 0.8;
                      }
                  }                          
                  return 0.2;
                  
              })
        addLine();
 
        }
    }
   

    // Bind our overlay to the map…
    overlay.setMap(map);
 

    //Calls the filtering function 
    d3.select("#slider").on("input", function () {
        filterMag(this.value, data);
    });


    this.filterTime = function (value) {
        if(! (typeof self.flightPath == "undefined")){removeLine();}
        var startTime = value[0].getTime();
        var endTime = value[1].getTime();

        //console.log("startTime", value[0])

        d3.selectAll("circle").style("opacity", function(d) {

            
        for (var i = 0; i < d.properties.date.length; i++){
            var time = new Date(d.properties.date[i]);

            if(startTime <= time.getTime() && time.getTime() <= endTime){
                return 1;
            }           
        }
        return 0;
        
      });
            
    };

    //Function that filter to only pickups and dropoffs.
    this.filterUpOff = function (value) {

        var data = value;
  
    };


    function addLine() {
      self.flightPath.setMap(map);  
    }

    function removeLine() {
      self.flightPath.setMap(null);
    }

    // counting hired rides and push total hired rides for each taxi into a new array
    function totalCoustumerForTaxi(data)
    {    

        var uniqeIdAndRides =[];
        var hiredRides = 0;
        var BreakException= {};

        var month = creatMonthArray();

        for(var i = 1; i < graphData.length; i++){
            // check if we are out of bounds
             if(i+1 == graphData.length){
                break;
            }

            var currentDate = new Date(graphData[i].date);
            var prevDate= new Date(graphData[i-1].date);
            var currentDay = currentDate.getDate();
            var prevDay = prevDate.getDate();

            
            // check absolut first element
            if (i ==1 && graphData[i-1].hired == "t") {
                 hiredRides++;
            }

            //check first element in a block, hapends when id changeing
            if (graphData[i-1].id != graphData[i].id){

                if(graphData[i].hired == 't' ){
                    hiredRides++;
                }
            }

            // this is a date block, hapends when prev id is same as current
            if(currentDay ==  prevDay && graphData[i-1].id == graphData[i].id ){

                //check if next taxi is hired in same block
                if(graphData[i].hired == 'f' &&  graphData[i+1].hired == 't' ){
                    hiredRides++;
                }
                
            }

            // push hiredRides for same ID into monthArray when day i is changed
            // dont taka care of singel sampels
            if(currentDay !=  prevDay && graphData[i-1].id == graphData[i].id){
                //console.log("currentDay: ", currentDay)
                for(var n = 0; n < 31; n++){
                    if(n+1 == currentDay){
                        month[n].rides = hiredRides ;
                    }

                }
                
            }
                // push month to uniqeID object array
            if(graphData[i-1].id != graphData[i].id){
              
                uniqeIdAndRides.push({id: graphData[i].id, month: month});
                month = creatMonthArray();
                hiredRides=0;
            }           
        }
      
    return uniqeIdAndRides;

    }

    // pushing in total hired rides for all taxis into an object array
    function totalCoustumerPerMonth(data){

        var uniqeIdAndRides =[];
        var BreakException= {};
        

        var ridesPerMonth = [];
        var monthObject = [];
        var totalIds = [];
       
        for (var n = 0; n < 31; n++) 
        {
            // define time interval for current day
            var dateStringBegin = "2013-03-"+(n+1)+" 00:00:00";
            var dateStringEnd = "2013-03-"+(n+1)+" 23:59:59";

            var beginTime = new Date(dateStringBegin);
            var endTime = new Date(dateStringEnd);
            
            //reset the rides for current day
            
            var hiredRides = 0;
            try{
                graphData.forEach(function (d,i ) {
                    var currentDate = new Date(d.date);
                    
                    //find rides for current day
                    if(beginTime.getTime() <= currentDate.getTime() &&   endTime.getTime() >= currentDate.getTime()  ){
                           
                        if(typeof graphData[i+1] === "undefined"){
                            throw BreakException;
                        } 
                        //check if next taxi is hired in same block
                        else if (graphData[i+1].id == graphData[i].id){
                            if(graphData[i].hired == 'f' &&  graphData[i+1].hired == 't'){
                                hiredRides++;
                            }
                        }
                        //check last sample in a block
                        else if (graphData[i+1].id != graphData[i].id){
                            // if it is a uniqe id and hired is true, count one 
                            if(graphData[i].hired == 't'  && graphData[i-1].id != graphData[i].id){
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

        }
        // must do this for being able to call d.month in area()
        totalIds.push({id: 1, month: monthObject});

      return totalIds
        
    }   

    function prepareGraphData(data){
         // creating a new stucture for the dataset without id, date and hired arrays
        var graphData = [];

        for (var i = 0; i<  700; i++) {


            var id = data[i].ids.split(',');
            var hired = data[i].hired.split(',');
            var date = data[i].date.split(',');
            for(var n = 0; n < hired.length; n++){

                graphData.push({date: date[n], id:parseFloat(id[n]) , hired:hired[n]});
            }
        }
        
        //sort first by id, then by date
        var s = firstBy(function (v1, v2) { return v1.id < v2.id ? -1 : (v1.id > v2.id ? 1 : 0); })
                .thenBy(function (v1, v2) { 

                    var v1Date = new Date(v1.date);
                    var v2Date = new Date(v2.date);
                    return v1Date.getTime() - v2Date.getTime(); 
        });

            
        graphData.sort(s);

        return graphData;
    }

    function creatMonthArray(){
        month = [];
         for(var n = 0; n < 31; n++){    
            var dateString = "2013-03-"+(n+1)+" 00:00:01"; 
            month[n] =  {date: dateString, rides:  0};
        }

        return month;
    }

}

