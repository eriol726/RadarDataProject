function list() {
    self = this;
    //---------------------------------------------------------------------------------

    //Define value names and put a tag for the specific value type
    var options = {
        valueNames: ['id', 'numberIDs'],
        item: '<li><h3 class="id"></h3><p class="numberIDs"></p></li>'
    };

    //Dummy list item
    var values = [{
        id: 'Taxi ID: ...',
        numberIDs: "Number of occurrences: ..."
    }];

    //New detailList
    self.detList = new List('detailList', options, values);
    
    //------------------------------------------------------------------------------------------
    this.update = function draw(data, uniqeIdAndRides, marker) {
       
        var uniqueID = [];
        var numberIDs = [];

        //Clear the old list
        self.detList.clear();

        console.log("start, adding items to list")

        data.properties.ids.forEach(function (d, i) {
            
            //Check if maximum number of ids have been pushed
            //Add number of ids
            if (uniqueID.length == 1500) {
                var temp = uniqueID.indexOf(data.properties.ids[i]);
                numberIDs[temp] = numberIDs[temp] + 1;
            }
            //Check if the id exits in the uniqueID array
            //If not push the id into the array
            else if (uniqueID.indexOf(data.properties.ids[i]) == -1) {
                uniqueID.push(data.properties.ids[i]);
                numberIDs.push(1);
            }
            else {
                var temp = uniqueID.indexOf(data.properties.ids[i]);
                numberIDs[temp] = numberIDs[temp] + 1;
            }
            
        })

        //Add to list
        uniqueID.forEach(function (d, i) {
            self.detList.add({
                    id: "Taxi ID: " + uniqueID[i],
                    numberIDs: "Number of occurrences: " + numberIDs[i]
                });
        })

        console.log("done, with adding items to list")

        document.getElementById('detailList').addEventListener('click', function (event) {
        

                // run event listener only once
                event.stopImmediatePropagation();
                    
                var temp = event.target.innerText.split(":");
                var temp2 = temp[1].split("\n");
                var listID = parseFloat(temp2[0]);

                self.marked = true;


                for (var i = 0; i < uniqeIdAndRides.length; i++) {
                    if (uniqeIdAndRides[i].id == listID) {
                        console.log("found id in list")

                        //sending clicked id to update the graphs
                        map1.click(uniqeIdAndRides[i]);

                       break;
                    }
                }
            
        
        }, false);
        
    }
    
}