import cw from "./21.json" assert {type: "json"};
var hintBox = document.getElementById("hint-box");
var clues = cw.clues;
var across = clues.across;
var down = clues.down;
for(let clue = 0; clue < across.length; clue++) {
    console.log(across[clue]);
    let celement = document.createTextNode(across[clue]);
    hintBox.appendChild(celement);
}