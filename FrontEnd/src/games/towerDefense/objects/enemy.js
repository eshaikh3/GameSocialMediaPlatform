import Phaser from 'phaser'
import { ENEMY_SPEED, ENEMY_HP, ENEMY_LOOT, enemyPath } from '../config'

export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprites', 'zombie')
        this.play('walk')
        this.setScale(0.15)
        this.towardsRight = true
        this.changeDirection = false
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() }
        this.loot = ENEMY_LOOT
        this.speed = ENEMY_SPEED
    }

    update(time, delta) {
        if (!this.scene.onPause && !this.dead) {
            if (this.changeDirection) {
                this.toggleFlipX()
                this.changeDirection = false
            }
            // move the t point along the path, 0 is the start and 0 is the end
            this.follower.t += this.speed * this.scene.speed * delta
            // get the new x and y coordinates in vec
            enemyPath.getPoint(this.follower.t, this.follower.vec)

            if (this.follower.vec.x > this.x && !this.towardsRight) {
                this.towardsRight = true
                this.changeDirection = true
            }

            if (this.follower.vec.x < this.x && this.towardsRight) {
                this.towardsRight = false
                this.changeDirection = true
            }

            // update enemy x and y to the newly obtained x and y
            this.setPosition(this.follower.vec.x, this.follower.vec.y)
            // if we have reached the end of the path, remove the enemy
            if (this.follower.t >= 1) {
                this.setActive(false)
                this.setVisible(false)
                this.scene.hp--
                this.scene.updateHealth()
            }
        }
    }

    setHp() {
        this.hp = ENEMY_HP
    }

    startOnPath() {
        // set the t parameter at the start of the path
        this.follower.t = 0
        // get x and y of the given t point
        enemyPath.getPoint(this.follower.t, this.follower.vec)
        // set the x and y of our enemy to the received from the previous step
        this.setPosition(this.follower.vec.x, this.follower.vec.y)
        this.setHp()
    }

    receiveDamage(damage) {
        this.hp -= damage
        // if hp drops below 0 we deactivate this enemy
        if (this.hp <= 0) {
            this.setActive(false)
            this.setVisible(false)
            this.scene.money += this.loot
            this.scene.updateCoins()
        }
    }
}
