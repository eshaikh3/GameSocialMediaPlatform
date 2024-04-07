import Phaser from 'phaser'

class pauseScene extends Phaser.Scene {
    constructor() {
        super('pauseScene')
    }

    create() {
        // register Enter key
        this.escKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        )
        this.pauseText = this.add.text(20, 20, 'Game Paused ...')
    }

    update() {
        // key press listener
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.scene.resume('playGame')
            this.pauseText.destroy()
        }
    }
}

export default pauseScene
