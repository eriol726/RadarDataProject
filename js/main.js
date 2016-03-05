self = this;
var area1;
var map1;
var thenBy1;

d3.csv("data/cities.csv", function (data) {
	var graphData = [];
	for (var i = 0; i<  500; i++) {

		var id = data[i].ids.split(',');
		var hired = data[i].hired.split(',');
		var date = data[i].date.split(',');
		for(var n = 0; n < hired.length; n++){

			graphData.push({date: date[n], id:parseFloat(id[n]) , hired:hired[n]});
		}
	}



    map1 = new map(data,graphData);
    //var pushedData = map(data);
   // console.log("pusedData: ", pushedData);

   //area1 = new area(map1.getData());
 	

 });

