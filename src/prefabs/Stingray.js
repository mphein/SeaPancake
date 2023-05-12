class Stingray extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene,x,y,texture,frame);

    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.alive = true;
    this.velocity = 50

    // physics settings
    this.setCollideWorldBounds(true);
    this.setImmovable();
    this.setMaxVelocity(0, 150);
    this.setGravity(0,50);
  }

  update() {
    if (this.alive) {
      if (this.y <= 165) {
        if (keyDOWN.isDown) {
          this.body.velocity.y = this.velocity;
          console.log('down');
        } else {
          this.body.velocity.y = this.velocity / 2;
        }
      } else {
        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
            console.log('up');
            this.body.velocity.y = -this.velocity;
          } else if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.body.velocity.y = this.velocity;
            console.log('down');
          }
        }
      }
    }
  }