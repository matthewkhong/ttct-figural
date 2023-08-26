let radius; // Brush's Radius
let lastradius = []; // Stores Last Brush's Radius For Undo Function
let canvas2; // Second Canvas For Drawing
let mhx = []; // Stores Latest Brush Path's X
let mhy = []; // Stores Latest Brush Path's Y
let undoHistoryX = []; // Undo History That Stores Brush Path's X
let undoHistoryY = []; // Undo History That Stores Brush Path's Y
let slider; //Brush Size
let docelement = document.documentElement; //Document Itself
let windowx, windowy; // Window Size
let startedInCanvas; // none currently
let r = [],g = [],b = []; //Color For Brush
let lastBrush = []; //Last Brush Type
let imgStorageRef, databaseRef; // Firebase References
let finalData; //Stores The Submission On Submit Button Press
let colorNumber = 1; //Stores Current Color's Index Number
let img; // Declare variable 'img'.

function preload() {
    img = loadImage('https://matthewkhong.github.io/assets/img/circles.png')
}

function setup(){
    //Window Setup
    isMobileDevice();
    windowx = 0.95 * windowWidth;
    windowy = windowHeight * 0.8;

    canvas1 = createCanvas(windowx, windowy);
    background(255);
    canvas1.parent("sketchcontainer");
    background(img);

    //Database Setup
    var storage = firebase.storage();
    var database = firebase.database();
    imgStorageRef = storage.ref("gifts/");
    databaseRef = database.ref("gifts/");

    //-------------v------------------ All The CSS ---------------v----------------//
    
    //Empty Space
    createElement("br");

    //---------------------------------------------------------------- Line 1 Canvas
    var line1 = createDiv("");
    line1.addClass("line1");

    //Slider
    slider = createSlider(8,70,8);
    //slider.addClass('sliderClass');
    //line1.child(slider);

    //Undo Button
    var undo = createButton("Undo");
    line1.child(undo);
    undo.mousePressed(undofunc);
    undo.addClass("undo");

    //Clear Button
    var clear = createButton("Clear");
    line1.child(clear);
    clear.mousePressed(clearfunc);
    clear.addClass("clear");

    //---------------------------------------------------------------- Line 2 div
    //var line2 = createDiv("");
    //line2.addClass("line2");

    //---------------------------------------------------------------- Line 3 Div
    //var line3 = createDiv();
    //line3.addClass("line3");
    
    eraserSettings = createButton("Eraser");
    brushSettings = createButton("Brush");
    eraserSettings.addClass("eraserSettingsClass");
    brushSettings.addClass("brushSettingsClass");
    line1.child(eraserSettings);
    line1.child(brushSettings);

        //Submit Buttons
        submitButton = createButton("Submit");
        viewSubmissionsButton = createButton("View Submissions");
        line1.child(submitButton);
        line1.child(viewSubmissionsButton);
        submitButton.mousePressed(submit);
        viewSubmissionsButton.mousePressed(viewsub);
            //Submit Button & View Submissions Button Style :
            submitButton.addClass("submitButtonClass");
            viewSubmissionsButton.addClass("viewSubmissionsButtonClass");
        

        //Setting Up Brush Colors
        eraserSettings.mousePressed(setEraser);
        brushSettings.mousePressed(setBrush);
}

//--------------------------------------- Mobile Detector
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};


//--------------------------------------- Setting Up Pointer For Touch
if(isMobileDevice() == true){

    function touchStarted(){
        if(mouseX >= 0 && mouseX <= windowx && mouseY >= 0 && mouseY <= windowy){
            r.unshift(0);
            g.unshift(0);
            b.unshift(0);

            radius = slider.value();
            mhx = [];
            mhy = [];
        
            mhx.unshift(mouseX);
            mhy.unshift(mouseY);
            lastradius.unshift(radius-4);
        }
    }

    function touchMoved(){
        if(mouseX >= 0 && mouseX <= windowx && mouseY >= 0 && mouseY <= windowy){
            mhx.unshift(mouseX);
            mhy.unshift(mouseY);

            stroke(r[0],g[0],b[0]);
            strokeWeight(radius-4);
            line(mhx[0],mhy[0],mhx[1],mhy[1]);
        }
    }

    function touchEnded(){
        if(mouseX >= 0 && mouseX <= windowx && mouseY >= 0 && mouseY <= windowy){
            undoHistoryX.unshift(mhx);
            undoHistoryY.unshift(mhy);
            mhx = [];
            mhy = [];
        }
    }

}else{

//--------------------------------------- Setting Up Pointer For Mouse
    function mousePressed(){
        if(mouseX >= 0 && mouseX <= windowx && mouseY >= 0 && mouseY <= windowy){
            r.unshift(0);
            g.unshift(0);
            b.unshift(0);

            radius = slider.value();
            mhx = [];
            mhy = [];
            mhx.unshift(mouseX);
            mhy.unshift(mouseY);
            lastradius.unshift(radius-4);
        }
    }

    function mouseDragged(){
        if(mouseX >= 0 && mouseX <= windowx && mouseY >= 0 && mouseY <= windowy){
            mhx.unshift(mouseX);
            mhy.unshift(mouseY);
            
            stroke(r[0],g[0],b[0]);
            strokeWeight(radius-4);
            line(mhx[0],mhy[0],mhx[1],mhy[1]);
        }
    }

    function mouseReleased(){
        if(mouseX >= 0 && mouseX <= windowx && mouseY >= 0 && mouseY <= windowy){
            undoHistoryX.unshift(mhx);
            undoHistoryY.unshift(mhy);

            mhx = [];
            mhy = [];
        }
    }
}

//--------------------------------------- Clear Canvas function
function clearfunc(){
    background(255);
    background(img);
    undoHistoryX = [];
    undoHistoryY = [];
    mhx = [];
    mhy = [];
    r = [0];
    g = [0];
    b = [0];
    lastradius = [];
}

//--------------------------------------- Undo Function
function undofunc(){
    background(255);
    background(img);
    lastradius.shift();
    undoHistoryX.shift();
    undoHistoryY.shift();
    r.shift();
    g.shift();
    b.shift();
    lastBrush.shift();

    //Draws The Whole Drawing      *Very Important Function*
    for(var i = undoHistoryX.length - 1; i >= 0; i--){
        stroke(r[i],g[i],b[i]);
        strokeWeight(lastradius[i]);
        for(var j = 0; j < undoHistoryX[i].length; j++){
            line(undoHistoryX[i][j],undoHistoryY[i][j],undoHistoryX[i][j+1],undoHistoryY[i][j+1]);
        }
    }
}

//--------------------------------------- Eraser Setter
function setEraser(){
    r.shift(255);
    g.shift(255);
    b.shift(255);
}

//--------------------------------------- Brush Setter
function setBrush(){
    r.shift(0);
    g.shift(0);
    b.shift(0);
}

//--------------------------------------- Submit Button Function
function submit(){
    finalData = {
        drawX : undoHistoryX,
        drawY : undoHistoryY,
        redChannel : r,
        greenChannel : g,
        blueChannel : b,
        radius : lastradius,
        canvasX : windowx,
        canvasY : windowy,
        username : username
    }
    databaseRef.push(finalData);
    alert("Uploading Your Data.. Click Ok And Wait For Few Seconds");
    setTimeout(function(){ alert("Data Upload Successful. Thank You For Your Submission!"); },3000);
}

//--------------------------------------- View Submission Button Function
function viewsub(){
    window.location.href = "ViewSubmissions.html";
}