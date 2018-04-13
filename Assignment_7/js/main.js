
"use strict";

window.onload = function() {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
		preload : preload,
		create : create,
		update : update
	});

	function preload() {
	    game.load.spritesheet('blocks', 'assets/blocks.PNG', 100, 100);
	    game.load.image('p1', 'assets/p1.png');
	    game.load.image('p2', 'assets/p2.png');
	    game.load.image('rolldice', 'assets/rolldice.png');
	    game.load.image('select', 'assets/select.png');
	    game.load.audio('playermove', 'assets/playermove.mp3');
	    game.load.audio('dicesound', 'assets/dicesound.mp3');
	    game.load.audio('bgm', 'assets/bgm.mp3');
	}

	var blocks;
	var up1s;
	var p1;
	var p2;
	var st;
	var rolldice;
	var text;
	var textp1;
	var textp2;
	var p1score;
	var p2score;
	var style;
	var rand;
	var select;
	var isSelected;
	var fxplayermove;
	var fxdiceroll;
	var fxbgm;

	function create() {
	    game.physics.startSystem(Phaser.Physics.ARCADE);
	    blocks = game.add.group();
	    up1s = game.add.group();
	    fxplayermove = game.add.audio('playermove');
	    fxdiceroll = game.add.audio('dicesound');
	    fxbgm = game.add.audio('bgm');
	    fxbgm.play();

	    for(var i = 0; i < 5; i++)
	    {
	        for(var j = 0; j < 5; j++)
	        {
	            if (!((i == 1 && j == 1) || (i == 1 && j == 3) || (i == 3 && j == 1) || (i == 3 && j == 3)))
	            {
	                
	                var k = blocks.create(200 + 100 * i, 100 + 100 * j, 'blocks', 1);
	                k.anchor.set(0.5);
	                k.inputEnabled = true;
	                k.input.pixelPerfectOver = true;
	                k.input.priorityID = 2;
	            }
	        }
	    }
	    var k = blocks.create(100, 100, 'blocks', 3);
	    k.anchor.set(0.5);
	    k.inputEnabled = true;
	    k.input.pixelPerfectOver = true;
	    k.input.priorityID = 2;

	    k = blocks.create(700, 500, 'blocks', 3);
	    k.anchor.set(0.5);
	    k.inputEnabled = true;
	    k.input.pixelPerfectOver = true;
	    k.input.priorityID = 2;

	    select = game.add.sprite(1000, 1000, 'select');
	    select.anchor.set(0.5);
	    select.inputEnabled = true;
	    select.input.priorityID = 0;

	    p1 = game.add.sprite(100, 100, 'p1'); 
	    p1.anchor.set(0.48);
	    p1.inputEnabled = true;
	    p1.input.pixelPerfectOver = true;
	    p1.input.priorityID = 0;
	    p1.alpha = 0.8;

	    p2 = game.add.sprite(700, 500, 'p2');
	    p2.anchor.set(0.52);
	    p2.inputEnabled = true;
	    p2.input.pixelPerfectOver = true;
	    p2.input.priorityID = 0;
	    p2.alpha = 0.8;

	    rolldice = game.add.sprite(725, 300, 'rolldice');
	    rolldice.anchor.set(0.5);
	    rolldice.inputEnabled = true;
	    rolldice.input.priorityID = 1;

	    st = 1;
	    style = { font: "30px Arial", fill: "#ff0000", align: "center" };
	    text = game.add.text(400, 30, '', style);
	    text.anchor.set(0.5);
	    textp1 = game.add.text(100, 200, '', style);
	    text.anchor.set(0.5);
	    textp2 = game.add.text(700, 400, '', style);
	    text.anchor.set(0.5);
        p1score = 0;
        p2score = 0;

	    blocks.forEach(function(each) {
            if(each.frame == 1) {
            	var r = game.rnd.between(1, 3);
            	if(r == 1){
            		var w = up1s.create(each.x, each.y, 'blocks', 2);
	                w.anchor.set(0.5);
            	}
            }
        }, this);
	    
	}

	function update() {
	    isSelected = false;

	    textp1.text = p1score;
	    textp2.text = p2score;

	    if((p1score >= 4 && p1.x == 100 && p1.y == 100) || (p1score >= 4 && p1.x == p2.x && p1.y == p2.y)){
	    	st = 100;
	    	text.text = "Player 1 won!";
	    }
	    if((p2score >= 4 && p2.x == 700 && p2.y == 500) || (p2score >= 4 && p2.x == p1.x && p2.y == p1.y)){
	    	st = 100;
	    	text.text = "Player 2 won!";
	    }
	    
	    if(st == 1)
	    {
	    	text.text = "Player 1: roll the dice.";
	        if(rolldice.input.pointerOver() && game.input.activePointer.leftButton.isDown)
	        {
	            fxdiceroll.play();
	            rand = game.rnd.between(1, 3);
	            text.text = "You Rolled " + rand + "!";
	            st = 2;
	        }
	    }

	    if(st == 2)
	    {
	        blocks.forEach(function(each) {
                if(each.input.pointerOver()) {
                	if((Math.abs(p1.x - each.x) + Math.abs(p1.y - each.y)) / 100 == rand){
                		select.x = each.x;
                        select.y = each.y;
                        isSelected = true;
                	}
                    
                }
	        }, this);

	        if(!isSelected) {
	        	select.x = 1000;
		        select.y = 1000;
	        }
	        if(game.input.activePointer.leftButton.isDown && select.x != 1000 && select.y != 1000) {
	        	fxplayermove.play();
	        	p1.x = select.x;
	        	p1.y = select.y;
	        	select.x = 1000;
	        	select.y = 1000;
	        	isSelected = false;
	        	up1s.forEach(function(up1) {
	                if(up1.x == p1.x && up1.y == p1.y) {
	                	p1score++;
	                	up1.destroy();
	                }
	        	}, this);
                
	        	st = 3;
	        }
	    }

	    if(st == 3)
	    {
	        text.text = "Player 2: roll the dice.";

	        if(rolldice.input.pointerOver() && game.input.activePointer.leftButton.isDown)
	        {
	            fxdiceroll.play();
	        	rand = game.rnd.between(1, 3);
	            text.text = "You Rolled " + rand + "!";
	            st = 4;
	        }
	    }

	    if(st == 4)
	    {
	        blocks.forEach(function(each) {
                if(each.input.pointerOver()) {
                	if((Math.abs(p2.x - each.x) + Math.abs(p2.y - each.y)) / 100 == rand){
                		select.x = each.x;
                        select.y = each.y;
                        isSelected = true;
                	}
                    
                }
	        }, this);

	        if(!isSelected) {
	        	select.x = 1000;
		        select.y = 1000;
	        }
	        if(game.input.activePointer.leftButton.isDown && select.x != 1000 && select.y != 1000) {
	        	fxplayermove.play();
	        	p2.x = select.x;
	        	p2.y = select.y;
	        	select.x = 1000;
		        select.y = 1000;
	        	isSelected = false;
	        	up1s.forEach(function(up1) {
	                if(up1.x == p2.x && up1.y == p2.y) {
	                	p2score++;
	                	up1.destroy();
	                }
	        	}, this);
                
	        	st = 1;
	        }
	    }
	}
}