import Button from './button'

export default class RestartButton extends Button {
    constructor(scene, x, y) {
        super(scene, x, y, 'restart')
    }

    onClick() {
        this.scene.restartGame()
    }
}
