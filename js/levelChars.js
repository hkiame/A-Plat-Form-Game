import Player from './Player.js';
import Lava from './Lava.js';
import Coin from './Coin.js';
import Monster from './Monster.js'

export {levelChars as default};
const levelChars = {
	".": "empty",
	"#": "wall",
	"+": "lava",
	"@": Player,
	"o": Coin,
	"=": Lava,
	"|": Lava,
	"v": Lava,
	"&": Monster
};