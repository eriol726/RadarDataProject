//Focus+Context via Brushing
//http://bl.ocks.org/mbostock/1667367

function area(data) {
    var areaDivSmall = $("#areaSmall");
    var areaDivBig = $("#areaBig");

    var ridesAndIds = calculateDrives(data);
   console.log((ridesAndIds[1]))

    var margin = {top: 100, right: 40, bottom: 100, left: 40},
        margin2 = {top: areaDivSmall.height() - 50, right: 40, bottom: 20, left: 40},
        width = areaDivBig.width() - margin.left - margin.right,
        width2 = areaDivSmall.width() - margin2.left - margin2.right,
        height = areaDivBig.height() - margin.top - margin.bottom,
        height2 = areaDivSmall.height() - margin2.top - margin2.bottom;


    //Sets the data format
    var format = d3.time.format.utc("%Y-%m-%d %H:%M:%S").parse;//Complete the code

    //Sets the scales 
   
    var x = d3.scale.linear().range([0, width]),
        x2 = d3.scale.linear().range([0, width2]),
        y = d3.scale.linear().range([height, 0]),
        y2 = d3.scale.linear().range([height2, 0]);
    
    //Sets the axis 
    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
            xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
            yAxis = d3.svg.axis().scale(y).orient("left");
    
    //Assigns the brush to the small chart's x axis
    var brush = d3.svg.brush()
            .x(x2)
            .on("brush", brush);
    


    //Creates the big chart
    var area = d3.svg.area()
            .interpolate("step")
            .x(function (d) {
                return x(parseFloat(d.id));//Complete the code
            })
            .y0(height)
            .y1(function (d) {
                return y(parseFloat(d.id));//Complete the code
            });
    
    //Creates the small chart        
    var area2 = d3.svg.area()
            .interpolate("step")
            .x(function (d) {
                return x2(parseFloat(d.id));//Complete the code
            })
            .y0(height2)
            .y1(function (d) {
                return y2(parseFloat(d.id));//Complete the code
            });
    
    //Assings the svg canvas to the area div
    var svgSmall = d3.select("#areaSmall").append("svg")
            .attr("width", width2 + margin2.left + margin2.right)
            .attr("height", height2 + margin2.top + margin2.bottom);

    var svgBig = d3.select("#areaBig").append("svg")
            .attr("width",  width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom );
    
    //Defines clip region
    svgSmall.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width2)
            .attr("height", height2);

    svgBig.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);
    
    //Defines the focus area
    var focus = svgBig.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //Defines the context area
    var context = svgSmall.append("g")
            .attr("transform", "translate(" + margin2.left + "," +  margin2.top + ")");

    //Initializes the axis domains for the big chart
    x.domain(dimensions = d3.extent(data.map(function(d) { return parseFloat(d.id) })));
    y.domain(dimensions2 = d3.extent(data.map(function(d) { return parseFloat(d.id); })));
    //Initializes the axis domains for the small chart
    x2.domain(x.domain());
    y2.domain(y.domain());

    //Appends the big chart to the focus area
    focus.append("path")
            .datum(data)
            .attr("clip-path", "url(#clip)")
            .attr("d", area);
    
    //Appends the x axis 
    focus.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
    
    //Appends the y axis 
    focus.append("g")
            .attr("class", "y axis")
            .call(yAxis);

    //Appends the small chart to the focus area        
    context.append("path")
            .datum(data)
            .attr("d", area2);
    
    //Appends the x axis 
    context.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);

    //Appends the brush 
    context.append("g")
            .attr("class", "x brush")
            .call(brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", height2 + 7);
    
    
  
     

    //Method for brushing
    function brush() {

        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.select("path").attr("d", area);
        focus.select(".x.axis").call(xAxis);
        //Complete the code

        //map1.filterTime(brush.extent());
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
        
        

        return [nrOfRides,nrSpecificIds]


    }

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }    
   
}
