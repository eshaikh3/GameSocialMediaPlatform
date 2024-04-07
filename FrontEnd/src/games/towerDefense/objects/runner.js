import Phaser from 'phaser'
import Enemy from './enemy'
import { ENEMY_SPEED, ENEMY_HP, ENEMY_LOOT } from '../config'

export default class Runner extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprites', 'runner')
        this.play('runnerWalk')
        this.setScale(0.15)
        this.towardsRight = true
        this.changeDirection = false
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() }
        this.loot = ENEMY_LOOT
        this.speed = ENEMY_SPEED * 1.8
    }

    setHp() {
        this.hp = ENEMY_HP
    }
}
