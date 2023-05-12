class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
  }
  
  preload() {
    // Load images and Stingray atlas
    this.load.image('ocean', './assets/Background/Ocean.png');
    this.load.image('clouds', './assets/Background/Cloud.png');
    this.load.image('sun', './assets/Background/Sun.png');
    this.load.image('shark', './assets/Shark.png')
    this.load.atlas('Stingray', './assets/Stingray/Stingray.png', './assets/Stingray/Stingray.json');
  }

  create() {
    // Add background music to Scene on repeat
    this.backgroundMusic = this.sound.add('playSong', {volume: .2, loop: true});
    this.backgroundMusic.play();
    // Create Stingray swim animation
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
    // Add in scrolling backgrounds
    this.sun = this.add.tileSprite(0,0,640,480,'sun').setOrigin(0,0);
    this.ocean = this.add.tileSprite(0,0,640,480,'ocean').setOrigin(0,0);
    this.clouds = this.add.tileSprite(0,0,640,480,'clouds').setOrigin(0,0);
    // create sprites
    this.shark1 = new Shark(this, w, 200, 160, (h + 160)/2, 'shark').setOrigin(0,.5)
    this.shark2 = new Shark(this, w, 400, (h + 160)/2, h, 'shark').setOrigin(0,.5)
    this.stingray = new Stingray(this, 50, game.config.height / 1.5, 'Stingray', 'Stingray0.png').setOrigin(.5,0);
    this.stingray.play('swim');

    // Define scene booleans and keys
    this.stingray.eaten = false;
    this.score = 0;
    this.lives = 3;
    keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.gameOver = false;
    
    //
    this.gameOverConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#F00000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
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
  }

  update() {
    if (this.gameOver) {
      this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.gameOverConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart', this.gameOverConfig).setOrigin(0.5);
      if (Phaser.Input.Keyboard.JustDown(keyR)) {
        this.sound.play('waterBoop')
        this.backgroundMusic.stop();
        this.scene.restart();
      }
    }

    if (!this.gameOver) {
      this.sun.tilePositionX += .25;
      this.clouds.tilePositionX += .5;
      this.ocean.tilePositionX += 4;
      this.stingray.update();
      this.shark1.update();
      this.shark2.update();

      this.physics.world.collide(this.stingray, this.shark1, this.sharkCollision, null, this);
      this.physics.world.collide(this.stingray, this.shark2, this.sharkCollision, null, this);
    }
  }

  sharkCollision() {
    this.stingray.eaten = true;
    this.stingray.destroy();
    this.gameOver = true;
  }
}

