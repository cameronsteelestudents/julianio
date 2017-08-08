// Roam world follow camera
// A.I.
// collision with dots
// powerups

// broccoli
// brussel sprout
// carrot
// apple
// pineapple
// hash brown
// pancakes

// next game marble race

var gameObjects = [];
var enemies = [];
var chocolateChips = [];
var walls = [];
// var secretPhrase = 'Jules == creatorXD';

var canvas = document.getElementById('gameCanvas');
var tools = canvas.getContext('2d');

var gameOverScreen = document.getElementById('gameOVER');
gameOverScreen.style.display = 'none';
var gameUnderScreen = document.getElementById('gameUnder');
gameUnderScreen.style.display = 'none';

// var playerElement = document.getElementById('player');
// Aint no budy like u () aint no body like U oooooooooooo ooooooooo so rukin my ba b rockin by
var xp = 0;

var cursorPosition = new Vector2D();

tools.fillStyle = 'green';
// tools.fillRect(player.position.x, -player.position.y, 50, 50);

var player = new GameObject('images/Broccoli.png');
player.dimensions.x = 50;
player.dimensions.y = 50;

var specialAvailable = true;

var playerSpeed = 1;
var enemySpeed = 0.9999999999999;
var ableToMakeANewWall = true;
var invincible = false;

// var shieldItem = new Item(50, -150, 'shield');
// var superSpeed = new Item(300, -300, 'speedUp');

var enemy1 = new Enemy(300, 0, new Vector2D(1, 0));
var enemy2 = new Enemy(150, -500, new Vector2D(0, 1));
var enemy3 = new Enemy(400, -3.1415, new Vector2D(0,-1.12363287));

// A fiddle a fuzzle its time to solve my puzzle

var mostRecentLevelXP = 0;

var currentForm = 'broccoli';
var levelUpArray = [50, 150, 300, 1000, 2400, 4000];
var imageArray = ['brusselsprout', 'carrot','Applepen','Orange','Cutecookie','JELLO'];

function GameObject(img) {
	var me = this;

	me.type = false;

	me.position = new Vector2D();
	me.dimensions = new Vector2D();
	me.velocity = new Vector2D();

	me.dimensions.x = 10;
	me.dimensions.y = 10;

	if(img) {
		var imageObj = new Image();
		imageObj.src = img;
		me.imgObj = imageObj;
	} else {
		me.imgObj = false;
	}

	me.color = false;

	me.removeFromGame = function() {
		gameObjects.splice(gameObjects.indexOf(me), 1);
	}	

	gameObjects.push(me);
}

//KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
function Enemy(x, y, velocity) {
	var me = this;

	GameObject.call(this, 'images/derp.png');

	me.x = x;
	me.y = y;
	me.state = 'normal';
	me.type = 'enemy';
	me.velocity = velocity;
	me.dimensions.x = 50;
	me.dimensions.y = 50;
	me.position = new Vector2D(x, y);
	enemies.push(me);

	me.chipHit = function() {
		if(me.state == 'chocolateChip') {
			return;
		}

		var oldVX = me.velocity.x;
		var oldVY = me.velocity.y;

		me.velocity.x = 0;
		me.velocity.y = 0;
		me.imgObj.src = 'images/ChocolateChip.png';

		me.state = 'chocolateChip';

		setTimeout(function() {
			me.velocity.x = oldVX;
			me.velocity.y = oldVY;
			me.imgObj.src = 'images/derp.png';
			me.state = 'normal';
		}, 2000);
	}

	me.seedHit = function() {
		me.velocity.x = 0;
		me.velocity.y = 0;

		setTimeout(function() {
			me.velocity.x = 1;
			me.velocity.y = 1;
		}, 3000);
	}
}

function Item(x, y, type) {
	var image;
	if(type == 'shield') {
		image = 'images/shield.png';
	} else if(type == 'speedUp') {
		image = 'images/speedUp.png';
	} else if(type == 'slowDown') {
		image = 'images/slowdown.png';
	}

	GameObject.call(this, image);

	var me = this;
	me.type = type;
	me.x = x;
	me.y = y;
	me.position = new Vector2D(x, y);
	me.dimensions = new Vector2D(50, 50);
}

function Dot(size) {
	var me = this;
	GameObject.call(this);

	me.type = 'dot';
	me.dimensions.x = size;
	me.dimensions.y = size;
	me.size = size;
	me.position = new Vector2D();
}

initialize();

function Vector2D(x, y) {
	if(x == null) {
		x = 0;
	}

	if(y == null) {
		y = 0;
	}

	var me = this;
	me.x = x;
	me.y = y;

	me.add = function(vector) {
		var newVector = new Vector2D();
		newVector.x = me.x + vector.x;
		newVector.y = me.y + vector.y;
		return newVector;
	}

	me.subtract = function(vector) {
		var newVector = new Vector2D();
		newVector.x = me.x - vector.x;
		newVector.y = me.y - vector.y;
		return newVector;
	}

	me.getMagnitude = function() {
		return Math.sqrt(me.x * me.x + me.y * me.y);
	}

	me.normalize = function() {
		var magnitude = me.getMagnitude();
		
		if(magnitude != 0) {
			me.x /= magnitude;
			me.y /= magnitude;
		}
		// return new Vector2D(me.x / magnitude, me.y / magnitude);
	}

	me.scale = function(amount) {
		me.x *= amount;
		me.y *= amount;
	}
}

window.addEventListener('mousemove', function(event) {
	cursorPosition.x = event.clientX;
	cursorPosition.y = -event.clientY;
});

var seeds = [];
var fireballs = [];
window.addEventListener('keydown', function(event) {
	if(event.keyCode == 32) { // SPACEBAR
		if(currentForm == 'brusselsprout') {
			if(specialAvailable) {
				var decoy = new GameObject("images/brusselsprout2.png");
				decoy.position = new Vector2D(player.position.x, player.position.y);
				decoy.dimensions = new Vector2D(15,15);
				decoy.type = "decoy";
				specialAvailable = false; 
			}
		} else if(currentForm == "carrot") {
			if(specialAvailable) {
				playerSpeed += 1;
				setTimeout(function() {
					player -= 1;
				}, 20000);
				specialAvailable = false;
			}
		} else if(currentForm == "Orange") {
			if (specialAvailable) {
				var seed = new GameObject("images/seedling.png");
				seed.type = "seed";
				seed.position = new Vector2D(player.position.x, player.position.y);
				seed.dimensions = new Vector2D(15,20);
				seeds.push(seed);

				var differenceVector = cursorPosition.subtract(player.position);
				differenceVector.normalize();
				seed.velocity = differenceVector;

				specialAvailable = !true;
				setTimeout(function() {
					specialAvailable = true;
				}, 5000);

			}
		} else if(currentForm == 'Cutecookie') {
			if (specialAvailable) {
				var chocolateChip = new GameObject('images/ChocolateChip.png');
				chocolateChip.velocity = new Vector2D(3, 3);
				chocolateChip.position = new Vector2D(player.position.x, player.position.y);
				chocolateChips.push(chocolateChip);
				var chocolateChip = new GameObject('images/ChocolateChip.png');
				chocolateChip.velocity = new Vector2D(-3, -3);
				chocolateChip.position = new Vector2D(player.position.x, player.position.y);
				chocolateChips.push(chocolateChip);
				var chocolateChip = new GameObject('images/ChocolateChip.png');
				chocolateChip.velocity = new Vector2D(-3, 3);
				chocolateChip.position = new Vector2D(player.position.x, player.position.y);
				chocolateChips.push(chocolateChip);
				var chocolateChip = new GameObject('images/ChocolateChip.png');
				chocolateChip.velocity = new Vector2D(3, -3);
				chocolateChip.position = new Vector2D(player.position.x, player.position.y);
				chocolateChips.push(chocolateChip);
				var chocolateChip = new GameObject('images/ChocolateChip.png');
				chocolateChip.velocity = new Vector2D(-5, 7);
				chocolateChip.position = new Vector2D(player.position.x, player.position.y);
				chocolateChips.push(chocolateChip);
				var chocolateChip = new GameObject('images/ChocolateChip.png');
				chocolateChip.velocity = new Vector2D(2, 6);
				chocolateChip.position = new Vector2D(player.position.x, player.position.y);
				chocolateChips.push(chocolateChip);
				var chocolateChip = new GameObject('images/ChocolateChip.png');
				chocolateChip.velocity = new Vector2D(-1, 9);
				chocolateChip.position = new Vector2D(player.position.x, player.position.y);
				chocolateChips.push(chocolateChip);
				specialAvailable = !true;
				setTimeout(function() {
					specialAvailable = true;
				}, 1000);
			}
		} else if(currentForm == 'JELLO') {
			if(specialAvailable) {

				var fireball = new GameObject('images/FireBallwhos.png');
				fireball.position = player.position;
				fireball.dimensions = new Vector2D(50,50);
				fireballs.push(fireball);
				var differenceVector = cursorPosition.subtract(player.position);
				differenceVector.normalize();
				fireball.velocity = differenceVector;
				specialAvailable = !true;
				setTimeout(function() {
					specialAvailable = true;
				},2000);
			}
		}

	} else if(event.keyCode == 84) {
		// t key
		
		xp += 5000;
	} else if(event.keyCode == 37) {
		// left key
		if(currentForm == "Applepen" && ableToMakeANewWall == true) {
			var wall = new GameObject("images/red_line.gif");
			wall.position = new Vector2D(player.position.x - 10, player.position.y);
			wall.dimensions = new Vector2D(33.3333333333,100);
			wall.type = "wall";
			walls.push(wall);
			ableToMakeANewWall = false;
			setTimeout(function() {
				ableToMakeANewWall = true;
			}, 20009.127484932402349023);
			setTimeout(function() {
				wall.removeFromGame();
				walls.splice(walls.indexOf(wall), 1);

			}, 30033.11111111111111111111111111111111);
		}
	}
});

function movePlayer(x, y) {
	// player.position.x == 500
	player.position.x += x;
	player.position.y += y;
	// playerElement.style.left = player.position.x + 'px';
	// playerElement.style.top = -player.position.y + 'px';
}

function initialize() {
	for(var dotIndex = 0; dotIndex < 10; dotIndex++) {
		generateRandomDot();
	}
}

function generateRandomDot() {
	var randomSize = Math.floor(Math.random() * 20);
	var myDot = new Dot(randomSize);
	var randomX = Math.floor(Math.random() * 500);
	var randomY = Math.floor(Math.random() * -500);
	myDot.position.x = randomX;
	myDot.position.y = randomY;
}

function checkCollision(object1, object2) {
	var object1Width = object1.dimensions.x;
	var object1Height = object1.dimensions.y;

	var veryLeft1 = object1.position.x;
	var veryLeft2 = object2.position.x;
	var veryTop1 = object1.position.y;
	var veryTop2 = object2.position.y;
	var veryRight1 = object1.position.x + object1.dimensions.x;
	var veryRight2 = object2.position.x + object2.dimensions.x;
	var veryBottom1 = object1.position.y - object1.dimensions.y;
	var veryBottom2 = object2.position.y - object2.dimensions.y;

	// console.log([veryLeft1, veryTop1])
	// console.log([veryLeft2, veryTop2, veryRight2, veryBottom2])

	if(veryRight1 < veryLeft2) {
		// NO COLLISION! ACTUALLY MAYYYYY no.
		return false;
	}

	if(veryBottom1 > veryTop2) {
		// STILL NO COLLISION OOOOOOHH YEAHHHHH!!!!
		return false;
	}

	if(veryLeft1 > veryRight2) {
		// THERES A GAP ARRRR IM A PIRATE
		return false;
	}

	if(veryTop1 < veryBottom2) {
		// GAP!!!! NO COLLISION
		return false;
	}

	return true;
}

function generateItem() {
	var randomNumber = Math.random();

	var nature = false;

	if(randomNumber < 0.333333333333333333) {
		nature = 'shield';
	} else if (randomNumber < 0.666666666666) {
		nature = 'slowDown';
	} else {
		nature = 'speedUp'
	}

	new Item(Math.random() * 700, Math.random() * -700, nature);

	setTimeout(function() {
		generateItem();
	}, 30000);
}

generateItem();

var lastDotTime = new Date();
function update() {
	tools.clearRect(0, 0, 1000, 1000);

	var currentDotTime = new Date();
	if(currentDotTime - lastDotTime > 1000) {
		// var randomSize = Math.floor(Math.random() * 20);
		// var myDot = new Dot(randomSize);
		// var randomX = Math.floor(Math.random() * 700);
		// var randomY = Math.floor(Math.random() * -700);
		// myDot.position.x = randomX;
		// myDot.position.y = randomY;
		// lastDotTime = currentDotTime;
		//Jayden and cameron r cood ceaple pls dnt b mean 2 dem
	}

	// move the player slightly in the direction

	var directionVector = cursorPosition.subtract(player.position);
	// directionVector = directionVector.normalize();
	directionVector.normalize();
	directionVector.scale(playerSpeed);
	// console.log(directionVector)
	player.position = player.position.add(directionVector);

	for(var enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
		var enemy = enemies[enemyIndex];

		if(enemy.position.x > 500) {
			enemy.velocity.x = -1 * enemySpeed;
			enemy.velocity.y = Math.random();
		} else if(enemy.position.x < 0) {
			enemy.velocity.x = 1  * enemySpeed;
		}

		if(enemy.position.y > 0) {
			enemy.velocity.y = -1 * enemySpeed;
		} else if(enemy.position.y < -500) {
			enemy.velocity.y = 1 * enemySpeed;
		}

		for(var seedIndex = 0; seedIndex < seeds.length; seedIndex++) {
			var seed = seeds[seedIndex];
			if(checkCollision(enemy, seed)) {
				enemy.seedHit();
			}
		}

		for(var chipIndex = 0; chipIndex < chocolateChips.length; chipIndex++) {
			var chip = chocolateChips[chipIndex];
			if(checkCollision(enemy, chip)) {
				enemy.chipHit();
			}
		}

		for(var fireballIndex = 0; fireballIndex < fireballs.length; fireballIndex++) {
			var fireball = fireballs[fireballIndex];
			if(checkCollision(enemy, fireball)){
				enemy.removeFromGame();
				enemies.splice(enemyIndex, 1);
				if(enemies.length == 0) {
					gameUnderScreen.style.display = 'block';
				}

				enemyIndex--;
			}
		}

		for(var wallIndex = 0; wallIndex < walls.length; wallIndex++) {
			var wall = walls[wallIndex];
			if(checkCollision(enemy, wall)) {
				// bounce off
				enemy.velocity.x *= -1;
				enemy.velocity.y *= -1;
			} 
		}
	}

	for(var goIndex = 0; goIndex < gameObjects.length; goIndex++) {
		var gameObject = gameObjects[goIndex];

		gameObject.position = gameObject.position.add(gameObject.velocity);

		tools.fillStyle = 'black';
		tools.fillRect(gameObject.position.x, -gameObject.position.y, gameObject.dimensions.x, gameObject.dimensions.y);

		if(gameObject.imgObj) {
			tools.drawImage(gameObject.imgObj, gameObject.position.x, -gameObject.position.y, gameObject.dimensions.x, gameObject.dimensions.y);
		}

		if(gameObject != player) {
			if(checkCollision(gameObject, player)) {
				if(gameObject.type == 'dot') {
					gameObject.removeFromGame();
					generateRandomDot();
					goIndex -= 1;

					xp += gameObject.dimensions.x;
					if(xp > levelUpArray[0]) {
						// LEVEL UP!
						var image = imageArray.shift();
						var newImage = 'images/' + image + '.png';
						player.imgObj.src = newImage;
						mostRecentLevelXP = levelUpArray.shift();
						currentForm = image;
						enemySpeed += 0.3;
						specialAvailable = true;
					}
				} else if(gameObject.type == 'enemy') {
					if (!invincible) {
						xp -= 1;
						if(xp < mostRecentLevelXP) {
							// game over
							gameOverScreen.style.display = 'block';
						}
					}
				} else if(gameObject.type == 'shield') {
					gameObject.removeFromGame();
					invincible = true;
					setTimeout(function() {
						invincible = false;
					}, 10000);
				} else if(gameObject.type == 'speedUp') {
					gameObject.removeFromGame();
					playerSpeed += 1;
					setTimeout(function() {
						playerSpeed -= 1;
					}, 10000);
				} else if(gameObject.type == 'slowDown') {
					gameObject.removeFromGame()
					enemySpeed *= 0.25;
					for (var enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
						var enemy = enemies[enemyIndex];
						enemy.velocity.scale(0.25);
					}

					setTimeout(function() {
						enemySpeed *= 4;
						for (var enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
							var enemy = enemies[enemyIndex];
							enemy.velocity.scale(4);
						}
					}, 10000);
				} else if(gameObject.type == "decoy") {
					gameObject.removeFromGame();
					xp += Math.floor(Math.random() * 100);
				}
			}
		}
	}

	tools.fillText(xp + " XP", 0, 10);

	// tools.fillRect(player.position.x, -player.position.y, 50, 50);
	// So rockin baby rockin by I dont want 
	setTimeout(update, 15);
}

update();
