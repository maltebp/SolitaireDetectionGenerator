



$(document).ready(() => {
    document.getElementById('fileInput').addEventListener('change', readFile, false);
});

function loadFile(){
    $('#fileInput').click();
}


function readFile(e) {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = decodeFile;
    reader.readAsText(file);
}


function decodeFile(event){
    var jsonData = JSON.parse(event.target.result);
    console.log(jsonData); 
    decodeDetections(jsonData.detections);
    decodePlacements(jsonData.expectedResults);
}





function decodeDetections(jsonDetectionsData){

    var jsonDetections = jsonDetectionsData.detections;
    jsonDetections.forEach(jsonDetection => {
        var detection = new Card(letterToSuit(jsonDetection.card.suit), jsonDetection.card.value, jsonDetection.x, jsonDetection.y);
        detection.width = jsonDetection.width;
        detection.height = jsonDetection.height;
        detection.setConfidence(jsonDetection.confidence*100);
        addDetection(detection);
    });

}

function decodePlacements(jsonResultsData){

    var tableaus = jsonResultsData.tableaus;
    var i=1;
    tableaus.forEach(tableau => {
        tableau.forEach(cardIdentifier => {
            setPlacement(cardIdentifier, "T"+i);
        });
        i++;
    });

    var foundations = jsonResultsData.foundations;
    i=1;
    foundations.forEach(cardIdentifier =>{
        if( cardIdentifier !== "" )
            setPlacement(cardIdentifier, "F"+i);
        i++;
    });

    var drawn = jsonResultsData.drawn;
    drawn.forEach(cardIdentifier => {
        setPlacement(cardIdentifier, "D"); 
    });

}
