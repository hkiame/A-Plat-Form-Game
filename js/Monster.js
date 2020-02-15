import Vec from './Vec.js';
import State from './State.js';


export default class Monster {
	constructor(pos, speed){
		this.pos = pos;
		this.speed = speed;
	}

	get type(){
		return "monster";
	}

	static create(pos){
		return new Monster(pos.plus(new Vec(0, -1)), new Vec(4, 0));
	}
}

Monster.prototype.size = new Vec(1, 2);


Monster.prototype.update = function(time, state){
	let player = state.player,
	    direction = player.pos.x < this.pos.x ? -1 : 1,
	    currentSpeed = this.speed.times(direction * time),
	    newPos = new Vec(this.pos.x + currentSpeed.x, this.pos.y);
	if(!state.level.touches(newPos, this.size, "wall")){
		return new Monster(newPos, this.speed);
	}
	return this;
};

Monster.prototype.collide = function(state){
	let player = state.player;
	if(player.pos.y - 1 < this.pos.y - this.size.y){
  		let filtered = state.actors.filter(a => a != this),
		    status = state.status;
		return new State(state.level, filtered, status);
	}

	return new State(state.level, state.actors, "lost");
};