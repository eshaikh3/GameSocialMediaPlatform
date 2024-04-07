import Phaser from 'phaser'
import { gameSettings, config } from './settings'
import Beam from './beam'
import Explosion from './explosion'
import { userName } from './getUserName'

class Scene2 extends Phaser.Scene {
    constructor() {
        super('playGame')
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

    create() {
        // ------------------- Key Registration -------------------

        this.escKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        )

        //declaring hp
        this.hp = gameSettings.initHP

        // this.background = this.add.image(0, 0, "background");
        this.background = this.add.tileSprite(
            0,
            0,
            config.width,
            config.height,
            'background'
        )
        this.background.setOrigin(0, 0)

        this.ship1 = this.add.sprite(
            config.width / 2 - 50,
            config.height / 2,
            'ship'
        )

        this.ship2 = this.add.sprite(
            config.width / 2,
            config.height / 2,
            'ship2'
        )

        this.ship3 = this.add.sprite(
            config.width / 2 + 50,
            config.height / 2,
            'ship3'
        )

        this.enemies = this.physics.add.group()
        this.enemies.add(this.ship1)
        this.enemies.add(this.ship2)
        this.enemies.add(this.ship3)

        this.ship1.play('ship1_anim')
        this.ship2.play('ship2_anim')
        this.ship3.play('ship3_anim')

        this.ship1.setInteractive()
        this.ship2.setInteractive()
        this.ship3.setInteractive()

        this.input.on('gameobjectdown', this.destoryShip, this)

        this.powerUps = this.physics.add.group()

        var maxObjects = 4
        for (var i = 0; i <= maxObjects; i++) {
            var powerUp = this.physics.add.sprite(16, 16, 'power-up')
            this.powerUps.add(powerUp)
            powerUp.setRandomPosition(0, 0, config.width, config.height)

            if (Math.random() > 0.5) {
                powerUp.play('red')
            } else {
                powerUp.play('gray')
            }

            powerUp.setVelocity(100, 100)
            powerUp.setCollideWorldBounds(true)
            powerUp.setBounce(1)
        }

        this.player = this.physics.add.sprite(
            config.width / 2 - 8,
            config.height - 64,
            'player'
        )
        this.player.play('thrust')

        this.cursorKeys = this.input.keyboard.createCursorKeys()
        this.player.setCollideWorldBounds(true)

        this.spacebar = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        )

        this.projectiles = this.add.group()

        this.physics.add.collider(
            this.projectiles,
            this.powerUps,
            function (projectile, powerUp) {
                projectile.destroy()
            }
        )

        this.physics.add.collider(
            this.projectiles,
            this.powerUps,
            function (projectile, powerUp) {
                projectile.destroy()
            }
        )

        this.physics.add.overlap(
            this.player,
            this.powerUps,
            this.pickPowerUp,
            null,
            this
        )

        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.hurtPlayer,
            null,
            this
        )

        this.physics.add.overlap(
            this.projectiles,
            this.enemies,
            this.hitEnemy,
            null,
            this
        )

        var graphics = this.add.graphics()
        graphics.fillStyle(0x000000, 1)
        graphics.beginPath()
        graphics.moveTo(0, 0)
        graphics.lineTo(config.width, 0)
        graphics.lineTo(config.width, 20)
        graphics.lineTo(0, 20)
        graphics.lineTo(0, 0)
        graphics.closePath()
        graphics.fillPath()

        this.score = 0

        this.scoreLabel = this.add.bitmapText(10, 5, 'pixelFont', 'SCORE', 16)

        // lives text
        this.liveLabel = this.add.bitmapText(
            config.width - 50,
            5,
            'pixelFont',
            'LIVES: 3',
            16
        )

        this.beamSound = this.sound.add('audio_beam')
        this.explosionSound = this.sound.add('audio_explosion')
        this.pickupSound = this.sound.add('audio_pickup')

        this.music = this.sound.add('music')

        var musicConfig = {
            mute: false,
            volume: 0.5,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0,
        }
        this.music.play(musicConfig)
    }

    pickPowerUp(player, powerUp) {
        // make it inactive and hide it
        powerUp.disableBody(true, true)
        this.pickupSound.play()
        this.score += 100
        this.scoreLabel.text = 'SCORE ' + this.score
    }

    hurtPlayer(player, enemy) {
        this.resetShipPos(enemy)

        this.hp--
        this.liveLabel.text = 'LIVES: ' + this.hp

        if (this.player.alpha < 1) {
            return
        }
        var explosion = new Explosion(this, player.x, player.y)

        player.disableBody(true, true)

        if (this.hp <= 0) {
            if (
                typeof this.user == 'undefined' ||
                this.score > this.user.score
            ) {
                fetch(
                    'https://pacific-savannah-96444.herokuapp.com/updateLeaderboard',
                    {
                        method: 'put',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            gameName: 'spaceInvaders',
                            userName: userName,
                            score: this.score,
                        }),
                    }
                )
                    .then((response) => response.json())
                    .then((response) => {
                        if (response.message === 'success') {
                            this.music.stop()
                            this.scene.start('endGameScene', {
                                leaderBoard: response.gameData.leaderboard,
                                userName: userName,
                            })
                        }
                    })
            } else {
                this.music.stop()
                this.scene.start('endGameScene', {
                    leaderBoard: this.leaderBoard,
                    userName: userName,
                })
            }
        }

        this.time.addEvent({
            delay: 1000,
            callback: this.resetPlayer,
            callbackScope: this,
            loop: false,
        })
    }

    hitEnemy(projectile, enemy) {
        var explosion = new Explosion(this, enemy.x, enemy.y)

        projectile.destroy()
        this.resetShipPos(enemy)
        this.score += 15

        //var scoreFormated = this.zeroPad(this.score, 6);
        this.scoreLabel.text = 'SCORE ' + this.score // add score formated for more zeros at the start

        this.explosionSound.play()
    }

    shootBeam() {
        //var beam = this.physics.add.sprite(this.player.x, this.player.y, "beam");
        var beam = new Beam(this)
        this.beamSound.play()
    }

    update() {
        this.moveShip(this.ship1, 0.5)
        this.moveShip(this.ship2, 0.7)
        this.moveShip(this.ship3, 1)

        this.background.tilePositionY -= 0.2

        this.movePlayerManager()

        // ------------------- Key Press Listener -------------------

        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.scene.pause()
            this.scene.launch('pauseScene')
        }

        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            if (this.player.active) {
                this.shootBeam()
            }
        }

        for (var i = 0; i < this.projectiles.getChildren().length; i++) {
            var beam = this.projectiles.getChildren()[i]
            beam.update()
        }
    }

    movePlayerManager() {
        if (this.cursorKeys.left.isDown) {
            this.player.setVelocityX(-gameSettings.playerSpeed)
        } else if (this.cursorKeys.right.isDown) {
            this.player.setVelocityX(gameSettings.playerSpeed)
        } else {
            this.player.setVelocityX(0)
        }

        if (this.cursorKeys.up.isDown) {
            this.player.setVelocityY(-gameSettings.playerSpeed)
        } else if (this.cursorKeys.down.isDown) {
            this.player.setVelocityY(gameSettings.playerSpeed)
        } else {
            this.player.setVelocityY(0)
        }
    }

    moveShip(ship, speed) {
        ship.y += speed
        if (ship.y > config.height) {
            this.resetShipPos(ship)
        }
    }

    resetShipPos(ship) {
        ship.y = 0
        var randomX = Phaser.Math.Between(0, config.width)
        ship.x = randomX
    }

    destoryShip(pointer, gameObject) {
        gameObject.setTexture('explosion')
        gameObject.play('explode')
    }

    zeroPad(number, size) {
        var stringNumber = String(number)
        while (stringNumber.length < (size || 2)) {
            stringNumber = '0' + stringNumber
        }
        return stringNumber
    }

    resetPlayer() {
        var x = config.width / 2 - 8
        var y = config.height + 64
        this.player.enableBody(true, x, y, true, true)

        this.player.alpha = 0.5

        var tween = this.tweens.add({
            targets: this.player,
            y: config.height - 64,
            ease: 'Power1',
            duration: 1500,
            repeat: 0,
            onComplete: function () {
                this.player.alpha = 1
            },
            callbackScope: this,
        })
    }
}

export default Scene2
