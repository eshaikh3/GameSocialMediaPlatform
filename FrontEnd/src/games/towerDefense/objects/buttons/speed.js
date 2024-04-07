import Button from './button'

class SpeedUpButton extends Button {
    constructor(scene, x, y) {
        super(scene, x, y, 'speed-up')
    }

    onClick() {
        if (this.scene.speed < 4) this.scene.speed *= 2
        if (this.scene.attackSpeed < 4) this.scene.attackSpeed *= 2
    }
}

class SpeedDownButton extends Button {
    constructor(scene, x, y) {
        super(scene, x, y, 'speed-down')
    }

    onClick() {
        if (this.scene.speed > 1) this.scene.speed /= 2
        if (this.scene.attackSpeed > 1) this.scene.attackSpeed /= 2
    }
}

export { SpeedUpButton, SpeedDownButton }
