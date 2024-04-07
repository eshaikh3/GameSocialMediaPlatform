import Phaser from 'phaser'
import Enemy from './enemy'
import { ENEMY_SPEED, ENEMY_HP, ENEMY_LOOT } from '../config'

export default class Tank extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprites', 'tank')
        this.play('tankWalk')
        this.setScale(0.3)
        this.towardsRight = true
        this.changeDirection = false
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() }
        this.loot = ENEMY_LOOT
        this.speed = ENEMY_SPEED
    }

    setHp() {
        this.hp = ENEMY_HP * 2
    }
}
