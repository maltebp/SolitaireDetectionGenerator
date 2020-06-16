

var cardLabels = []

var cardPlacement = {}


var mouseX = 0;
var mouseY = 0;

var dragX = 0;
var dragY = 0;





function removeCardLabel(cardLabel){
    cardLabels.splice(cardLabels.indexOf(cardLabel), 1);
    updateCardPositions();
    updateCardTable();      
}


function updateCardPositions(){    
    console.log(cardLabels);
    cardLabels.sort( (a, b) => parseInt(a.html.style.top.substring(0, a.html.style.top.length-2)) - parseInt(b.html.style.top.substring(0, b.html.style.top.length-2) ));
    
    var board = $("#board");
    board.empty();

    addLines();

    cardLabels.forEach(card => {
        board.append(card.html);
    });
}


function setPlacement(cardIdentifier, placement){
    cardPlacement[cardIdentifier.toUpperCase()] = placement.toUpperCase();
    updateCardTable();
}


function addDetection(detection){
    cardLabels.push(detection);
    $("#board").append(detection.html);
    updateCardTable();
}


function createCardLabel(suit, value, x=-1, y=-1, placement){
    if( x=-1) x = mouseX;
    if( y=-1) y = mouseY;
    var card = new Card(suit, value, x, y)
    cardLabels.push(card);
    $("#board").append(card.html);

    updateCardTable();
}


function noise(){
    cardLabels.forEach( cardLabel => {
        // Randomize position
        cardLabel.updatePosition( cardLabel.x + (Math.random()-0.5)*10, cardLabel.y + (Math.random()-0.5)*10 );
        cardLabel.updateSize( cardLabel.width + (Math.random()-0.5)*5, cardLabel.height + (Math.random()-0.5)*5 )
    });
}


// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

function isCardToken(token){
    for(var i=0; i < SUITS.length; i++){
        if( token.charAt(0) == SUITS[i].charAt(0) ){
            var value = parseInt(token.substring(1, token.length));
            if( value >= 1 && value <= 13){
                return true;
            }
        }
    }
    return false;
}

function consoleInput(input){
    var tokens = input.split(" ");

    if( tokens.length == 1 && (tokens[0].length == 3 || tokens[0].length == 2) ){
        var value = input.substring(1,input.length);
        if( value >= 1 && value <= 13)
        var suitLetter = input.charAt(0);
        for(var i=0; i < SUITS.length; i++){
            if( suitLetter == SUITS[i].charAt(0) ){
                createCardLabel(SUITS[i],value)
            }
        }
    }


    if( tokens.length == 2 && isCardToken(tokens[0]) ){
        var placement = tokens[1];

        if( placement.substring(0,1) == "t" ){
            var value = parseInt(placement.substring(1, placement.length));
            if( value >= 1 && value <= 7 )
                setPlacement(tokens[0], placement);
        }

        if( placement.substring(0,1) == "d" )
            setPlacement(tokens[0], placement);

        if( placement.substring(0,1) == "f" ){
            var value = parseInt(placement.substring(1, placement.length));
            if( value >= 1 && value <= 4 )
                setPlacement(tokens[0], placement);
            
        }

            
    }

    // Set confidence level
    if( tokens.length == 2 ){
        if( tokens[0] == "c" ){
            var confidence = parseInt(tokens[1].substring(0, tokens[1].length));
            if( confidence >= 0 && confidence <= 100 )
            cardLabels.forEach(cardLabel => {
                if( cardLabel.selected )
                    cardLabel.setConfidence(confidence);
            });
        }
    }


    // Save command
    if( tokens.length ==1 && tokens[0] === "save" ){
        try{
            saveData(cardLabels, cardPlacement, 1280, 720);
        }catch(err){
            if( err.name === "CardError")
                alert(err.message);
            else{
                alert("An error occured!");
                throw err;
            }
        }
    }

    if( tokens.length == 1 && tokens[0] === "load" ){
        try{
            loadFile();
        }catch(err){
            if( err.name === "CardError")
                alert(err.message);
            else{
                alert("An error occured!");
                throw err;
            }
        }
    }

    
    // Save command
    if( tokens.length ==1 && tokens[0] === "noise" ){
        noise();
    }

    if( tokens.length == 1 && tokens[0] === "placements" ){
        console.log(cardPlacement);
    }

   

}



function updateCardTable(){
    var cardLabelCount = {};
    cardLabels.forEach(cardLabel => {
        var shortLabel = cardLabel.suit.substring(0,1).toUpperCase() + cardLabel.value;
        if( shortLabel in cardLabelCount )
            cardLabelCount[shortLabel] += 1;
        else
            cardLabelCount[shortLabel] = 1;
    });
    
    $("#cardTable tbody tr").remove();
    
    for( var card in cardLabelCount ){
        var rowString = 
            "<tr>" + 
                "<td>" + card + "</td>" +
                "<td>" + cardLabelCount[card] + "</td>" +
                "<td>" + (card in cardPlacement ? cardPlacement[card] : "--") + "</td>" +
            "</tr>"
        $("#cardTable tbody").append(rowString);    
    }
}



$(document).ready(() => {

    // Console
    $("#consoleform").submit( (event) => {
        event.preventDefault();
        var input = $("#console").val();
        $("#console").val("");
        consoleInput(input);
    })


    $("#board").width(1280);
    $("#board").height(720);



    $(document).mousemove( (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cardLabels.forEach(card => {
            if(card.drag) {
                card.dragToPosition(mouseX, mouseY);
            }
        });
    })

    document.onmouseup = event => {
        cardLabels.forEach(card => {
            card.drag = false;
        });
    };


    $(document).keydown( (event) => {
        if(event.which == 13){
            $("#console").focus();
        }

        if(event.which == 27){
            cardLabels.forEach(card => {
               card.unselect(); 
            });
        }

        if( event.which == 46){
            for(var i=cardLabels.length-1; i>=0; i--){
                if( cardLabels[i].selected )
                    removeCardLabel(cardLabels[i]);
            }
        }
    })

    addLines();
   
});




jQuery.fn.insertAt = function(index, element) {
    var lastIndex = this.children().size();
    if (index < 0) {
      index = Math.max(0, lastIndex + 1 + index);
    }
    this.append(element);
    if (index < lastIndex) {
      this.children().eq(index).before(this.children().last());
    }
    return this;
  
}




function addLines(){
    var thickness = 0.25;
    createLine( 15, 0, thickness, 100 );
    createLine( 85, 0, thickness, 100 );


    createLine( 0, 27, 100, thickness );

    for(var i=0; i < 7; i++)
        createLine( 15 + (i*10), 27, thickness, 73 );
    
        
    for(var i=3; i < 7; i++)
        createLine( 15 + (i*10), 0, thickness, 27 );

    createLine( 25, 0, thickness, 27 );
}


function createLine(xPerc, yPerc, width, height){

    var line = document.createElement("div");
    line.style.position = "absolute";
    line.style.left = xPerc + "%";
    line.style.top = yPerc + "%";
    line.style.width = width + "%";
    line.style.height = height + "%";
    line.style.backgroundColor = "darkgreen";


    document.getElementById("board").appendChild(line);
}











