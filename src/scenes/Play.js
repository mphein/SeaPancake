class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
  }
  
  preload() {
    // Load images and Stingray atlas
    this.load.image('ocean', './assets/Background/Ocean.png');
    this.load.image('clouds', './assets/Background/Cloud.png');
    this.load.image('sun', './assets/Background/Sun.png');
    this.load.image('Pancake', './assets/Pancake.png');
    this.load.atlas('Stingray', './assets/Stingray/Stingray.png', './assets/Stingray/Stingray.json');
    this.load.atlas('Shark', './assets/Shark/Shark.png', './assets/Shark/Shark.json');
  }

  create() {
    // Add background music to Scene on repeat
    this.backgroundMusic = this.sound.add('playSong', {volume: .2, loop: true});
    this.backgroundMusic.play();
    // Add munch sfx
    this.munch = this.sound.add('munch', {volume: 2});
    // Create Stingray and Shark swim animation
    this.anims.create({
      key: "swim",
      frameRate: 32,
      frames: this.anims.generateFrameNames('Stingray', {
        prefix: 'Stingray',
        suffix: '.png',
        start: 0,
        end: 31
      }),
      repeat: -1,
    })

    this.anims.create({
      key: "sharkSwim",
      frameRate: 32,
      frames: this.anims.generateFrameNames('Shark', {
        prefix: 'Shark',
        suffix: '.png',
        start: 0,
        end: 4
      }),
      repeat: -1,
    })

    // Add in scrolling backgrounds
    this.sun = this.add.tileSprite(0,0,640,480,'sun').setOrigin(0,0);
    this.ocean = this.add.tileSprite(0,0,640,480,'ocean').setOrigin(0,0);
    this.clouds = this.add.tileSprite(0,0,640,480,'clouds').setOrigin(0,0);
    
    // create sprites
    this.shark1 = new Shark(this, w, 200, 160, (h + 160)/2, 'Shark','Shark0.png').setOrigin(0,.5)
    this.shark2 = new Shark(this, w, 400, (h + 160)/2, h, 'Shark', 'Shark3.png').setOrigin(0,.5)
    this.stingray = new Stingray(this, 50, game.config.height / 1.5, 'Stingray', 'Stingray0.png').setOrigin(.5,0);
    this.stingray.play('swim');
    this.shark1.play('sharkSwim');
    this.shark2.play('sharkSwim');
    this.shark1.setSize(120,50,true);
    this.shark2.setSize(120,50,true);
    this.pancake = new Pancake(this, w, 300, 160, h, 'Pancake');

    // Define scene booleans and keys
    this.stingray.eaten = false;
    this.score = 0;
    keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.gameOver = false;
    
    // Score configuration
    this.scoreConfig = {
            fontFamily: 'Brush Script MT',
            fontSize: '28px',
            color: '#000000',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
      this.scoreLeft = this.add.text(20, 20, this.score, this.scoreConfig);

      // Define shark speedup loop currently set to 10 sec
      this.speedySharks = this.time.addEvent({
        delay: 10000, 
        callback: ()=> {
          this.shark1.speed *= Math.random() + 1;
          this.shark2.speed *= Math.random() + 1;
          console.log(this.shark1.speed);
          console.log(this.shark2.speed);
        },
        loop: true
      })
      // Pancake power up
      this.slowSharks = this.time.addEvent({
        delay: 30000, 
        callback: ()=> {
          console.log('PANCAKE');
          this.pancake.speed = 2;
        },
        loop: true
      })
  }

  update() {
    // Game over
    if (this.gameOver) {
      if (this.score > highScore) {
        highScore = this.score;
      }
      score = this.score;
      this.backgroundMusic.stop();
      this.scene.start('endScene');
    }
    // Update positions, score, check for collisions
    if (!this.gameOver) {
      this.score++;
      this.scoreLeft.setText(this.score);
      this.sun.tilePositionX += .25;
      this.clouds.tilePositionX += .5;
      this.ocean.tilePositionX += 4;
      this.stingray.update();
      this.shark1.update();
      this.shark2.update();
      this.pancake.update();
      this.physics.world.collide(this.stingray, this.shark1, this.sharkCollision, null, this);
      this.physics.world.collide(this.stingray, this.shark2, this.sharkCollision, null, this);
      this.physics.world.collide(this.pancake, this.stingray, this.pancakeCollision, null, this);
    }
  }
  // Shark collision
  sharkCollision() {
    this.sound.play('munch');
    this.stingray.eaten = true;
    this.stingray.destroy();
    this.gameOver = true;
  }
  // Pancake collision
  pancakeCollision() {
    this.sound.play('bubbleUp');
    this.shark1.speed /= 2;
    this.shark2.speed /= 2;
    this.pancake.stop();
  }
}

