import Phaser from "phaser";
import mp3 from "../assets/Orbital Colossus.mp3";
import background from "../assets/scifi_platform_BG1.jpg";
import tiles from "../assets/scifi_platformTiles_32x32.png";
import bg from "../assets/bg.png";
import princess2 from "../assets/princess2.png";
import treasure from "../assets/treasure.png";
import dragon from "../assets/dragon.png";
import star from "../assets/star.png";
import { accelerate, decelerate } from "../utils";

let box;
let cursors;

export default new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: "game" });
    window.GAME = this;
  },
  preload: function preload() {
    this.load.image("bg", bg);
    this.load.image("dragon", dragon);
    this.load.image("princess2", princess2);
    this.load.image("treasure", treasure);

    this.load.spritesheet("tiles", tiles, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.image("star", star);
  },
  create: function create() {
    var h = this.game.config.height;
    var w = this.game.config.width;

    let bg = this.add.sprite(0, 0, "bg");
    bg.setOrigin(0, 0);
    bg.displayWidth = w;
    bg.displayHeight = h;

    const dragons = this.physics.add.group({
      key: "dragon",
      repeat: 11,
      setScale: { x: 0.5, y: 0.5 },
      setXY: { x: 400, y: 300 },
    });

    dragons.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.setVelocityX(150 - Math.random() * 300);
      child.setVelocityY(150 - Math.random() * 300);
      child.setBounce(1, 1);
      child.setCollideWorldBounds(true);
    });

    cursors = this.input.keyboard.createCursorKeys();

    box = this.physics.add.image(400, 100, "princess2", 15);

    const processCollision = (box, dragon) => {
      dragon.destroy();

      const dragonsLeft = dragons.countActive();
      if (dragonsLeft === 0) {
        var princess2 = this.physics.add.staticImage(600, 300, "princess2");
        var treasure = this.physics.add.image(200, 300, "treasure");

        this.physics.accelerateToObject(treasure, princess2, 60, 300, 300);

        var collider = this.physics.add.overlap(
          treasure,
          princess2,
          function (treasureToPrincess) {
            this.scene.start("winscreen");

            this.physics.world.removeCollider(collider);
          },
          null,
          this
        );
      }
    };

    this.physics.add.collider(dragons, box, processCollision, null, this);

    box.setBounce(1, 1);
    box.setCollideWorldBounds(true);
  },
  update: function () {
    const { velocity } = box.body;

    if (cursors.space.isDown) {
      const x = decelerate(velocity.x);
      const y = decelerate(velocity.y);
      box.setVelocity(x, y);
    }

    if (cursors.up.isDown) box.setVelocityY(accelerate(velocity.y, -1));
    if (cursors.right.isDown) box.setVelocityX(accelerate(velocity.x, 1));
    if (cursors.down.isDown) box.setVelocityY(accelerate(velocity.y, 1));
    if (cursors.left.isDown) box.setVelocityX(accelerate(velocity.x, -1));
  },
});
