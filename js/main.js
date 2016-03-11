/*******************************************************
Authors: Pelle Serander, Jens Jakobsson and Erik Olsson.
Last Updated: 2016-03-11

The code is based on the skeleton program found in lab 3
of the course TNM048 at Linköpings Univeristy year 2016.

http://staffwww.itn.liu.se/~jimjo/courses/TNM048/

*********************************************************/

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
