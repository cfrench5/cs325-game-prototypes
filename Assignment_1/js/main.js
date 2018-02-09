"use strict";

window.onload = function () {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

    function preload() {
        game.load.atlas('breakout', 'assets/games/breakout/breakout.png', 'assets/games/breakout/breakout.json');
        game.load.image('starfield', 'assets/misc/starfield.jpg');
    }

    var ball;
    var paddle;

    var ballOnPaddle = true;

    var lives = 1;
    var score = 0;

    var scoreText;
    var livesText;
    var introText;

    var s;

    function create() {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  We check bounds collisions against all walls other than the bottom one
        game.physics.arcade.checkCollision.down = false;

        s = game.add.tileSprite(0, 0, 800, 600, 'starfield');

        paddle = game.add.sprite(game.world.centerX, 500, 'breakout', 'paddle_big.png');
        paddle.anchor.setTo(0.5, 0.5);

        game.physics.enable(paddle, Phaser.Physics.ARCADE);

        paddle.body.collideWorldBounds = true;
        paddle.body.bounce.set(1);
        paddle.body.immovable = true;

        ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'breakout', 'ball_1.png');
        ball.anchor.set(0.5);
        ball.checkWorldBounds = true;

        game.physics.enable(ball, Phaser.Physics.ARCADE);

        ball.body.collideWorldBounds = true;
        ball.body.bounce.set(1);

        ball.animations.add('spin', ['ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png'], 50, true, false);

        ball.events.onOutOfBounds.add(ballLost, this);

        scoreText = game.add.text(32, 550, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
        livesText = game.add.text(680, 550, 'lives: 3', { font: "20px Arial", fill: "#ffffff", align: "left" });
        introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
        introText.anchor.setTo(0.5, 0.5);

        game.input.onDown.add(releaseBall, this);

    }

    function update() {

        //  Fun, but a little sea-sick inducing :) Uncomment if you like!
        // s.tilePosition.x += (game.input.speed.x / 2);

        paddle.x = game.input.x;

        if (paddle.x < 24) {
            paddle.x = 24;
        }
        else if (paddle.x > game.width - 24) {
            paddle.x = game.width - 24;
        }

        if (ballOnPaddle) {
            ball.body.x = paddle.x;
        }
        else {
            game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);

        }

    }

    function releaseBall() {

        if (ballOnPaddle) {
            ballOnPaddle = false;
            ball.body.velocity.y = -300;
            ball.body.velocity.x = -75;
            ball.animations.play('spin');
            introText.visible = false;
        }

    }

    function ballLost() {

        lives--;
        livesText.text = 'lives: ' + lives;

        if (lives === 0) {
            gameOver();
        }
        else {
            ballOnPaddle = true;

            ball.reset(paddle.body.x + 16, paddle.y - 16);

            ball.animations.stop();
        }

    }

    function gameOver() {

        ball.body.velocity.setTo(0, 0);

        introText.text = 'Game Over!';
        introText.visible = true;

    }

    function ballHitPaddle(_ball, _paddle) {

        var diff = 0;

        if (_ball.x < _paddle.x) {
            //  Ball is on the left-hand side of the paddle
            diff = _paddle.x - _ball.x;
            _ball.body.velocity.x = (-10 * diff);
            Score += 1;
        }
        else if (_ball.x > _paddle.x) {
            //  Ball is on the right-hand side of the paddle
            diff = _ball.x - _paddle.x;
            _ball.body.velocity.x = (10 * diff);
            Score += 1;
        }
        else {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            _ball.body.velocity.x = 2 + Math.random() * 8;
            Score += 1;
        }

    }

};
