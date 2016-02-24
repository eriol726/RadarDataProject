var area1;
var map1;

d3.csv("data/taxi_sthlm_march_2013.csv", function (data) {

    map1 = new map(data);
    area1 = new area(data);
});

