/*
* The position of the actor is stored as a vec object
* The vec class is used for two-dimensional values,
* such as the position and size of actors.
*/
export default class Vec {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	plus(other){
		return new Vec(this.x + other.x, this.y + other.y);
	}

	times(factor){
		return new Vec(this.x * factor, this.y * factor);
	}
}