import Phaser from 'phaser'

var SCREEN_WIDTH = 1024
var SCREEN_HEIGHT = 576

var INITIAL_HP = 3

// enemy's movement speed
var ENEMY_SPEED = 1 / 10000 / 3
var ENEMY_HP = 100
var ENEMY_LOOT = 5

var WAVE_INTERVAL = 20000
var SPAWN_INTERVAL = 100 * 2

var ATTACK_RANGE = 100
var ATTACK_SPEED = 1000 / 1.8

// bullet's damage
var BULLET_DAMAGE = 50

// demo map
var MAP_WIDTH = 16
var MAP_HEIGHT = 9
var MAP = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0, 0],
    [0, 0, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 0, 0],
    [0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

let enemyPath = new Phaser.Curves.Path(160, 160)
enemyPath.lineTo(480, 160)
enemyPath.lineTo(480, 288)
enemyPath.lineTo(160, 288)
enemyPath.lineTo(160, 416)
enemyPath.lineTo(608, 416)
enemyPath.lineTo(608, 160)
enemyPath.lineTo(736, 160)
enemyPath.lineTo(736, 416)
enemyPath.lineTo(864, 416)
enemyPath.lineTo(864, 160)

export {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    MAP_WIDTH,
    MAP_HEIGHT,
    INITIAL_HP,
    ENEMY_SPEED,
    ENEMY_HP,
    ENEMY_LOOT,
    WAVE_INTERVAL,
    SPAWN_INTERVAL,
    BULLET_DAMAGE,
    MAP,
    ATTACK_RANGE,
    ATTACK_SPEED,
    enemyPath,
}
