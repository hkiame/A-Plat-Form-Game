import Vec from './Vec.js';
export default class Player {
	constructor(pos, speed){
		this.pos = pos;
		this.speed = speed;
	}

	get type(){
		return "player";
	}

	static create(pos){
		/*
		* A player is one and a half squares high. Its initial position is set 
		* to be half a square above the position where the @ character appeared.
		* This way its bottom, aligns with the bottom of the square it appeared in.
		*/
		return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0));
	}
}

/*
* We store the size property on the prototype rather than on the instances
* We could have used a getter like type but that would create and return
* a new Vec object every time the property is read, which could be wasteful
* Strings being immutable don't have to be recreated every time they are evaluated
*/
Player.prototype.size = new Vec(0.8, 1.5);

export const playerXSpeed = 7,
			 gravity = 30,
			 jumpSpeed = 17;

Player.prototype.update = function(time, state, keys){
	let xSpeed = 0;
	if(keys.ArrowLeft){ xSpeed -= playerXSpeed; }

	if(keys.ArrowRight){ xSpeed += playerXSpeed; }

	let pos = this.pos,
	    movedX = pos.plus(new Vec(xSpeed * time, 0));
	if(!state.level.touches(movedX, this.size, "wall")){
		pos = movedX;
	}
	
    //The player's vertical speed(ySpeed) is first accelerated to account for gravity
	let ySpeed = this.speed.y + time * gravity,
	    movedY = pos.plus(new Vec(0, ySpeed * time));

	if(!state.level.touches(movedY, this.size, "wall")){
		pos = movedY;
	}else if(keys.ArrowUp && ySpeed > 0){
		ySpeed = -jumpSpeed;
	}else{
		ySpeed = 0;
	}

	return new Player(pos, new Vec(xSpeed, ySpeed));

};