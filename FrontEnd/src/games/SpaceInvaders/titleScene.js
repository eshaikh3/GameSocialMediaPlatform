import Phaser from 'phaser'
import { userName } from './getUserName'
import { gameSettings, config } from './settings'

class titleScene extends Phaser.Scene {
    constructor() {
        super('mainMenu')
    }

    create() {
        // register Enter key
        this.enterKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        )

        // center coords
        let screenCenterX = config.width / 2
        let screenCenterY = config.height / 2

        // title text
        this.SItitle = this.add
            .text(screenCenterX, screenCenterY, 'Space Invaders Game')
            .setOrigin(0.5)
        this.SItitle.setFontFamily('Arial')
        this.SItitle.setFontSize(36)

        // hint text
        this.hintText = this.add
            .text(screenCenterX, screenCenterY + 75, 'Press Enter to Start')
            .setOrigin(0.5)

        //pause tip
        this.pauseTip = this.add
            .text(
                screenCenterX,
                screenCenterY + 200,
                'to pause game while playing, press ESC key'
            )
            .setOrigin(0.5)
        this.pauseTip.setFontSize(15)

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
            // get leaderboard info
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
                        console.log(
                            'startScene - userName: ' +
                                userName +
                                '\nstartScene - leaderBoard: '
                        )
                        console.log(response.gameData.leaderboard)
                        this.scene.start('playGame', {
                            leaderBoard: response.gameData.leaderboard,
                            userName: userName,
                        })
                    }
                })
        }
    }
}

export default titleScene
