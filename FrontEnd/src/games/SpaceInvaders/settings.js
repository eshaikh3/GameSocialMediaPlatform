import Scene1 from './Scene1'
import Scene2 from './Scene2'
import titleScene from './titleScene'
import endGameScene from './endGameScene'

var gameSettings = {
    playerSpeed: 200,
    initHP: 3,
}

var config = {
    width: 512,
    height: 544,
    backgroundColor: 0x000000,
    scene: [Scene1, Scene2, titleScene, endGameScene],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
}

export { gameSettings, config }
