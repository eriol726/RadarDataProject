//Focus+Context via Brushing
//http://bl.ocks.org/mbostock/1667367

//mData = displayd data when one point is marked
//aData = displayd data when all point is marked
//aData = displayd data when all point is marked


function area(aData) {
    var self = this;
    
    console.log("aData: ", aData[0]);
    var areaDivSmall = $("#areaSmall");
    var areaDivMedium = $("#areaMedium");
    var areaDivBig = $("#areaBig");
   


    var margin = { top: 40, right: 40, bottom: 40, left: 40 },
        margin2 = { top: areaDivSmall.height() - 50, right: 40, bottom: 20, left: 40 },

        width = areaDivBig.width() - margin.left - margin.right,
        width2 = areaDivSmall.width() - margin2.left - margin2.right,

        height = areaDivBig.height() - margin.top - margin.bottom,
        height2 = areaDivSmall.height() - margin2.top - margin2.bottom;

    //Sets the data format
    var format = d3.time.format.utc("%Y-%m-%d %H:%M:%S").parse;//Complete the code

    console.log("Data: ", aData);
    //Sets the scales 
   
    var x = d3.time.scale().range([0, width]),
        x2 = d3.time.scale().range([0, width2]),
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
                return x( format(d.date));//Complete the code
            })
            .y0(height)
            .y1(function (d) {
                return y(d.rides);//Complete the code
            });
    
    //Creates the small chart        
    var area2 = d3.svg.area()
            .interpolate("step")
            .x(function (d) {
                return x2(format(d.date));//Complete the code
            })
            .y0(height2)
            .y1(function (d) {
                return y2(d.rides);//Complete the code
            });
    
    //Assings the svg canvas to the area div
    var svgSmall = d3.select("#areaSmall").append("svg")
            .attr("width", width2 + margin2.left + margin2.right)
            .attr("height", height2 + margin2.top + margin2.bottom);

    var svgBig = d3.select("#areaBig").append("svg")
            .attr("width",  width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
    
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
    x.domain(dimensions = d3.extent(aData[0].month.map(function(d) {  return format(d.date); })));
    y.domain(dimensions2 = d3.extent(aData[0].month.map(function(d) { return parseFloat(d.rides); })));
    //Initializes the axis domains for the small chart
    x2.domain(x.domain());
    y2.domain(y.domain());

    //console.log(data.features)
    //Appends the big chart to the focus area
    focus.append("path")
            .datum(aData[0].month)
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
            .datum(aData[0].month)
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


        console.log("map1: ", map1);
        map1.filterTime(brush.extent());
    }



    this.lineData = function(){
        var lineData = [];
      
        map1.selfData.forEach(function(d,j){
            if(d[0].id == map1.markedID){
                d.forEach(function(di,i){
                    lineData.push([parseFloat(di.x_coord), parseFloat(di.y_coord)]);
                })
            }
        })
        return lineData;

    }

    this.update1 = function(data){
        console.log("update: ", data)
        
         //var svg = d3.select("body").transition();

          //Initializes the axis domains for the big chart
    x.domain(dimensions = d3.extent(data[0].month.map(function(d) {  return format(d.date); })));
    y.domain(dimensions2 = d3.extent(data[0].month.map(function(d) { return parseFloat(d.rides); })));
    //Initializes the axis domains for the small chart
    x2.domain(x.domain());
    y2.domain(y.domain());
    

    //remove past static in graphs
    focus.selectAll("path").remove()    
    focus.select("g")
            .attr("class", "x axis").remove()
    focus.select("g")
            .attr("class", "y axis").remove() 
    context.selectAll("path").remove()       
    context.select("g")
            .attr("class", "x axis").remove()

    focus.append("path")
            .datum(data[0].month)
            .attr("clip-path", "url(#clip)")
            .attr("d", area);
    
    // append statics for marked point
    //Appends the x axis 
    focus.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
    context.select("g")
            .attr("class", "x brush").remove()
    context.selectAll("rect").remove()
    //Appends the y axis 
    focus.append("g")
            .attr("class", "y axis")
            .call(yAxis);

    //Appends the small chart to the focus area        
    context.append("path")
            .datum(data[0].month)
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


    }

    
   
}
