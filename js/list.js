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
        id: 'ID: ...',
        numberIDs: "Recurring dates: ..."
    }];

    //New detailList
    var detList = new List('detailList', options, values);

    //------------------------------------------------------------------------------------------
    this.update1 = function draw(data, uniqeIdAndRides, marker) {
       
        var uniqueID = [];
        var numberIDs = [];

        //Clear the old list
        detList.clear();

        data.properties.ids.forEach(function (d, i) {
            //Check if the id exits in the uniqueID array
            //If not push the id into the array
            if (uniqueID.length != 1500 && uniqueID.indexOf(data.properties.ids[i]) == -1) {
                uniqueID.push(data.properties.ids[i]);
                numberIDs.push(1);
            }
            else {
                var temp = uniqueID.indexOf(data.properties.ids[i]);
                numberIDs[temp] = numberIDs[temp] + 1;
            }
            
        })

        uniqueID.forEach(function (d, i) {
            detList.add({
                    id: "ID: " + uniqueID[i],
                    numberIDs: "Recurring dates: " + numberIDs[i]
                });
        })

        document.getElementById('detailList').addEventListener('click', function (event) {
            if ('LI' != event.target.tagName) return;
            var temp = event.target.innerText.split(":");
            var temp2 = temp[1].split("\n");
            console.log(temp2[0]);
            //alert(temp2[0])
            var listID = parseFloat(temp2[0]);

            uniqueID.indexOf(listID);
            self.marked = true;
            var tempID = 0;
            uniqeIdAndRides.forEach(function (d, i) {
                
                if (d.id == listID) {
                    console.log(i)
                    map1.click(marker, uniqeIdAndRides, i);
                }
            })
            
        }, false);
        
    }
    
}