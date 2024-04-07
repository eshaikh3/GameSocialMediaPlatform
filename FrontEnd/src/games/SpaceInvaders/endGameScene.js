import Phaser from 'phaser'
import { gameSettings, config } from './settings'

class endGameScene extends Phaser.Scene {
    constructor() {
        super('endGameScene')

        // center coords
        this.screenCenterX = config.width / 2
        this.screenCenterY = config.height / 2
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

        // // center coords
        // let screenCenterX = config.width / 2
        // let screenCenterY = config.height / 2

        // title text
        this.gameOverText = this.add
            .text(this.screenCenterX, 60, 'Game Over')
            .setOrigin(0.5)
        this.gameOverText.setFontFamily('Arial')
        this.gameOverText.setFontSize(36)

        this.displayLeaderBoard()

        // hint text
        this.hintText = this.add
            .text(
                this.screenCenterX,
                this.screenCenterY + 200,
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

    displayLeaderBoard() {
        this.displayTitle()
        for (let i = 0; i < 3; i++) {
            this.displayRank(i)
        }
    }

    displayTitle() {
        this.rankTitle = this.add
            .text(60, 150, 'Rank')
            .setOrigin(0.5)
            .setFontSize(24)
        this.nameTitle = this.add
            .text(this.screenCenterX, 150, 'Name')
            .setOrigin(0.5)
            .setFontSize(24)
        this.scoreTitle = this.add
            .text(this.screenCenterX + 200, 150, 'Score')
            .setOrigin(0.5)
            .setFontSize(24)
    }

    displayRank(i) {
        this.add
            .text(this.screenCenterX - 200, 225 + 50 * (i + 1), i + 1)
            .setOrigin(0.5)
            .setFontSize(24)
        this.add
            .text(
                this.screenCenterX,
                225 + 50 * (i + 1),
                this.leaderBoard[i].userName
            )
            .setOrigin(0.5)
            .setFontSize(24)
        this.add
            .text(
                this.screenCenterX + 200,
                225 + 50 * (i + 1),
                this.leaderBoard[i].score
            )
            .setOrigin(0.5)
            .setFontSize(24)
    }

    update() {
        // key press listener
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            fetch(
                'https://pacific-savannah-96444.herokuapp.com/leaderboard/spaceInvaders',
                {
                    method: 'get',
                    headers: { 'Content-Type': 'application/json' },
                }
            )
                .then((response) => response.json())
                .then((response) => {
                    if (response.message === 'success') {
                        console.log(response.gameData.leaderboard)
                        this.scene.start('playGame', {
                            leaderBoard: response.gameData.leaderboard,
                            userName: this.userName,
                        })
                    }
                })
        }
    }
}

export default endGameScene
