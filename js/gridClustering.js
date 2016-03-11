/*******************************************************
Authors: Pelle Serander, Jens Jakobsson and Erik Olsson.
Last Updated: 2016-03-11

*********************************************************/

function gridClustering(data) {
var stepX = 0;
	var stepY = 0;
	var xMax = 0;
	var yMax = 0;
	var xMin = 1110;
	var yMin = 1110;
	var centroidX = [];
	var centroidY = [];
	var ids = [];
	var timeStamp = [];
	var hired = [];

	//Find corners
	data.forEach(function(d){
		if( parseFloat(d.x_coord) > xMax){
			xMax = parseFloat(d.x_coord);
		}
		if(parseFloat(d.x_coord) != 0 && parseFloat(d.x_coord) < xMin){
			xMin = parseFloat(d.x_coord);
		}
		if(parseFloat(d.y_coord) > yMax){
			yMax = parseFloat(d.y_coord);
		}
		if(parseFloat(d.y_coord) != 0 && parseFloat(d.y_coord) < yMin){
			yMin = parseFloat(d.y_coord);
		}
	})


	console.log(xMax +" : " + xMin)
	console.log(yMax+ " : " + yMin)


	//steg i x o y
	var gridSize = 100;
	stepX = (xMax-xMin)/gridSize;
	stepY = (yMax-yMin)/gridSize;
	var nrPointsInGrid = 0;
	var centroidPoints = [];
	

	//sök igenom alla områden och beräkna medelvärdet
	for(var n = 0 ; n < gridSize; n++)
	{ 
		centroidX[n] = [];
		centroidY[n] = [];

		for( var j = 0; j < gridSize; j++){
			centroidX[n][j] = 0;
			centroidY[n][j] = 0;
		
			ids = [];
			timeStamp = [];
			hired = [];
			nrPointsInGrid = 0;
			data.forEach(function(d, l){
				if( d.x_coord <(xMin + stepX*(n+1)) && d.x_coord > (xMin+(n)*stepX)
				&&  d.y_coord <(yMin + stepY*(j+1)) && d.y_coord > (yMin+(j)*stepY))
				{	
					ids[nrPointsInGrid] = 0;
					
					ids[nrPointsInGrid] = parseFloat(d.id);
					timeStamp[nrPointsInGrid] = d.date;
					hired[nrPointsInGrid] = d.hired;
					centroidX[n][j] += parseFloat(d.x_coord);
					centroidY[n][j] += parseFloat(d.y_coord);
					nrPointsInGrid++;
				}
			})
			if(nrPointsInGrid != 0){
				//console.log(nrPointsInGrid)
					centroidX[n][j] = centroidX[n][j]/nrPointsInGrid;
					centroidY[n][j] = centroidY[n][j]/nrPointsInGrid;
					
					var coord = {lat: centroidY[n][j], lng: centroidX[n][j], nrPoints:nrPointsInGrid,ids:ids, date: timeStamp,hired:hired};
					centroidPoints.push(coord);

			}
		}
		console.log((n+1) + "% done")
	}
	
	
	exportData(centroidPoints);
	
	

	return centroidPoints;



}
//https://github.com/agershun/alasql
function exportData(centroidPoints) {
     alasql("SELECT * INTO CSV('cities.csv') FROM ?",[centroidPoints]);
}
