import Phaser from 'phaser'
import Button from './button'

export default class PauseButton extends Button {
    constructor(scene, x, y) {
        super(scene, x, y, 'right-arrow')
    }

    onClick() {
        if (!this.scene.onPause) {
            this.init('right-arrow')
            this.pauseScene()
        } else {
            this.init('pause')
            this.unPauseScene()
        }
    }

    pauseScene() {
        this.scene.onPause = true
        this.scene.spawner.onPause()
        this.scene.enemies.children.iterate(function (child) {
            child.onPause = true
        }, this)
    }

    unPauseScene() {
        this.scene.onPause = false
        this.scene.spawner.resume()
        this.scene.enemies.children.iterate(function (child) {
            child.onPause = false
        }, this)
    }
}
