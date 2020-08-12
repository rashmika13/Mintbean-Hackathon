import Phaser from "phaser";
import bg from "../assets/bg.png";

let graphics;
let cursors;

export default new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: "mainmenu" });
  },
  preload: function preload() {
    this.load.image("bg", bg);
  },

  create: function () {
    cursors = this.input.keyboard.createCursorKeys();

    graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, 800, 600);

    this.add.text(270, 300, "Press space to start.");
    this.add.text(270, 315, "Move with up, down, left, right.");
    this.add.text(270, 330, "Press spacebar to brake.");
    this.add.text(270, 345, "Kill all the dragons to win.");
  },
  update: function () {
    if (cursors.space.isDown) {
      this.scene.start("game");
    }
  },
});
