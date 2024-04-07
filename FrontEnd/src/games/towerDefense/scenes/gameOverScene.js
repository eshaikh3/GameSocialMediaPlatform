import Phaser from 'phaser'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../config'

class GameOverScene extends Phaser.Scene {
    constructor() {
        super('gameOverScene')
    }

    init(data) {
        this.leaderBoard = data.leaderBoard

        // sort the players
        this.leaderBoard.sort((a, b) => b.score - a.score)
        this.userName = data.userName
    }

    create() {
        // register Enter key
        this.enterKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        )

        // title
        this.towerDefenseText = this.add
            .text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'Game Over')
            .setOrigin(0.5)
        this.towerDefenseText.setFontFamily('Arial')
        this.towerDefenseText.setFontSize(36)

        // hint text
        this.hintText = this.add
            .text(
                SCREEN_WIDTH / 2,
                SCREEN_HEIGHT / 2 + 75,
                'Press Enter to Restart'
            )
            .setOrigin(0.5)

        this.tweens.add({
            targets: this.hintText,
            alpha: 0,
            ease: 'Power0',
            duration: 800,
            repeat: -1,
            yoyo: true,
        })
    }

    update() {
        // key press listener
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            fetch(
                'https://pacific-savannah-96444.herokuapp.com/leaderboard/towerDefense',
                {
                    method: 'get',
                    headers: { 'Content-Type': 'application/json' },
                }
            )
                .then((response) => response.json())
                .then((response) => {
                    if (response.message === 'success') {
                        console.log(response.gameData.leaderboard)
                        this.scene.start('gameScene', {
                            leaderBoard: response.gameData.leaderboard,
                            userName: this.userName,
                        })
                    }
                })
        }
    }
}

export default GameOverScene
