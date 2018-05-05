
"use strict";

window.onload = function() {

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {
		preload : preload,
		create : create,
		update: update,
        render: render
	});

	function preload() {
	    game.load.image('map', 'assets/map.png');
	    game.load.image('map2', 'assets/map2.png');
	    game.load.image('player', 'assets/player.png');
	    game.load.image('shield', 'assets/shield.png');
	    game.load.image('start', 'assets/start_button.png');
	    game.load.image('greenBull', 'assets/green_bullet.png');
	    game.load.image('redBull', 'assets/red_bullet.png');
	    game.load.spritesheet('explode', 'assets/explode.png', 64, 64, 25);
	    game.load.audio('sound', 'assets/explode.mp3');
	    game.load.audio('bgm', 'assets/bgm.mp3');
	    game.load.audio('shield', 'assets/shield.mp3');
	}

	var start;
	var player;
	var shield;
	var greenBull;
	var redBull;
	var greenBullets;
	var redBullets;
	var state;
	var style;
	var text;
	var text2;
	var text3;
	var map;
	var map2;
	var ctr;
	var ctr2;
	var random;
	var fx;
	var explode;
	var bgm;
	var powerRdy;
	var power;
	var playerDead;
	var masterTimer;
	var fxShield;
	var playOnce;

	function create() {
	    game.physics.startSystem(Phaser.Physics.ARCADE);

	    masterTimer = 0;
	    playOnce = false;

	    fxShield = game.add.audio('shield');
	    fx = game.add.audio('sound');
	    bgm = game.add.audio('bgm');
	    map = game.add.sprite(400, 300, 'map');
	    map.anchor.set(0.5);
	    map2 = game.add.sprite(400, 300, 'map2');
	    map2.anchor.set(0.5);

	    player = game.add.sprite(350, 250, 'player');
	    player.anchor.set(0.5);
	    game.physics.enable(player, Phaser.Physics.ARCADE);
	    shield = game.add.sprite(1000, 1000, 'shield');
	    shield.anchor.set(0.5);

	    greenBullets = game.add.physicsGroup();
	    game.physics.enable(greenBullets, Phaser.Physics.ARCADE);
	    redBullets = game.add.physicsGroup();
	    game.physics.enable(redBullets, Phaser.Physics.ARCADE);

	    start = game.add.sprite(400, 300, 'start');
        start.anchor.set(0.5);
	    start.inputEnabled = true;
	    start.events.onInputDown.add(startButtonExec, this);
        
	    style = {
	        font: "18px Arial",
	        fill: "#ffffff",
	        align: "center"
	    };

	    text = game.add.text(747, 60, "", style);
	    text.anchor.x = 0.5;
	    text.anchor.y = 0.5;
	    text2 = game.add.text(400, 180, "", style);
	    text2.anchor.x = 0.5;
	    text2.anchor.y = 0.5;
	    text3 = game.add.text(53, 60, "", style);
	    text3.anchor.x = 0.5;
	    text3.anchor.y = 0.5;

	    state = 1;
	    ctr = 0;
	    ctr2 = 480;
	    powerRdy = false;
	    power = false;
	    playerDead = false;
	    random = game.rnd.between(20, 30);

	    //player.body.width = 25;
	    //player.body.height = 25;
	    player.body.setSize(40, 40, 5, 5);
	}

	function update() {
	    game.physics.arcade.collide(player, redBullets);

	    if (state == 2)
	    {
	        text3.text = "" + Math.floor(masterTimer / 60);
	        text3.bringToTop();

	        if (playerDead)
	        {
	            text2.text = "You died! You Lasted " + Math.floor(masterTimer / 60) + " seconds! Press ENTER to restart!";
                
	            if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
	                bgm.stop();
	                game.state.restart();
	            }
	        }

	        else
	        {
	            masterTimer++;
	        }
	        
	        ctr++;
	        redBullets.forEach(checkPos, this);
	        
	        if (power)
	        {
	            game.physics.arcade.overlap(player, redBullets, bulletExplode, null, this);
	        }

	        else
	        {
	            game.physics.arcade.overlap(player, redBullets, playerExplode, null, this);
	        }

	        ctr2++;
	        
	        if (game.input.activePointer.leftButton.isDown && powerRdy)
	        {
	            ctr2 = 0;
	        }

	        if (!powerRdy)
	        {
	            if (ctr2 < 50 && !playerDead)
	            {
	                power = true;
                    
	                if (!playOnce)
	                {
	                    fxShield.play();
	                    playOnce = true;
	                }

	                shield.x = player.x;
	                shield.y = player.y;
	            }
	            
	            else
	            {
	                power = false;
	                playOnce = false;
	                shield.x = 1000;
	                shield.y = 1000;
	            }
	        }

	        if (ctr2 >= 500)
	        {
	            ctr2 = 500;
	            powerRdy = true;
	            text.text = "READY";
	        }

	        else
	        {
	            powerRdy = false;
	            text.text = "WAIT...";
	        }
            
	        if (ctr >= random)
	        {
	            ctr = 0;
	            random = game.rnd.between(20, 30);
	            var random2 = game.rnd.between(1, 4);

	            if(random2 == 1)
	            {
	                var random3 = game.rnd.between(0, 3);
	                var s = redBullets.create(50, 150 + random3 * 100, 'redBull');
	                s.anchor.set(0.5);
	                s.body.velocity.x = 360;
	                s.body.immovable = true;
	                map.bringToTop();
	                text.bringToTop();
	            }

	            if (random2 == 2)
	            {
	                var random3 = game.rnd.between(0, 3);
	                var s = redBullets.create(750, 150 + random3 * 100, 'redBull');
	                s.anchor.set(0.5);
	                s.body.velocity.x = -360;
	                s.body.immovable = true;
	                map.bringToTop();
	                text.bringToTop();
	            }

	            if (random2 == 3)
	            {
	                var random3 = game.rnd.between(0, 5);
	                var s = redBullets.create(150 + random3 * 100, 50, 'redBull');
	                s.anchor.set(0.5);
	                s.body.velocity.y = 240;
	                s.body.immovable = true;
	                map.bringToTop();
	                text.bringToTop();
	            }

	            if (random2 == 4)
	            {
	                var random3 = game.rnd.between(0, 5);
	                var s = redBullets.create(150 + random3 * 100, 550, 'redBull');
	                s.anchor.set(0.5);
	                s.body.velocity.y = -240;
	                s.body.immovable = true;
	                map.bringToTop();
	                text.bringToTop();
	            }
	        }

	        
	        if(game.input.x < 125)
	        {
	            player.x = 125;
	        }

	        else if(game.input.x > 125 && game.input.x < 675)
	        {
	            player.x = game.input.x;
	        }

	        else if(game.input.x > 675)
	        {
	            player.x = 675;
	        }

	        if (game.input.y < 125) {
	            player.y = 125;
	        }

	        else if (game.input.y > 125 && game.input.y < 475) {
	            player.y = game.input.y;
	        }

	        else if (game.input.y > 475) {
	            player.y = 475;
	        }
	    }
	}
    /*
    function createTimer(){
 
        var me = this;
 
        me.timeLabel = me.game.add.text(me.game.world.centerX, 100, "00:00", {font: "100px Arial", fill: "#fff"});
        me.timeLabel.anchor.setTo(0.5, 0);
        me.timeLabel.align = 'center';
 
    }

    function updateTimer(){
 
        var me = this;
 
        var currentTime = new Date();
        var timeDifference = me.startTime.getTime() - currentTime.getTime();
 
        //Time elapsed in seconds
        me.timeElapsed = Math.abs(timeDifference / 1000);
 
        //Time remaining in seconds
        var timeRemaining = me.timeElapsed;
 
        //Convert seconds into minutes and seconds
        var minutes = Math.floor(timeRemaining / 60);
        var seconds = Math.floor(timeRemaining) - (60 * minutes);
 
        //Display minutes, add a 0 to the start if less than 10
        var result = (minutes < 10) ? "0" + minutes : minutes;
 
        //Display seconds, add a 0 to the start if less than 10
        result += (seconds < 10) ? ":0" + seconds : ":" + seconds;
 
        me.timeLabel.text = result;
 
    }
    */
	function startButtonExec() {
	    state = 2;
	    bgm.play();
	    start.x = 1000;
	    start.y = 1000;

	    //text.text = "" + state;
	}

	function checkPos(s) {
	    if(s.x < 50 || s.x > 750 || s.y < 50 || s.y > 550)
	    {
	        s.destroy();
	    }
	}

	function playerExplode(p, s) {
	    //text.text = "boom";
	    p.kill();
	    playerDead = true;
	    explode = game.add.sprite(p.body.x, p.body.y, 'explode');
	    explode.anchor.set(0.5);
	    var explosion = explode.animations.add('bam');
	    explode.animations.play('bam', 30, false);
	    fx.play();
	}

	function bulletExplode(p, s) {
	    //text.text = "boom";
	    s.kill();
	    explode = game.add.sprite(s.body.x, s.body.y, 'explode');
	    //explode.anchor.set(0.5);
	    var explosion = explode.animations.add('bam');
	    explode.animations.play('bam', 30, false);
	    fx.play();
	}

	function render()
	{
	    //player.sprite.body.width = 25;
	    //player.sprite.body.height = 25;
	    game.debug.body(player);
	}

}