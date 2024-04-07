import Phaser from 'phaser'
import { MAP, ATTACK_RANGE } from '../config'

export default class Bullet extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet')
        this.dx = 0
        this.dy = 0
        this.lifespan = 0
        this.speed = Phaser.Math.GetSpeed(600, 1)
    }

    fire(x, y, angle) {
        this.setActive(true)
        this.setVisible(true)
        //  Bullets fire from the middle of the screen to the given x/y
        this.setPosition(x, y)
        //  we don't need to rotate the bullets as they are round
        //  this.setRotation(angle);
        this.dx = Math.cos(angle)
        this.dy = Math.sin(angle)
        this.lifespan = 300
    }

    update(time, delta) {
        if (!this.scene.onPause) {
            this.lifespan -= delta
            this.x += this.dx * (this.speed * delta) * this.scene.attackSpeed
            this.y += this.dy * (this.speed * delta) * this.scene.attackSpeed
            if (this.lifespan <= 0) {
                this.setActive(false)
                this.setVisible(false)
            }
        }
    }
}
