import {elt, drawGrid, scale, drawActors} from './functions.js';
export default class DOMDisplay {
	constructor(parent, level){
		/*
		* The actorLayer is used to track the element that holds the actors
		* so that they can be easily removed and replaced
		*/
		this.dom = elt("div", {class : "game"}, drawGrid(level));
		this.actorLayer = null;

		parent.appendChild(this.dom);
	}

	clear(){
		this.dom.remove();
	}
}

DOMDisplay.prototype.syncState = function(state){
	if(this.actorLayer){
		this.actorLayer.remove();
	}

	this.actorLayer = drawActors(state.actors);
	this.dom.appendChild(this.actorLayer);
	this.dom.className = `game ${state.status}`;
	this.scrollPlayerIntoView(state);
};

DOMDisplay.prototype.scrollPlayerIntoView = function(state){
	let width = this.dom.clientWidth,
	    height = this.dom.clientHeight,
	    margin = width / 3;
    //The viewport
	let left = this.dom.scrollLeft,
	    right = left + width,
	    top = this.dom.scrollTop,
	    bottom = top + height;

	let player = state.player,
	    center = player.pos.plus(player.size.times(0.5)).times(scale);

	if(center.x < left + margin){
		this.dom.scrollLeft = center.x - margin;
	}else if(center.x > right - margin){
		this.dom.scrollLeft = center.x + margin - width;
	}

	if(center.y < top + margin){
		this.dom.scrollTop = center.y - margin;
	}else if(center.y > bottom - margin){
		this.dom.scrollTop = center.y + margin - height;
	}
};


