var context;
var queue;
var WIDTH = 965;
var mapWidth = 0.883026869278736 * WIDTH;
var HEIGHT = 682;

// I used the word "console" below to refer to the Cold War computer console that the game is supposed to reflect.//
var CONSOLEHEIGHT = 843;
var stage;
var scoreText;
var gameTimer;
var gameTime = 0;
var timerText;
var missileSiteIDwidthPct = 0.00636787564766839378238341968912;
var map_crosshair_dimensions = 0.02331606217616580310880829015544 * WIDTH;
var spritesheet; /*The explosion spritesheet.*/

var numEnemyMissileTotal = 10;
var numEnemyMissileDestroyed = 0;
var missileSitesArray = new Array(numEnemyMissileTotal);

//I CANNOT GET THE ARRAY REFERENCE TO "allPctToEachLine[0] to work in doing the x position! I don't know why.//
var x_pos_latitudeInputBox = WIDTH * 0.0470 + WIDTH * 0.03835 * 7;
var y_pos_latitudeInputBox = HEIGHT + 55;

//I CANNOT GET THE ARRAY REFERENCE TO "allPctToEachLine[0] to work in doing the x position! I don't know why.//
var x_pos_longitudeInputBox = WIDTH * 0.0470 + WIDTH * 0.03835 * 13.75;
var y_pos_longitudeInputBox = HEIGHT + 55;

var x_pos_FireButton = WIDTH/9 * 8;
var y_pos_FireButton = HEIGHT + 52;

var xPosition;
var yPosition;

//Regular Expressions
var latPattern = /^(\s{0,2}0{1}\s{0,2}(N|S)?\s?){1}|^(15|30|45|60)(N|S)|75N/;
var longPattern = /^(\s{0,3}0\s{0,2}(W|E)?\s?){1}|^\s?(15|30|45|60|75|90|105|120|135|150|165)\s?(W|E)|^\s?180\s?(W|E)?/;
var oneEightyPattern = /^\s?180\s?(W|E)?/;


//Array below is in the order from top latitude line to bottom latitude line.
var allPctToEachLatLine = [0.1025, 0.14665102639296187683284457478006, 0.09154545454545454545454545454545, 0.06876832844574780058651026392962,
    0.05776979472140762463343108504399, 0.05502199413489736070381231671554, 0.05489002932551319648093841642229, 0.05685190615835777126099706744868, 0.06876832844574780058651026392962,
    0.08975806451612903225806451612903, 0.14834310850439882697947214076246];
//Array below is in the order of left most longitude line to rightmost (the second line is repeated the rest of the way)
//Second number in array below is relative to the width of the middle 24 lines of longitude on the map, not the entire background image
var allPctToEachLongLine = [0.0470, 0.03835];

window.onload = function()
{
    /*
     *      Set up the Canvas with Size and height
     *
     */
    var canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.canvas.width = WIDTH;
    context.canvas.height = CONSOLEHEIGHT;
    stage = new createjs.Stage("myCanvas");

    /*
     *      Set up the Asset Queue and load sounds
     *
     */
    queue = new createjs.LoadQueue(false);
    queue.installPlugin(createjs.Sound);
    queue.on("complete", queueLoaded, this);
    createjs.Sound.alternateExtensions = ["ogg"];

    /*
     *      Create a load manifest for all assets
     *
     */
    queue.loadManifest([
        {id: 'backgroundImage', src: 'assets/backgroundII.png'},
        {id: 'crossHair', src: 'assets/map_crosshair-selector.png'},
        {id: 'missileSiteID', src: 'assets/missile_site_id.png'},
        {id: 'gameOverSound', src: 'assets/gameOver.mp3'},
        {id: 'explosion', src: 'assets/explosionSheet.png'}
    ]);
    queue.load();

    /*
     *      Create a timer that updates once per second
     *
     */
    gameTimer = setInterval(updateTime, 1000);

    positionLatInputBoxes(x_pos_latitudeInputBox, y_pos_latitudeInputBox);
    positionLongInputBoxes(x_pos_longitudeInputBox, y_pos_longitudeInputBox);
    positionFireButton(x_pos_FireButton, y_pos_FireButton);
};

function queueLoaded(event)
{
    // Add background image
    var backgroundImage = new createjs.Bitmap(queue.getResult("backgroundImage"));
    stage.addChild(backgroundImage);

    //Add Score
    scoreText = new createjs.Text(numEnemyMissileDestroyed.toString() + '/' + numEnemyMissileTotal.toString(), "90px Arial", "#FFF");
    scoreText.x = 60;
    scoreText.y = HEIGHT + 55;
    stage.addChild(scoreText);

    //Ad Timer
    //TO DO: I WILL NEED TO COME BACK AND SOME HOW ADD THE FONT "AMERICAN CAPTAIN" TO THE LIST OF FILES SO THAT ALL
    //BROWSERS WILL HAVE THE FONT ENABLED
    timerText = new createjs.Text("Time: " + gameTime.toString(), "24pt American Captain", "#000000");
    timerText.x = 855;
    timerText.y = 695;
    stage.addChild(timerText);

    //Create explosion spritesheet
    spriteSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('explosion')],
        "frames": {"width": 38, "height": 36},
        "animations": {"explode": [0, 42]},
        "framerate": 30
    });


    // Add crosshair
    crossHair = new createjs.Bitmap(queue.getResult("crossHair"));
    moveSelector("30N", "90W");
    // Add Missile Sits w/ dots
    positionEnemyMissiles();

    // Add ticker
    createjs.Ticker.setFPS(15);
    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.addEventListener('tick', tickEvent);

    //Spritesheet animation object:
    ANIMATEDEXPLOSION = new createjs.Sprite(spriteSheet, "explode");
}

function tickEvent(){
    //This part waits to hear for the explosion animation's ending frame before it terminates. (looping only once)
    if(ANIMATEDEXPLOSION.currentAnimationFrame >= 39){
        ANIMATEDEXPLOSION.gotoAndStop("explode");
        stage.removeChild(ANIMATEDEXPLOSION);
    }
}


function createExplosion(){
    ANIMATEDEXPLOSION.regX = 23;
    ANIMATEDEXPLOSION.regY = 18;
    ANIMATEDEXPLOSION.x = 700;
    ANIMATEDEXPLOSION.y = 250;
    stage.addChildAt(ANIMATEDEXPLOSION, 1);
    ANIMATEDEXPLOSION.gotoAndPlay("explode");
}


function updateTime()
{
	gameTime += 1;
	if(gameTime > 9999)
	{
		//End Game and Clean up
		timerText.text = "GAME OVER";
        var si =createjs.Sound.play("gameOverSound");
		clearInterval(gameTimer);
	}
	else
	{
		timerText.text = "Time: " + gameTime;
	}
}



function positionLatInputBoxes(x_pos_latitudeInputBox, y_pos_latitudeInputBox){
    var latBox = document.getElementById("latitude");
    latBox.style.position = "absolute";
    latBox.style.left = x_pos_latitudeInputBox + 'px';
    latBox.style.top = y_pos_latitudeInputBox + 'px';

}

function positionLongInputBoxes(x_pos_latitudeInputBox, y_pos_latitudeInputBox){
    var longBox = document.getElementById("longitude");
    longBox.style.position = "absolute";
    longBox.style.left = x_pos_latitudeInputBox + 'px';
    longBox.style.top = y_pos_latitudeInputBox + 'px';

}

function positionFireButton(x_positionFireButton, y_pos_FireButton){
    var fireButtonBox = document.getElementById("fire_button");
    fireButtonBox.style.position = "absolute";
    fireButtonBox.style.left = x_positionFireButton + 'px';
    fireButtonBox.style.top = y_pos_FireButton + 'px';

}

function xPositionFunc(num, crosshair = false) {
    if(num == "" && num.toString() != "0") {
        xPosition = (Math.floor((allPctToEachLongLine[0] * WIDTH) + Math.floor((Math.random() * 24)) * (allPctToEachLongLine[1]) * WIDTH));
    }
    /*I added in the else if statement as well as the check for the "crosshair" boolean, because I want to be able to submit a number
    * of removals from the 165W line and get a returned xPosition to check for certain xPositions to make sure they are not Soviet positions.*/
    else if (crosshair === false){
        xPosition = (Math.floor((allPctToEachLongLine[0] * WIDTH) + Math.floor((num)) * (allPctToEachLongLine[1]) * WIDTH));
    }
    else if(crosshair === true){
        xPosition = (Math.floor((allPctToEachLongLine[0] * WIDTH) + Math.floor((num)) * (allPctToEachLongLine[1]) * WIDTH)) - map_crosshair_dimensions/2 + 3;
    }
    return xPosition;
}



function yPositionFunc(ySelector = Math.floor((Math.random() * 11)), crosshair = false) {
    yPosition = allPctToEachLatLine[0] * HEIGHT;
    switch (ySelector) {
        case 1:
            break;
        case 2:
            for (var i = 1; i < 2; i++) {
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            break;
        case 3:
            for (i = 1; i < 3; i++) {
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            break;
        case 4:
            for (i = 1; i < 4; i++) {
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            break;
        case 5:
            for (i = 1; i < 5; i++) {
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            break;
        case 6:
            for (i = 1; i < 6; i++) {
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            break;
        case 7:
            for (i = 1; i < 7; i++) {
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            break;
        case 8:
            for (i = 1; i < 8; i++) {
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            break;
        case 9:
            for (i = 1; i < 9; i++) {
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            break;
        case 10:
            for (i = 1; i < 10; i++) {
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
    }

    if(crosshair){
        yPosition -= (map_crosshair_dimensions/4 + 3);
    }
    return Math.floor(yPosition);
}



function positionEnemyMissiles(){
    for(var i=0;i<numEnemyMissileTotal;i++){
        var missileSiteID = new createjs.Bitmap(queue.getResult("missileSiteID"));
        /*Set some initial x and y positions for the new enemy missile.*/
        missileSiteID.x = xPositionFunc("", false);
        missileSiteID.y = yPositionFunc();

        /*This while loop will go round and round until it finds a set of coordinates that don't meet the criteria,
        * i.e. that is not Soviet Territory Coordinates.*/
        while((missileSiteID.y === yPositionFunc(1) && (missileSiteID.x === xPositionFunc(15) || missileSiteID.x === xPositionFunc(17)  ||
            missileSiteID.x === xPositionFunc(18) || missileSiteID.x === xPositionFunc(21))) ||
        (missileSiteID.y === yPositionFunc(2) && (missileSiteID.x === xPositionFunc(13) || missileSiteID.x === xPositionFunc(14) ||
            missileSiteID.x === xPositionFunc(15) || missileSiteID.x === xPositionFunc(16) ||
            missileSiteID.x === xPositionFunc(17) || missileSiteID.x === xPositionFunc(18) ||
            missileSiteID.x === xPositionFunc(19) || missileSiteID.x === xPositionFunc(20) ||
            missileSiteID.x === xPositionFunc(21) || missileSiteID.x === xPositionFunc(22))) ||
        (missileSiteID.y === yPositionFunc(3) && (missileSiteID.x === xPositionFunc(13) || missileSiteID.x === xPositionFunc(14) ||
            missileSiteID.x === xPositionFunc(15) || missileSiteID.x === xPositionFunc(16) || missileSiteID.x === xPositionFunc(20)))){

            missileSiteID.x = xPositionFunc("");
            missileSiteID.y = yPositionFunc();
        }

        /*If the xPosition is on the 30E, then the yPosition can't be at the 45N nor at the 60N. (Soviet Territory)
         If at the 45E, then the yPosition can't be at the 45N, nor 60N. (Soviet Territory) ... etc.
         Must make sure Soviet coordinates are checked for in the y position too. */

        stage.addChild(missileSiteID);
    }

    var positionTest = new createjs.Text(missileSiteID.x.toString(), "36px Arial", "#FFF");
    positionTest.x = missileSiteID.x;
    positionTest.y = missileSiteID.y;
    stage.addChild(positionTest);

    var positionTest2 = new createjs.Text(missileSiteID.y.toString(), "36px Arial", "#FFF");
    positionTest2.x = missileSiteID.x;
    positionTest2.y = missileSiteID.y + 40;
    stage.addChild(positionTest2);

}

function moveSelector(latitude = document.getElementById("latitude").value.toUpperCase(), longitude = document.getElementById("longitude").value.toUpperCase()){
/*    var latitude = document.getElementById("latitude").value.toUpperCase();
    var longitude = document.getElementById("longitude").value.toUpperCase();*/

    if(latPattern.test(latitude)){
        crossHair.y = latPositionalMath(latitude);
    }


    if(longPattern.test(longitude)){
        crossHair.x = longPositionalMath(longitude);
    }


   /* if (latitude == "" && longitude == ""){
        crossHair.y = yPositionFunc(3);
        crossHair.x = xPositionFunc2(2);

    }

    else if(latitude == "0" && longitude == ""){
        crossHair.y = 356 - map_crosshair_dimensions/2 + 2;
        crossHair.x = 230 - map_crosshair_dimensions/2 + 3;
    }*/

    stage.addChild(crossHair);
``}


//I need this function to interpret the input from the users (lat/long degrees) and convert them to pixels.

function latPositionalMath(latInput){
    var y;
    if(latInput.charAt(2) == "N" && parseInt(latInput)!= 0){
        y = (75 - parseInt(latInput))/15;
    }

    else if(latInput.charAt(2) == "S" && parseInt(latInput)!= 0){
        y = 5 + parseInt(latInput)/15;
    }

    else if(parseInt(latInput) == 0){
        y = 5;
    }
    y += 1;
    return yPositionFunc(y, crosshair = true);
}

function longPositionalMath(longInput){
    //x is the number of longitude lines that the crosshair selector will be removed from the 165 degrees West line
    var x;
    if(longInput.charAt(2) == "W" || longInput.charAt(3) == "W" && parseInt(longInput)!= 0 && !oneEightyPattern.test(longInput)){
        x = (165 - parseInt(longInput))/15;
    }

    else if(longInput.charAt(2) == "E" || longInput.charAt(3) == "E" || oneEightyPattern.test(longInput) && parseInt(longInput)!= 0){
        x = 11 + parseInt(longInput)/15;
    }

    else if(parseInt(longInput) == 0){
        x = 11;
    }

    return xPositionFunc(x, true);
}


function fireMissile(){
    var latitude = document.getElementById("latitude").value;
    var longitude = document.getElementById("longitude").value;
    document.getElementById("latitudeDisplay").innerHTML = latitude;
    document.getElementById("longitudeDisplay").innerHTML = longitude;

    // Create explosion
    createExplosion(ANIMATEDEXPLOSION);

}






















