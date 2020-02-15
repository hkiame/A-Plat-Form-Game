import DOMDisplay from './DOMDisplay.js';
import {GAME_LEVELS} from './game_levels.js';
import {runGame} from './functions.js';

/*
* Periods are empty spaces
* Hash characters are walls
* Plus signs are lava
* The Player starting position is at sign @
* O character is coin
* = sign is a block of lava that moves back and forth horizontally
* | creates vertically moving blobs
* v indicates dripping lava
*/

/*
let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;

let simpleLevel = new Level(simpleLevelPlan),
        display = new DOMDisplay(document.getElementById('container'), simpleLevel);

display.syncState(State.start(simpleLevel));
*/

runGame(GAME_LEVELS, DOMDisplay);

