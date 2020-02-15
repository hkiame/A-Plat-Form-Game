import Level from './Level.js';
import State from './State.js';

export function elt(name, attrs, ...children){
	let dom = document.createElement(name);
	for(let attr of Object.keys(attrs)){
		dom.setAttribute(attr, attrs[attr]);
	}

	for(let child of children){
		dom.appendChild(child);
	}

	return dom;
}

/*
* Everything in the game would be ridiculously small at a 
* single pixel per square so we scale the coordinates up
*/
export const scale = 20;

export function drawGrid(level){
	return elt('table', {
		class: "background",
		style: `width: ${level.width * scale}px`
	}, ...level.rows.map(row => elt("tr", {style: `height: ${scale}px`},
		...row.map(type => elt("td", {class: type})))
	));
}

export function drawActors(actors){
	return elt('div', {}, ...actors.map(actor => {
		let rect = elt('div', {class: `actor ${actor.type}`});
		rect.style.width = `${actor.size.x * scale}px`;
		rect.style.height = `${actor.size.y * scale}px`;
		rect.style.left = `${actor.pos.x * scale}px`;
		rect.style.top = `${actor.pos.y * scale}px`;
		return rect;
	}));
}

export function overlap(actor1, actor2){
	return actor1.pos.x + actor1.size.x > actor2.pos.x &&
	       actor1.pos.x < actor2.pos.x + actor2.size.x &&
	       actor1.pos.y + actor1.size.y > actor2.pos.y &&
	       actor1.pos.y < actor2.pos.y + actor2.size.y;
}

export function trackKeys(keys){
	let down = Object.create(null);

	function track(event){

		if(keys.includes(event.key)){
			down[event.key] = event.type == "keydown";
			event.preventDefault();
		}
	}

	window.addEventListener("keydown", track);
	window.addEventListener("keyup", track);

	down.unregister = ()=>{
		window.removeEventListener("keydown", track);
		window.removeEventListener("keyup", track);
	};
	return down;
}

export function runAnimation(frameFunc){
	let lastTime = null;
	/*
	* frame is the callback passed in requestAnimationFrame
	* the callback is passed one single argument, a timestamp in milliseconds indicating
	* a point in time when requestAnimationFrame starts to execute the callback
	*/
	function frame(time){
		if(lastTime != null){
			let timeStep = Math.min(time - lastTime, 100) / 1000; //convert milliseconds to seconds
			if(frameFunc(timeStep) === false){ return; }
		}

		lastTime = time;
		requestAnimationFrame(frame);
		
	}
	requestAnimationFrame(frame);
}

export function runLevel(level, Display){
	let display = new Display(document.getElementById('container'), level),
	    state = State.start(level),
	    ending = 1,
	    arrowKeys = trackKeys(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Escape']),
	 	divState = document.querySelector('#displayState');
    
	return new Promise((resolve, reject)=>{
		function frameCallBack(time){
			state = state.update(time, arrowKeys);
			display.syncState(state);
			if(arrowKeys.Escape){
				if(divState.innerText == ""){
					divState.innerText = "PAUSED";
					return false;
				}
				divState.innerText = "";
				return true;
			}

			if(state.status == "playing"){
				return true;
			}else if(ending > 0){
				ending -= time;
				return true;
			}else{
				display.clear();
				window.removeEventListener('keydown', handleEscape);
				arrowKeys.unregister();
				resolve(state.status);
				return false;
			}
		}

		function handleEscape(){
			if(arrowKeys.Escape && divState.innerText == "PAUSED"){
				arrowKeys.Escape = false;
				divState.innerText = "";
				runAnimation(frameCallBack);			
			}
		}

		window.addEventListener('keydown', handleEscape);
		runAnimation(frameCallBack);
	});
}

export async function runGame(plans, Display){
	let lives = 3;

	for(let level = 0; level < plans.length;){
		let life = lives > 1 ? "lives" : "life";
		console.log(`You have ${lives} ${life}`);
		document.querySelector('#displayLevel').textContent = level + 1;
		document.querySelector('#displayLives').textContent = lives;
		let status = await runLevel(new Level(plans[level]), Display);

		if(status == "won"){
			level++;
		}else{
			lives--;
			if(lives == 0){
				level = 0;
				lives = 3;
			}
		}
	}
	console.log("You've won!");
}