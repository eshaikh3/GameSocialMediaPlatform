import Phaser from 'phaser'
import {
    INITIAL_HP,
    BULLET_DAMAGE,
    MAP,
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    MAP_WIDTH,
    MAP_HEIGHT,
} from '../config'
import NormalEnemy from '../objects/enemy'
import Tank from '../objects/tank'
import Runner from '../objects/runner'
import Turret from '../objects/turret'
import Bullet from '../objects/bullet'
import PauseButton from '../objects/buttons/pause'
import RestartButton from '../objects/buttons/restart'
import { SpeedUpButton, SpeedDownButton } from '../objects/buttons/speed'
import Spawner from '../spawner'
import { userName } from '../getUserName'

class gameScene extends Phaser.Scene {
    constructor() {
        super('gameScene')
    }

    init(data) {
        this.leaderBoard = data.leaderBoard

        // grab the user data
        for (let i = 0; i < this.leaderBoard.length; i++)
            if (this.leaderBoard[i].userName == userName)
                this.user = this.leaderBoard[i]

        // console.log(this.user)
        // console.log('gameScene - userName: ' + this.user.userName)
        // console.log('gameScene - score: ' + this.user.score)
    }

    preload() {
        this.load.atlas(
            'zombie',
            '/assets/spritesheets/zombie-no-pivot.png',
            '/assets/spritesheets/zombie-no-pivot.json'
        )
        this.load.atlas(
            'runner',
            '/assets/spritesheets/runner.png',
            '/assets/spritesheets/runner.json'
        )
        this.load.atlas(
            'tank',
            '/assets/spritesheets/tank.png',
            '/assets/spritesheets/tank.json'
        )
        this.load.spritesheet('weapon', '/assets/spritesheets/weapon.png', {
            frameWidth: 64,
            frameHeight: 64,
        })
        this.load.image('turret', '/assets/images/turret.png')
        this.load.image('bullet', '/assets/images/bullet.png')
        this.load.image('pause', '/assets/images/pause.png')
        this.load.image('right-arrow', '/assets/images/right-arrow.png')
        this.load.image('restart', '/assets/images/restart.png')
        this.load.image('speed-up', '/assets/images/speedup.png')
        this.load.image('speed-down', '/assets/images/speeddown.png')
        this.load.image(
            'background',
            '/assets/images/towerDefenseBackground.png'
        )
    }

    async create() {
        // ------------------- Declarations -------------------

        this.onPause = true
        this.money = 100
        this.hp = INITIAL_HP
        this.speed = 1
        this.attackSpeed = 1
        this.resetMap()
        this.spawner = new Spawner(this)

        // ------------------- Animations -------------------

        this.anims.create({
            key: 'walk',
            frames: 'zombie',
            frameRate: 12,
            repeat: -1,
        })

        this.anims.create({
            key: 'tankWalk',
            frames: 'tank',
            frameRate: 12,
            repeat: -1,
        })

        this.anims.create({
            key: 'runnerWalk',
            frames: 'runner',
            frameRate: 12,
            repeat: -1,
        })

        this.anims.create({
            key: 'shootBullet',
            frames: this.anims.generateFrameNumbers('weapon'),
            frameRate: 20,
            repeat: 1,
        })

        // ------------------ Background -------------------

        this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'background')

        // ------------------- Objects -------------------

        this.enemies = this.physics.add.group({
            classType: NormalEnemy,
            runChildUpdate: true,
        })

        this.tanks = this.physics.add.group({
            classType: Tank,
            runChildUpdate: true,
        })

        this.runners = this.physics.add.group({
            classType: Runner,
            runChildUpdate: true,
        })

        this.turrets = this.add.group({
            classType: Turret,
            runChildUpdate: true,
        })

        this.bullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true,
        })

        this.spawner = new Spawner(this)

        this.button = new PauseButton(this, SCREEN_WIDTH / 2 - 96, 544)
        this.button = new RestartButton(this, SCREEN_WIDTH / 2 - 32, 544)
        this.button = new SpeedDownButton(this, SCREEN_WIDTH / 2 + 32, 544)
        this.button = new SpeedUpButton(this, SCREEN_WIDTH / 2 + 96, 544)

        // coin text
        this.coins = this.add.text(160, 32, this.money).setOrigin(0.5)
        this.coins.setFontFamily('Arial')
        this.coins.setFontSize(24)

        // health text
        this.health = this.add
            .text(SCREEN_WIDTH - 96, 32, this.hp)
            .setOrigin(0.5)
        this.health.setFontFamily('Arial')
        this.health.setFontSize(24)

        // current wave
        this.waveText = this.add.text(480, 32, 'WAVE').setOrigin(0.5)
        this.waveText.setFontFamily('Arial')
        this.waveText.setFontSize(24)

        this.waveNumText = this.add
            .text(544, 32, this.spawner.waveNumber)
            .setOrigin(0.5)
        this.waveNumText.setFontFamily('Arial')
        this.waveNumText.setFontSize(24)

        // ------------------- Place Turret -------------------

        this.input.on('pointerdown', (pointer) => {
            this.placeTurret(pointer)
        })

        // ------------------- Collision Handler -------------------

        this.physics.add.overlap(this.enemies, this.bullets, damageEnemy)
        this.physics.add.overlap(this.tanks, this.bullets, damageEnemy)
        this.physics.add.overlap(this.runners, this.bullets, damageEnemy)

        function damageEnemy(enemy, bullet) {
            // only if both enemy and bullet are alive
            if (enemy.active === true && bullet.active === true) {
                // we remove the bullet right away
                bullet.setActive(false)
                bullet.setVisible(false)

                // decrease the enemy hp with BULLET_DAMAGE
                enemy.receiveDamage(BULLET_DAMAGE)
            }
        }

        // ------------------- Key Registration -------------------

        this.escKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        )
    }

    update(time, delta) {
        // ------------------- Spawn Enemies -------------------

        this.spawner.update(time, delta)

        // ------------------- Check Victory -------------------

        if (this.spawner.finishSpawn) {
            if (
                this.runners.countActive() === 0 &&
                this.tanks.countActive() === 0 &&
                this.enemies.countActive() === 0
            ) {
                console.log('gameScene - this.money: ' + this.money)
                if (this.money * this.hp > this.user.score) {
                    // update leader board
                    fetch(
                        'https://pacific-savannah-96444.herokuapp.com/updateLeaderboard',
                        {
                            method: 'put',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                gameName: 'towerDefense',
                                userName: userName,
                                score: this.money * this.hp,
                            }),
                        }
                    )
                        .then((response) => response.json())
                        .then((response) => {
                            if (response.message === 'success') {
                                this.scene.start('victoryScene', {
                                    leaderBoard: response.gameData.leaderboard,
                                    userName: userName,
                                })
                            }
                        })
                } else {
                    this.scene.start('victoryScene', {
                        leaderBoard: this.leaderBoard,
                        userName: userName,
                    })
                }
            }
        }

        // ------------------- Key Press Listener -------------------

        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.scene.pause()
            this.scene.launch('pauseScene')
        }
    }

    updateCoins() {
        this.coins.setText(this.money)
    }

    updateHealth() {
        if (this.hp <= 0) {
            this.scene.start('gameOverScene', {
                leaderBoard: this.leaderBoard,
                userName: userName,
            })
        }
        this.health.setText(this.hp)
    }

    placeTurret(pointer) {
        var i = Math.floor(pointer.y / 64)
        var j = Math.floor(pointer.x / 64)

        if (this.canPlaceTurret(i, j) && this.money >= 40) {
            var turret = this.turrets.get()
            if (turret) {
                turret.setActive(true)
                turret.setVisible(true)
                turret.place(i, j)
            }
            this.money -= 40
            this.updateCoins()
        }
    }

    restartGame() {
        this.resetMap()
        this.spawner.reset()
        this.scene.restart()
    }

    resetMap() {
        for (var i = 0; i < MAP_HEIGHT; i++)
            for (var j = 0; j < MAP_WIDTH; j++)
                if (MAP[i][j] === 3) MAP[i][j] = 2
    }

    canPlaceTurret(i, j) {
        return MAP[i][j] === 2
    }
}

export default gameScene
