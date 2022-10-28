/*
Post.js
-----------------------------
Module for operations which take place post-document load.
Holds functions dealing primarily with game canvas drawing, snake dynamics and score.

(c) Jack Engle, 2022

*/
import cw from "./21.json" assert {type: "json"};

// Declare primary global variables
// main is the main canvas element in the HTML document, while ctx is the canvas's drawing context used for all operations
// marked references information about letter-marked squares using a dictionary
// growing references whether the snake is in the process of growing
var main = document.getElementById("main");
var ctx = main.getContext("2d");
var marked = {};
var growing = false;
var naturalTick = 180; // ms

// Default canvas context preferences
ctx.fillStyle = "#000";
ctx.strokeStyle = "#000";
ctx.font = "25px Arial";

// Initializes the crossword grid on the canvas based on the source JSON. 15x15 grid of 40px squares
for(let y = 0; y < 15; y++) {
    for(let x = 0; x < 15; x++) {
        if(cw.grid[y*15 + x] == '.') {
            ctx.fillStyle = "#000"
            ctx.fillRect(x*40, y*40, 40, 40);
        } else {
            ctx.fillStyle = "#000"
            ctx.strokeRect(x*40, y*40, 40, 40);
            drawHint(x, y);
        }
    }
}

// refTile, or Refresh Tile, is able to update and reload the graphics for a specific tile on the canvas's 15x15 grid
// Usage: x is the horizontal square position 0-14, y is the vertical square position 0-14, letters [boolean, char] signifies that a certain letter is marked here.
// As implemented currently, letters[0] as false is redundant
function refTile(x, y, letters) {
    // If this position on the grid is a wall/black square
    if(cw.grid[y*15 + x] == '.') {
        ctx.fillStyle = "#000";
        ctx.fillRect(x*40, y*40, 40, 40);
    } else {

        // Formatting the canvas context
        ctx.fillStyle = "#FFF";
        ctx.rect(x*40, y*40, 40, 40);
        ctx.fill();
        ctx.stroke();

        // If letters properly exists
        if(letters && letters[0]) {
            
            ctx.fillStyle = "#888";

            // Gets letter from crossword source and checks if given letter is correct
            // If not, letter will be red on the canvas
            let ltr = cw.grid[y*15 + x].toString();
            ctx.font = "25px Arial";
            if(ltr != letters[1]) {
                ctx.fillStyle = "#F00";
                ctx.fillText(letters[1], x*40+10, y*40+30);
            } else {
                growing = false;
                ctx.fillText(ltr, x*40+10, y*40+30);
            }
        }

        // Draw the hint number on the tile
        drawHint(x, y);

        // Reset fill style
        ctx.fillStyle = "#000";
    }
}

// Draw hint number on tile in the top-left corner
function drawHint(x, y) {
    let num = cw.gridnums[y*15 + x];
    if(num != 0) {
        ctx.font = "10px Arial";
        ctx.fillStyle = "#888";
        ctx.fillText(num.toString(), x*40+3, y*40+10);
    }
}

// Initialize snake
ctx.fillStyle = "#00f";
ctx.fillRect(5, 45, 35, 30);
ctx.fillRect(40, 45, 40, 30);
ctx.fillRect(80, 45, 40, 30);
ctx.fillRect(120, 45, 35, 30);
ctx.filleStyle = "#000";

// Declare snake global variables
// sX and sY handle the snake's coordinates
// d is the Cardinal Direction, counterclockwise from 1(right) 2(up) 3(left) 4(down)
// turning is a boolean handler for drawSnake determining if the snake needs to automatically move (false) or if it is being turned (true) (turning mode)
// turnctr keeps count of each turn using a counter to identify a new turn immediately after it occurs
var sX = 3, sY = 1;
var d = 1, to, turning = false, turnctr=0;
var snakeskin = [[0, 1, 1], [1,1, 1], [2,1, 1], [3,1, 1]];

// drawSnake handles the canvas drawing, motion and reactions of the snake
function drawSnake() {

    // Initialize the context path
    ctx.beginPath();

    // Stop moving if collided with wall (To-Do)
    if(cw.grid[sY*15 + sX] == '.') {
        refTile(sX, sY);
        return;
    }
    
    // Determine the specifications by direction for the new drawing
    let w = 30, h = 30, xoffset = 5, yoffset = 5;
    if(d % 2 != 0) {
        w = 40; xoffset = 0;
    } else {
        h = 40; yoffset = 0;
    }

    // Depending on direction, increment position
    if(d == 2) {
        if(sY == 0) sY = 15;
        sY--;
        h = 35;
        yoffset = 5;
    } else if(d == 3) {
        if(sX == 0) sX = 15;
        sX--;
        w = 35;
        xoffset = 5;
    } else if(d == 4) {
        if(sY == 14) sY = -1;
        sY++;
        h = 35;
    } else {
        if(sX == 14) sX = -1;
        sX++;
        w = 35;
    }

    // Removes the tail-end of the snake, see refTile
    // To-Do: Track second and second-last positions to properly update head and tail geometry
    console.log(growing);
    if(!growing) {
        let shed = snakeskin.shift();
        let tileMarked = marked[shed[1]*15 + shed[0]];
        if(tileMarked) {
            console.log(tileMarked.key);
            refTile(shed[0], shed[1], [true, tileMarked.key]);
        } else {
            refTile(shed[0], shed[1]);
        }
    } else {
        growing = false;
    }
    snakeskin.push([sX, sY, d]);
    ctx.fillStyle = '#00F';

    // Draw the new snake tile
    ctx.fillRect(sX*40+xoffset, sY*40+yoffset, w, h);

    // Update the previous head tile to be a body segment
    if(turning) {
        if(d == 1) {
            ctx.fillRect(snakeskin[snakeskin.length-2][0]*40+5, snakeskin[snakeskin.length-2][1]*40+5, 35, 30);
        } else if(d==2) {
            ctx.fillRect(snakeskin[snakeskin.length-2][0]*40+5, snakeskin[snakeskin.length-2][1]*40, 30, 35);
        } else if(d==3) {
            ctx.fillRect(snakeskin[snakeskin.length-2][0]*40, snakeskin[snakeskin.length-2][1]*40+5, 35, 30);
        } else {
            ctx.fillRect(snakeskin[snakeskin.length-2][0]*40+5, snakeskin[snakeskin.length-2][1]*40+5, 30, 35);
        }
    } else {
        if(d % 2 == 0) {
            ctx.fillRect(snakeskin[snakeskin.length-2][0]*40+5, snakeskin[snakeskin.length-2][1]*40, 30, 40);
        } else {
            ctx.fillRect(snakeskin[snakeskin.length-2][0]*40, snakeskin[snakeskin.length-2][1]*40+5, 40, 30);
        }
    }

    // Initialize the next frame of the animated snake. Only done if not in turning mode
    to = setTimeout(function(){
        if(!turning) {
            requestAnimationFrame(drawSnake);
        }
    }, naturalTick);
}

// Global listener for a key being down in the window
// Handles the snake's directional changes, adds markers and properly manages turning mode
window.addEventListener("keydown", function(ev) {
    turnctr++;
    let tctrt = turnctr;

    // If arrow key pressed
    if(ev.code == "ArrowDown" && d % 2 != 0) {
        d = 4;
        turning = true;
        drawSnake();
    } else if(ev.code == "ArrowLeft" && d % 2 == 0) {
        d = 3;
        turning = true;
        drawSnake();
    } else if(ev.code == "ArrowUp" && d % 2 != 0) {
        d = 2;
        turning = true;
        drawSnake();
    } else if(ev.code == "ArrowRight" && d % 2 == 0) {
        d = 1;
        turning = true;
        drawSnake();
    } else if(ev.code.startsWith("Key")) {
        // If key pressed, mark current tile with this letter
        marked[sY*15 + sX] = {key: ev.code.charAt(3)};
        // If the given letter is incorrect, grow the snake by 1
        if(cw.grid[sY*15 + sX] != ev.code.charAt(3)) growing = true;
    }
    if(turning) {
        // Waits 200ms to resume the standard snake movement, but only if no more turns have been made
        this.setTimeout(function() {
            if(tctrt == turnctr) {
                turning = false;
                requestAnimationFrame(drawSnake);
            }
        }, naturalTick);
    }
});

drawSnake();