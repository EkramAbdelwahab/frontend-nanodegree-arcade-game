"use strict"

var app = app || {};

app.level = 1;
app.lifes = 3;
app.pause = false;
app.points = 0;
app.maxSpeed = 400;
app.levelUpPoint = 100;
app.allItems = new Map();


//function to randomlly choos between three numbers
app.randomNum = function () {
	
	var number = Math.floor((Math.random()*10)/3);
	return number;
};

//function to get x coordanate rocks & hearts
app.heartCreationRate = function() {
	var number = 0;
	switch(Math.floor(Math.random()*10)) {
		
		case 0:
			number = 0;
			break;
			
		case 1:
			number = 101;
			break;
			
		case 2:
			number = 202;
			break;
		
		case 3:
			number = 303;
			break;
		
		case 4:
			number = 404;
			break;
			
		case 5:
			number = 505;
			break;
			
		case 6:
			number = 606;
			break;
			
		case 7:
			number = 707;
			break;
			
		case 8:
			number = 808;
			break;
			
		case 9:
			number = 909;
			break;
	}
	return number;
};


//level up function 
app.levelUP = function () {
	var that = this;
	//update number of points and displaying them 
	this.level++;
	$("#level").text("level " + that.level);
	this.points += this.levelUpPoint;
	$("#points").text(that.points + " points");
	
	//delete hearts on level up
	this.deleteHearts();
	
	
    // randomly generate hearts items.
	if (this.heartCreationRate()%5===0) {
		
		var heart = new Heart();
		this.allItems.set(heart.key, heart);
	}
	
	if (this.level<=8 || (this.level >=25 && this.level%5 === 0)) {
		
		this.createEnemy();
	}
	
	if ((this.level >=10 && this.level < 26) && this.level%2=== 0) {
		
		var rock = new Rock();
		this.allItems.set(rock.key, rock);
	}
	
	
	if (this.level >=10 && this.level%2===1) {
        var gem = new Gem();
        this.allItems.set(gem.key, gem);
    }

    if (this.level > 30) {
        this.maxSpeed = 500;
    }
	//when reaching max number of level 
	//display the WON Modal 
	//and restart the game
	if (this.level === 40) {
		this.pause = true;
		$("#wonModal").modal('show');
		$(".restart").click( function() {
			that.restart();
		});
	}
	
};
// app.addLife and display a list of hearts to the player
app.addLife = function(up) {
	var element = $("ul").children();
	var elem;
	var that = this;
	if (up === true) {
		if(this.lifes < 3) {
			elem = element[this.lifes];
			$(elem).toggleClass('fontawesome-heart-empty fontawesome-heart');
			this.lifes++;
		}
		
	} else {
		this.lifes--;
		elem = element[this.lifes];
		$(elem).toggleClass('fontawesome-heart-empty fontawesome-heart');
			
			
		if(this.lifes === -1) {
			this.pause == true;
			this.gameOverImg();
			$("#gameOverModal").modal('show');
			$(".restart").click(function () {
				that.restart();
			});
		}
	}
	
	
	
};

//restart function to start game after winning
app.restart = function () {
	this.level = 1;
	this.maxSpeed = 400;
	this.points = 0;
	this.lifes = 3;
	this.allItems.clear();
	this.allEnemies = [];
	this.player.x = 404;
	this.player.y = 390;
	var that = this;
	
//reset points and leveels
	$("#level").text("level " + that.level);
	$("#points").text(that.points + " points");
	var element = $("ul").children();
	
	for(var i = 0; i < 3; i++)
	{
		var heartElem = element[i];
		$(heartElem).removeClass('fontawesome-heart-empty');
		$(heartElem).addClass('fontawesome-heart');
	
	}
	this.startGame();
	
};
//select char and start game
app.startGame = function() {
	var selected = null;
	var that = this;
	
	$("#startModal").modal('show');
	$(".char-element").click(function() {
		//check any char has been selected and adding a new class for it
		if(selected !== null)
		{
			$(selected).removeClass('char-selected');
		}
		//defining new player
		that.player.sprite = $(this).attr('src');
		$(this).addClass('char-selected');
		selected = $(this);
	});
	
	//start button 
	$("#startButton").off('click').on('click', function() {
		
		that.createEnemy();
		that.pause = false;
		
	});
};


//function to randamize choose the game over pic
app.gameOverImg = function() {
	var gameOverImg = $("#game-over");
	var itrat = this.randomNum();
	switch (itrat) {
		case 0: 
			$(gameOverImg).attr('src', 'images/gameover1.jpg');
			break;
			
		case 1:
			$(gameOverImg).attr('src', 'images/gameover2.jpg');
			break;
			
		case 2: 
			$(gameOverImg).attr('src', 'images/gameover3.jpg');
			break;
			
		default:
			$(gameOverImg).attr('src', 'images/gameover.jpg');
	}
};





var gameObj = function() {};

gameObj.prototype.getY = function() {
	var number = 0;
	switch(app.randomNum()) {
		case 0:
			number = 60;
			break;	
		case 1:
			number = 143;
			break;
			
		default:
			number = 226;
	}
	return number;	
};


var gameChar = function() {
	gameObj.call(this);
};


gameChar.prototype = Object.create(gameObj.prototype);
gameChar.prototype.constructor = gameChar;

gameChar.prototype.render = function() {
	
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

gameChar.prototype.getX = function() {
	var number = 0;
	switch(app.randomNum()) {
		case 0:
			number = -150;
			break;	
		case 1:
			number = -350;
			break;
			
		default:
			number = -550;
	}
	return number;	
};


//get speed function
gameChar.prototype.getSpeed = function() {
	return Math.floor(Math.random() * (app.maxSpeed - 100 + 1)) + 100;
};


// Enemies our player must avoid
var Enemy = function() {
    gameChar.call(this);
	this.x = this.getX();
	this.y = this.getY();
	this.speed = this.getSpeed();
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype = Object.create(gameChar.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed*dt;
	
	//if Enmy Crossed screen, new x, y and speed values
	if (this.x >= 1010) {
		this.x = this.getX();
		this.y = this.getY();
		this.speed = this.getSpeed();
	}
};

//player
var Player = function() {
	gameChar.call(this);
	//x and y position for the player
	this.playerXPos = 404;
	this.playerYPos = 390;
	this.x = this.playerXPos;
	this.y = this.playerYPos;
	
	//xplus and y plus used to manage rock interactivity
    this.xplus = 0;
    this.yplus = 0;
	this.sprite = 'images/char-boy.png';
	//player right and left limmits
	this.leftLimit = 0;
	this.rightLimit = 909;
	// x and y move
	this.Xmove = 101;
	this.Ymove = 83;
	
};

Player.prototype = Object.create(gameChar.prototype);
Player.prototype.constructor = Player;

//player area to play
Player.prototype.update = function() {
	//if player reach water, then reset its position
	if(this.y === -25) {
		this.x = this.playerXPos;
		this.y = this.playerYPos;
		app.levelUP();
		
	}
	//controlling player movement
	if (this.y >= this.playerYPos)
	{
		this.y = this.playerYPos;
	}
	
	if(this.x <= this.leftLimit)
	{
		this.x = this.leftLimit;
	}
	if(this.x >= this.rightLimit)
	{
		this.x = this.rightLimit;
	}
	
	// controlling rocks and hearts
	if (app.allItems.size > 0)
	{
		app.allItems.forEach(function(item) {
			if (this.x === item.x && (item.y - this.y <= 5 && item.y - this.y >= 0)) {
				if(item instanceof Rock) {
					//if item is a rock then return player to the previous position
					this.x -= this.xplus;
					this.y -= this.yplus;
				} else {
					if(item instanceof Gem) {
						app.points = app.points + item.GemValue;
						$("#points").text(app.points + " points");
						app.allItems.delete(item.key);
					} else {
						if (item instanceof Heart) {
							app.addLife(true);
							app.allItems.delete(item.key);
						}
					}
				}
			}
		}, this);
	}
	
};

//player move through playing area 
Player.prototype.handleInput = function(key) {
	this.xplus = 0;
	this.yplus = 0;
	
	switch (key) {
		case 'left':
			this.x -= this.Xmove;
			this.xplus = - this.Xmove;
			break;
		case 'right':
			this.x +=  this.Xmove;
			this.xplus = this.Xmove;
			break;
		case 'up':
			this.y -= this.Ymove;
			this.yplus = -this.Ymove;
			break;
		
		case 'down':
			this.y += this.Ymove;
			this.yplus = this.Ymove;
			break;
		
	}
};

//Rock, Gems, Hearts
var Item = function() {
	gameObj.call(this);
	this.x = this.getXCoord();
	this.y = this.getY();
	this.key = this.x.toString() + this.y.toString();
	this.chkCoord();
	
};
Item.prototype = Object.create(gameObj.prototype);
Item.prototype.constructor = Item;

Item.prototype.chkCoord = function() {
	while (app.allItems.has(this.key)) {
		this.x = this.getXCoord();
		this.y = this.getY();
		this.key = this.x.toString() + this.y.toString();
	}
	
};

Item.prototype.getXCoord = function () {
	var number = 0;
	switch(Math.floor(Math.random()*10)) {
		
		case 0:
			number = 0;
			break;
			
		case 1:
			number = 101;
			break;
			
		case 2:
			number = 202;
			break;
		
		case 3:
			number = 303;
			break;
		
		case 4:
			number = 404;
			break;
			
		case 5:
			number = 505;
			break;
			
		case 6:
			number = 606;
			break;
			
		case 7:
			number = 707;
			break;
			
		case 8:
			number = 808;
			break;
			
		case 9:
			number = 909;
			break;
	}
	return number;
	
};

Item.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Rock = function() {
	
	this.sprite = 'images/Rock.png';
	Item.call(this);
};
Rock.prototype = Object.create(Item.prototype);
Rock.prototype.constructor = Rock;


var Gem = function() {
	this.randomColor();
	Item.call(this);
	
}; 
Gem.prototype = Object.create(Item.prototype);
Gem.prototype.constructor = Gem;

//function to generate randome color 
Gem.prototype.randomColor = function() {
	var number = app.randomNum();
	if(number === 0) {
		this.sprite = 'images/Gem-Blue.png';
		this.GemValue = 300;
	} else {
		if (number === 1)
		{
			this.sprite = 'images/Gem-Orange.png';
            this.GemValue = 200;
		} else {
			this.sprite = 'images/Gem-Green.png';
            this.GemValue = 100;
		}
	}
	
	
};

var Heart = function() {
	this.sprite = 'images/Heart.png';
	Item.call(this);
	
};
Heart.prototype = Object.create(Item.prototype);
Heart.prototype.constructor = Heart;


//delet items(heart)
app.deleteHearts = function() {
	this.allItems.forEach (function (item) {
		if (item instanceof Gem || item instanceof Heart) {
			this.allItems.delete(item.key);
		}
	}, this);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
app.allEnemies = [];
app.player = new Player();

app.createEnemy = function() {
	this.allEnemies.push(new Enemy());
};



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
		32: 'space'
    };
//show or hide pause modal according pause or unpause condition
	if (e.keyCode === 32) {
		app.pause = !app.pause;
		if(app.pause === false) {
			$("#pauseModal").modal('hide');
		} else {
			$("#pauseModal").modal('show');
		}
	}
	// stoping player to move if the game is paused
	if (app.pause === false){
		app.player.handleInput(allowedKeys[e.keyCode]);
	}
});















