"use strict";

window.onload = function() {

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {
		preload : preload,
		create : create,
		update : update,
		render : render
	});


	function preload() {

	    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	    game.load.image('background', 'assets/background.png');
	    game.load.image('bar', 'assets/bar.png');
	    game.load.image('egg', 'assets/egg.png');
	    game.load.audio('clear', 'assets/clear2.mp3');
	}

	var egg;
	var bar1;
	var bar2;
	var bar3;
	var bar4;
	var bar5;
	var player;
	var facing = 'left';
	var jumpTimer = 0;
	var cursors;
	var jumpButton;
	var bg;
	var clear;
	var text;
	var style;
	var stage = 1;

	function create() {

	    game.physics.startSystem(Phaser.Physics.ARCADE);

	    game.add.sprite(0, 0, 'background');

	    style = {
	        font: "30px Arial",
	        fill: "#ffffff",
	        align: "center"
	    };

	    clear = game.add.audio('clear');

	    text = game.add.text(400, 100, '', style);
	    text.anchor.set(0.5);

	    if (stage == 1)
	    {
	        egg = game.add.sprite(360, 200, "egg");
	        bar1 = game.add.sprite(100, 520, "bar");
	        bar2 = game.add.sprite(200, 460, "bar");
	        bar3 = game.add.sprite(320, 400, "bar");
	        bar4 = game.add.sprite(440, 460, "bar");
	        bar5 = game.add.sprite(540, 520, "bar");
	    }

	    if (stage == 2) {
	        egg = game.add.sprite(740, 0, "egg");
	        bar1 = game.add.sprite(700, 520, "bar");
	        bar2 = game.add.sprite(700, 440, "bar");
	        bar3 = game.add.sprite(700, 200, "bar");
	        bar4 = game.add.sprite(700, 360, "bar");
	        bar5 = game.add.sprite(700, 280, "bar");
	    }

	    game.physics.arcade.gravity.y = 300;

	    player = game.add.sprite(32, 320, 'dude');
	    game.physics.enable(player, Phaser.Physics.ARCADE);
	    game.physics.enable(egg, Phaser.Physics.ARCADE);
	    game.physics.enable(bar1, Phaser.Physics.ARCADE);
	    game.physics.enable(bar2, Phaser.Physics.ARCADE);
	    game.physics.enable(bar3, Phaser.Physics.ARCADE);
	    game.physics.enable(bar4, Phaser.Physics.ARCADE);
	    game.physics.enable(bar5, Phaser.Physics.ARCADE);

	    bar1.body.allowGravity = false;
	    bar2.body.allowGravity = false;
	    bar3.body.allowGravity = false;
	    bar4.body.allowGravity = false;
	    bar5.body.allowGravity = false;

	    bar1.body.immovable = true;
	    bar2.body.immovable = true;
	    bar3.body.immovable = true;
	    bar4.body.immovable = true;
	    bar5.body.immovable = true;

	    player.body.collideWorldBounds = true;
	    player.body.gravity.y = 1000;
	    player.body.maxVelocity.y = 500;
	    player.body.setSize(20, 32, 5, 16);

	    player.animations.add('left', [0, 1, 2, 3], 10, true);
	    player.animations.add('turn', [4], 20, true);
	    player.animations.add('right', [5, 6, 7, 8], 10, true);

	    cursors = game.input.keyboard.createCursorKeys();
	    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	}

	function update() {

	    game.physics.arcade.collide(player, bar1);
	    game.physics.arcade.collide(player, bar2);
	    game.physics.arcade.collide(player, bar3);
	    game.physics.arcade.collide(player, bar4);
	    game.physics.arcade.collide(player, bar5);
	    game.physics.arcade.collide(egg, bar3);

	    if (game.physics.arcade.overlap(player, egg))
	    {
	        stage++;
	        clear.play();
	        game.state.restart();
	    }

	    if (stage == 3)
	    {
	        player.kill();
            text.text = 'You won! Press ENTER to restart!'
	    }

	    if (stage == 3 && game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
	    {
	        stage = 1;
	        game.state.restart();
	    }

	    player.body.velocity.x = 0;

	    if (cursors.left.isDown) {
	        player.body.velocity.x = -150;

	        if (facing != 'left') {
	            player.animations.play('left');
	            facing = 'left';
	        }
	    }
	    else if (cursors.right.isDown) {
	        player.body.velocity.x = 150;

	        if (facing != 'right') {
	            player.animations.play('right');
	            facing = 'right';
	        }
	    }
	    else {
	        if (facing != 'idle') {
	            player.animations.stop();

	            if (facing == 'left') {
	                player.frame = 0;
	            }
	            else {
	                player.frame = 5;
	            }

	            facing = 'idle';
	        }
	    }

	    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down) && game.time.now > jumpTimer) {
	        player.body.velocity.y = -500;
	        jumpTimer = game.time.now + 750;
	    }

	}

	function render() {

	    // game.debug.text(game.time.physicsElapsed, 32, 32);
	    // game.debug.body(player);
	    //game.debug.bodyInfo(player, 16, 24);

	}


}
