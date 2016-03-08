self = this;
var area1;
var map1;
var list1;
var thenBy1;

	d3.csv("data/cities.csv", function (data) {

	    try{
	    	map1 = new map(data);
	    }
		catch(Exception )
		{
			dsv = d3.dsv(";", "text/plain");
			dsv("data/taxi_sthlm_march_2013.csv", function (data) {
			newData = new gridClustering(data);
		    map1 = new map(newData);

		 	});
		}
});
