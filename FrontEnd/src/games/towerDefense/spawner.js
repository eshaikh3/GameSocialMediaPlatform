import { WAVE_INTERVAL } from './config'
import { groups } from './spawnList'

export default class Spawner {
    // constructor
    //
    constructor(scene) {
        this.scene = scene
        this.groups = groups
        this.enemySpawnTimer = 0
        this.nextSpawn = 0
        this.timer = 0
        this.groupNumber = 0
        this.waveNumber = 1
        this.counter = groups[this.groupNumber].count
        this.type = groups[this.groupNumber].type
        this.finishSpawn = false
    }

    update(time, delta) {
        this.timer = time
        if (
            time > this.enemySpawnTimer &&
            !this.scene.onPause &&
            !this.finishSpawn
        ) {
            this.spawn(time)
        }
    }

    // record pause time
    onPause() {
        if (!this.finishSpawn)
            this.nextSpawn = this.enemySpawnTimer - this.timer
    }

    resume() {
        this.enemySpawnTimer = this.timer + this.nextSpawn
    }

    // spawn an enemy
    spawn(time) {
        // check if all enemies from current wave have been spawned
        if (this.counter > 0) {
            var enemy = this.scene[this.type].get()
            if (enemy) {
                enemy.setActive(true)
                enemy.setVisible(true)
                // place the enemy at the start of the path
                enemy.startOnPath()
                this.counter--
                this.scene.waveNumText.setText(this.waveNumber)

                // if current group have more to spawn
                if (this.counter > 0)
                    this.enemySpawnTimer =
                        time +
                        this.groups[this.groupNumber].interval /
                            this.scene.speed
                else {
                    this.groupNumber++

                    // reached the last group
                    if (this.groupNumber == this.groups.length)
                        this.finishSpawn = true
                    // move to next group
                    else {
                        if (
                            this.groups[this.groupNumber].wave > this.waveNumber
                        ) {
                            this.enemySpawnTimer =
                                time + WAVE_INTERVAL / this.scene.speed
                            this.waveNumber++
                        }
                        this.counter = groups[this.groupNumber].count
                        this.type = groups[this.groupNumber].type
                    }
                }
            }
        }
    }

    reset() {
        this.nextSpawn = 0
        this.timer = 0
        this.enemySpawnTimer = 0
        this.groupNumber = 0
        this.waveNumber = 1
        this.counter = groups[this.groupNumber].count
        this.type = groups[this.groupNumber].type
        this.finishSpawn = false
    }
}
