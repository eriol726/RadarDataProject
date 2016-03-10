self = this;
var area1;
var map1;
var list1;

//this code was used to run the gridclusering
// if you do not have a lot of time run it on smal 
//samples of the data. it created a csv fil without a header
// "y_coord";"x_coord";"numberOfPoints","ids";"date";"hired"

/*
dsv = d3.dsv(";", "text/plain");
dsv("data/YourDataFile.*", function(data){
	gridData = gridClustering(data);
})	
*/

var thenBy1;
	
	d3.csv("data/cities.csv", function (data) {

	   
	    	map1 = new map(data);
	    
		
});
