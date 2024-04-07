import Phaser from 'phaser'
import { userName } from '../getUserName'

class startScene extends Phaser.Scene {
    constructor() {
        super('startScene')
    }

    create() {
        // register Enter key
        this.enterKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        )

        // center coords
        let screenCenterX =
            this.cameras.main.worldView.x + this.cameras.main.width / 2
        let screenCenterY =
            this.cameras.main.worldView.x + this.cameras.main.height / 2

        // title text
        this.towerDefenseText = this.add
            .text(screenCenterX, screenCenterY, 'Tower Defense Game')
            .setOrigin(0.5)
        this.towerDefenseText.setFontFamily('Arial')
        this.towerDefenseText.setFontSize(36)

        // hint text
        this.hintText = this.add
            .text(screenCenterX, screenCenterY + 75, 'Press Enter to Start')
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
            // get leaderboard info
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
                        console.log(
                            'startScene - userName: ' +
                                userName +
                                '\nstartScene - leaderBoard: '
                        )
                        console.log(response.gameData.leaderboard)
                        this.scene.start('gameScene', {
                            leaderBoard: response.gameData.leaderboard,
                            userName: userName,
                        })
                    }
                })
        }
    }
}

export default startScene
