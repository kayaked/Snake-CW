import cw from "./21.json" assert {type: "json"};
var main = document.getElementById("main");
var ctx = main.getContext("2d");
var marked = {};
ctx.fillStyle = "#000";
ctx.strokeStyle = "#000";
ctx.font = "25px Arial";
for(let y = 0; y < 15; y++) {
    for(let x = 0; x < 15; x++) {
        if(cw.grid[y*15 + x] == '.') {
            ctx.fillRect(x*40, y*40, 40, 40);
        } else {
            ctx.strokeRect(x*40, y*40, 40, 40);
        }
    }
}
function refTile(x, y, letters) {
    if(cw.grid[y*15 + x] == '.') {
        ctx.fillStyle = "#000";
        ctx.fillRect(x*40, y*40, 40, 40);
    } else {
        ctx.fillStyle = "#FFF";
        ctx.rect(x*40, y*40, 40, 40);
        ctx.fill();
        ctx.stroke();
        if(letters && letters[0]) {
            ctx.fillStyle = "#888";
            let ltr = cw.grid[y*15 + x].toString();
            if(ltr != letters[1]) {
                ctx.fillStyle = "#F00";
                ctx.fillText(letters[1], x*40+10, y*40+40-10);
            } else {
                ctx.fillText(ltr, x*40+10, y*40+40-10);
            }
        }
        ctx.fillStyle = "#000";
    }
}


var sX = -1, sY = 0;
var d = 1, to, turning = false, turnctr=0;
var snakeskin = [[-1, 0], [0,0], [1,0], [2,0]];
function drawSnake() {
    ctx.beginPath();
    if(cw.grid[sY*15 + sX] == '.') {
        refTile(sX, sY);
        return;
    }

    if(d == 2) {
        if(sY == 0) sY = 15;
        sY--;
    } else if(d == 3) {
        if(sX == 0) sX = 15;
        sX--;
    } else if(d == 4) {
        if(sY == 14) sY = -1;
        sY++;
    } else {
        if(sX == 14) sX = -1;
        sX++;
    }
    let shed = snakeskin.shift();
    let tileMarked = marked[shed[1]*15 + shed[0]];
    if(tileMarked) {
        console.log(tileMarked.key);
        refTile(shed[0], shed[1], [true, tileMarked.key]);
    } else {
        refTile(shed[0], shed[1]);
    }
    snakeskin.push([sX, sY]);
    ctx.fillStyle = '#00F';
    
    let w = 30, h = 30, xoffset = 5, yoffset = 5;
    if(d % 2 != 0) {
        w = 40; xoffset = 0;
    } else {
        h = 40; yoffset = 0;
    }

    ctx.fillRect(sX*40+xoffset, sY*40+yoffset, w, h);
    to = setTimeout(function(){
        if(!turning) {
            requestAnimationFrame(drawSnake);
        }
    }, 200);
}

window.addEventListener("keydown", function(ev) {
    turnctr++;
    let tctrt = turnctr;
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
        marked[sY*15 + sX] = {key: ev.code.charAt(3)};
    }
    if(turning) {
        this.setTimeout(function() {
            if(tctrt == turnctr) {
                turning = false;
                requestAnimationFrame(drawSnake);
            }
        }, 200);
    }
});

drawSnake();