import Phaser from 'phaser'

export default class Button extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
        this.setInteractive({ useHandCursor: true })
        this.init(texture)
        this.scene.add.existing(this)
        this.eventHandler()
    }

    init(texture) {
        this.setTexture(texture)
        this.setScale(0.3)
        this.setAlpha(0.9)
    }

    eventHandler() {
        this.on('pointerover', () => this.onHover())
        this.on('pointerout', () => this.onRest())
        this.on('pointerdown', () => this.onClick())
    }

    onHover() {
        this.setAlpha(1)
    }

    onRest() {
        this.setAlpha(0.9)
    }

    onClick() {}
}
