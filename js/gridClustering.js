




function gridClustering(data){
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
					nrPointsInGrid
					var coord = {lat: centroidY[n][j], lng: centroidX[n][j], nrPoints:nrPointsInGrid,ids:ids, date: timeStamp,hired:hired};
					centroidPoints.push(coord);

			}
		}
	}
	//console.log(centroidPoints)
	//convertArrayOfObjectsToCSV(centroidPoints);
	
	console.log(centroidPoints)

	//downloadCSV(centroidPoints);
	return centroidPoints;




}


//http://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/
function convertArrayOfObjectsToCSV(args) {  
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }
	
	//http://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/
	function downloadCSV(args) {  
        var data, filename, link;
        var csv = convertArrayOfObjectsToCSV({
            data: args
        });
        if (csv == null) return;

        filename = args.filename || 'reducedData.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }

