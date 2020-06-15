
function buildTableaus(detections, placements){
    var tableaus = []

    // Build each tableau
    for( var i=1; i<=7; i++ ){
        var tableauIdentifer = "T"+i;
        var tableau = []

        // Find cards that are in the tableau
        for( var card in placements ){
            if( placements[card] === tableauIdentifer )
                tableau.push( detections[card] );
        }

        // Sort the tableau according to y value (lowest one first)
        tableau.sort( (detection1, detection2) => detection1.y - detection2.y);

        // Clean the tableau (we extract the card identifer from the detection)
        cleanedTableau = [];
        tableau.forEach(detection => cleanedTableau.push(detection.getIdentifier()));
        tableaus.push(cleanedTableau);
    }
    return tableaus;
}


function buildDrawn(detections, placements){
    var drawn = []

    // Find cards that are drawn cards
    for( var card in placements ){
        if( placements[card] === "D" )
            drawn.push( detections[card] );
    }

    // Sort the tableau according to x value (lowest one first)
    drawn.sort( (detection1, detection2) => detection1.x - detection2.x);

    // Clean the drawn cards
    cleanedDrawn = [];
    drawn.forEach(detection => cleanedDrawn.push(detection.getIdentifier()));

    return drawn;
}


function buildFoundations(detections, placements){
    var foundations = []
    
    // Build each tableau
    for( var i=1; i<=4; i++ ){
        var foundationIdentifier = "F"+i;
        
        // Find cards that are in the tableau
        for( var card in placements ){
            if( placements[card] === foundationIdentifier ){
                foundations.push( detections[card] );
                break;
            }
        }
    }

    cleanedFoundations = [];
    foundations.forEach(detection => cleanedFoundations.push(detection.getIdentifier()));

    return foundations;
}


function buildExpectedResults(cardLabels, placements){

     // Sort the card labels, so we only have one label per card
     // The label with the lowest y-coordinate is chosen
     sortedCardLabels = {};
     cardLabels.forEach(cardLabel => {
         console.log(cardLabel);
         var identifier = cardLabel.getIdentifier();
         if( !(identifier in sortedCardLabels) || sortedCardLabels[identifier].y > cardLabel.y)
             sortedCardLabels[identifier] = cardLabel;    
     });

     var expectedResults = {}

     expectedResults["tableaus"] = buildTableaus(sortedCardLabels, placements);
     expectedResults["foundations"] = buildFoundations(sortedCardLabels, placements);
     expectedResults["drawn"] = buildFoundations(sortedCardLabels, placements);

     return expectedResults;
}



function buildDetections(cardLabels){
    var detections = [];
    
    cardLabels.forEach(label => {
        var detection = {
            x: label.x,
            y: label.y,
            width: label.width,
            height: label.height,
            confidence: label.confidence/100.0,
            card: {suit: label.suit.substring(0,1).toUpperCase(), value: label.value}
        };
        detections.push(detection);
    });
    
    return detections;
}


function buildData(cardLabels, placements, width, height){
    var data = {};
    
    data["detections"] = { detections: buildDetections(cardLabels), width: width, height: height};
    data["expectedResults"] = buildExpectedResults(cardLabels, placements);

    return data;
}



function saveData(cardLabels, placements, width, height){
    if( cardLabels.length === 0 ){
        throw {name: "CardError", message: "You have not defined any card labels yet!"};
    }

    // Check that all cards have placements
    cardLabels.forEach(label => {
        var identifier = label.getIdentifier();
        if( !(identifier in placements) ){
            throw {name: "CardError", message: `The card '${identifier}' does not have a placement yet`};
        }
    });


    var data = buildData(cardLabels, placements, width, height);

    download(JSON.stringify(data), "test.json", "text");

}




// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}