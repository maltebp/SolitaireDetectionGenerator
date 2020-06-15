const SUIT_SPADES = "spades";
const SUIT_DIAMONDS = "diamons";
const SUIT_CLUBS = "clubs";
const SUIT_HEARTS = "hearts";
const SUIT_UNKNOWN = "unknown";


const SUITS = [
    SUIT_SPADES, SUIT_DIAMONDS, SUIT_CLUBS, SUIT_HEARTS
];


class Card{

    constructor(suit, value, x, y){
        this.suit = suit;
        this.value = value;
        this.x = x;
        this.y = y;
        this.drag = false;
        this.selected = false;
        this.width = 13;
        this.height = 23;
        this.confidence = 95;

        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        
        this.doubleClickTime = 0;
    
        if( this.suit == SUIT_CLUBS || this.suit == SUIT_SPADES )
            this.color = "#111111"
        else
            this.color = "#dd0000";

        this.createHTML();

       

        this.html.onmousedown = () => {
            var newTime = new Date();
            if( newTime - this.doubleClickTime  < 250 ){
                // Double click
                if( this.selected )
                    this.unselect();
                else
                    this.select();
            }else{  
                this.drag = true;
                this.dragOffsetX = this.x -mouseX;
                this.dragOffsetY = this.y -mouseY;
            }
            this.doubleClickTime = newTime;
        };

        this.updatePosition(x,y);
        
    }


    createHTML(){
        // Div Container
        var container = document.createElement("div");
        container.classList.add("card");
        container.style.position = "absolute";
        container.style.width = this.width + "px";
        container.style.height = this.height + "px";
        container.style.borderColor = this.color;

        // Label
        var label = document.createElement("p");
        label.classList.add("cardLabel"); 
        label.textContent = this.suit.substring(0,1).toUpperCase() + this.value;
        // label.style.color = this.color;
        container.appendChild(label);

         // Confidence Label
         var confidence = document.createElement("p");
         confidence.classList.add("cardConfidence"); 
         confidence.textContent = this.confidence
         // label.style.color = this.color;
         container.appendChild(confidence);

        this.confidenceLabel = confidence;
        this.label = label;
        this.html = container;
        // this.img = img;
    }

    select(){
        this.html.style.border = "solid 2px " + this.color;
        this.selected = true;
    }

    unselect(){
        this.html.style.border = "dashed 2px " + this.color;
        this.selected = false;
    }

    setConfidence(confidence){
        this.confidenceLabel.textContent = confidence;
        this.confidence = confidence; 
    }


    getIdentifier(){
        return this.suit.substring(0,1).toUpperCase() + this.value;
    }


    updateSize(width, height){
        this.width = width;
        this.height = height;

        this.validatePosition();
        updateCardPositions();

        this.html.style.width = this.width + "px";
        this.html.style.height = this.height + "px";
    }

    updatePosition(x, y){
        this.x = x;
        this.y = y;
        this.validatePosition();
        updateCardPositions();

        this.html.style.left =  this.x+"px";
        this.html.style.top = this.y+"px";
    }

    validatePosition(){
        var maxX = $("#board").width();
        var maxY = $("#board").height();

        if( this.x < 0 ) this.x = 0;
        if( this.x+this.width > maxX ) this.x = maxX-this.width;
        if( this.y < 0 ) this.y = 0;
        if( this.y+this.height > maxY ) this.y = maxY-this.height;         
    }


    dragToPosition(x, y){
        this.updatePosition(x+this.dragOffsetX, y+this.dragOffsetY);
    }







}