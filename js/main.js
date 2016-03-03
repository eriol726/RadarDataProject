var area1;
var map1;
var thenBy1;

d3.csv("data/taxi_sthlm_march_2013.csv", function (data) {

    map1 = new map(data);
    //var pushedData = map(data);
   // console.log("pusedData: ", pushedData);

    area1 = new area(map1.getDataWithRides(), map1.getRidesPerMonth());
});

