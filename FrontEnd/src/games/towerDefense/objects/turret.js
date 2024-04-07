import Phaser from 'phaser'
import { MAP, ATTACK_RANGE, ATTACK_SPEED } from '../config'

export default class Turret extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'weapon')
        this.nextTic = 0
        this.setDepth(1)
    }

    place(i, j) {
        this.y = i * 64 + 64 / 2
        this.x = j * 64 + 64 / 2
        MAP[i][j] = 3
        // add a the tower base
        this.scene.add.image(this.x, this.y, 'turret').setDepth(0)
    }

    getEnemy() {
        let enemyUnits = this.scene.enemies.getChildren()
        for (var i = 0; i < enemyUnits.length; i++) {
            if (
                enemyUnits[i].active &&
                Phaser.Math.Distance.Between(
                    this.x,
                    this.y,
                    enemyUnits[i].x,
                    enemyUnits[i].y
                ) <= ATTACK_RANGE
            )
                return enemyUnits[i]
        }
        return false
    }

    getTank() {
        let enemyUnits = this.scene.tanks.getChildren()
        for (var i = 0; i < enemyUnits.length; i++) {
            if (
                enemyUnits[i].active &&
                Phaser.Math.Distance.Between(
                    this.x,
                    this.y,
                    enemyUnits[i].x,
                    enemyUnits[i].y
                ) <= ATTACK_RANGE
            )
                return enemyUnits[i]
        }
        return false
    }

    getRunner() {
        let enemyUnits = this.scene.runners.getChildren()
        for (var i = 0; i < enemyUnits.length; i++) {
            if (
                enemyUnits[i].active &&
                Phaser.Math.Distance.Between(
                    this.x,
                    this.y,
                    enemyUnits[i].x,
                    enemyUnits[i].y
                ) <= ATTACK_RANGE
            )
                return enemyUnits[i]
        }
        return false
    }

    addBullet(angle) {
        var bullet = this.scene.bullets.get()
        if (bullet) {
            bullet.fire(this.x, this.y, angle)
        }
    }

    fire() {
        var enemy = this.getEnemy()
        if (!enemy) enemy = this.getTank()
        if (!enemy) enemy = this.getRunner()

        if (enemy) {
            this.play('shootBullet')
            var angle = Phaser.Math.Angle.Between(
                this.x,
                this.y,
                enemy.x,
                enemy.y
            )
            this.addBullet(angle)
            this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG
        }
    }

    update(time, delta) {
        if (time > this.nextTic && !this.scene.onPause) {
            this.fire()
            this.nextTic = time + ATTACK_SPEED / this.scene.attackSpeed
        }
    }
}
