




function gridClustering(data){
	var stepX = 0;
	var stepY = 0;
	var xMax = 0;
	var yMax = 0;
	var xMin = 1110;
	var yMin = 1110;
	var centroidX = [];
	var centroidY = [];

	//hitta hörnpunkter
	data.forEach(function(d){
		if( parseFloat(d.x_coord) > xMax){
			xMax = parseFloat(d.x_coord);
		}
		if(parseFloat(d.x_coord) < xMin){
			xMin = parseFloat(d.x_coord);
		}
		if(parseFloat(d.y_coord) > yMax){
			yMax = parseFloat(d.y_coord);
		}
		if(parseFloat(d.y_coord) < yMin){
			yMin = parseFloat(d.y_coord);
		}
	})

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
		
			nrPointsInGrid = 0;
			data.forEach(function(d){
				if( d.x_coord <(xMin + stepX*(n+1)) && d.x_coord > (xMin+(n)*stepX)
				&&  d.y_coord <(yMin + stepY*(j+1)) && d.y_coord > (yMin+(j)*stepY))
				{
					//console.log(true)
					centroidX[n][j] += parseFloat(d.x_coord);
					centroidY[n][j] += parseFloat(d.y_coord);
					nrPointsInGrid++;
				}
			})
			if(nrPointsInGrid != 0){
					centroidX[n][j] = centroidX[n][j]/nrPointsInGrid;
					centroidY[n][j] = centroidY[n][j]/nrPointsInGrid;
					var coord = {lat: centroidY[n][j], lng: centroidX[n][j]};
					centroidPoints.push(coord);
			}
		}
	}
	console.log(centroidPoints.length)
	return centroidPoints;

}