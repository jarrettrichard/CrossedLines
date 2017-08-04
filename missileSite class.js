/**
 * Created by Jarrett on 12/13/2016.
 */

/*var allPctToEachLatLine = new Array(0.1059296187683284, 0.1468475073313783, 0.0944692082111437, 0.0687639296187683,
    0.0276143695014663,0.0301730205278592, 0.0549926686217009, 0.0549061583577713, 0.0291554252199413, 0.0276876832844575,
0.0687683284457478, 0.0897448680351906);*/

var MissileSite = function (xPosition, yPosition){
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.getxPosition = function(){
        return this.xPosition;
    };
    this.getyPosition = function(){
        return this.yPosition; 
    };
};


/*MissileSite.prototype.setXPosition = function(){
    xPosition = (0.0497890522742041 * WIDTH) + (Math.floor((Math.random() * 24)) * (0.0387685751623691 * WIDTH));
};*/

/*MissileSite.prototype.setYPosition = function(){
    yPosition = YPositionSetup(yPosition);
};


MissileSite.prototype.getXPosition = function(){
    return xPosition;
};



MissileSite.prototype.getYPosition = function(){
    return yPosition;
};*/



/*
// yPosition is a little harder to calculate so I am making a function for this calculation
function YPositionSetup(yPosition){
    var ySelector = Math.floor((Math.random() * 13));


    switch (ySelector){
        case 1:
            yPosition = allPctToEachLatLine[0] * HEIGHT;
            return yPosition;
            break;
        case 2:
            for(i=0;i<2;i++){
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            return yPosition;
            break;
        case 3:
            for(i=0;i<3;i++){
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            return yPosition;
            break;
        case 4:
            for(i=0;i<4;i++){
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            return yPosition;
            break;
        case 5:
            for(i=0;i<5;i++){
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            return yPosition;
            break;
        case 6:
            for(i=0;i<6;i++){
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            return yPosition;
            break;
        case 7:
            for(i=0;i<7;i++){
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            return yPosition;
            break;
        case 8:
            for(i=0;i<8;i++){
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            return yPosition;
            break;
        case 9:
            for(i=0;i<9;i++){
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            return yPosition;
            break;
        case 10:
            for(i=0;i<10;i++){
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            return yPosition;
            break;
        case 11:
            for(i=0;i<11;i++){
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            return yPosition;
            break;
        case 12:
            for(i=0;i<12;i++){
                yPosition += allPctToEachLatLine[i] * HEIGHT;
            }
            return yPosition;

    }
}*/
