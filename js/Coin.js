import Vec from './Vec.js';
import State from './State.js';
export default class Coin {
	constructor(pos, basePos, wobble){
		this.pos = pos;
		this.basePos = basePos;
		this.wobble = wobble;
	}

	get type(){ return "coin"; }

	static create(pos){
		let basePos = pos.plus(new Vec(0.2, 0.1));
        /*
        * The phase of Math.sin's wave, The width of a wave it produces is 2π
        * We multiply the value returned by Math.random by that number to give 
        * the coin a random starting position on the wave & to avoid all coins
        * move up and down synchronously the starting phase of each coin is randomized
        */
		return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
	}
}

Coin.prototype.size = new Vec(0.6, 0.6);

Coin.prototype.collide = function(state){
	let filtered = state.actors.filter(a => a != this),
	    status = state.status;

	if(!filtered.some(a => a.type == "coin")){
		status = "won";
	}

	return new State(state.level, filtered, status);
}

export const wobbleSpeed = 8, 
      		 wobbleDist = 0.07;

Coin.prototype.update = function(time){
	let wobble = this.wobble + time * wobbleSpeed,
		/*
		* Math.sin gives us the y-coordinate of a point on a circle. That coordinate goes 
		* back and forth in a smooth waveform as we move along the cirlce, which makes 
		* the sine function useful for modeling a wavy motion
		*/
		wobblePos = Math.sin(wobble) * wobbleDist;
    
    return new Coin(this.basePos.plus(new Vec(0, wobblePos)), this.basePos, wobble);
};