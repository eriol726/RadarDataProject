var area1;
var map1;

main1 = new main();

self=this;

main1.reset();

function main(){
	this.update = function(data){
	//	console.log(data)
		map1 = new map(data);	
	    //var pushedData = map(data);
	    //console.log("pusedData: ", pushedData);
	    area1 = new area(map1.getPushedData());
	}

	this.reset = function(){
		d3.csv("data/taxi_sthlm_march_2013.csv", function (data) {

		    map1 = new map(data);
		    //var pushedData = map(data);
		    //console.log("pusedData: ", pushedData);
		    area1 = new area(map1.getPushedData());
		});
	}
}