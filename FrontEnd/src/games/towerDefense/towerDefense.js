import React, { Component, useState, useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'
import gameScene from './scenes/gameScene'
import startScene from './scenes/startScene'
import pauseScene from './scenes/pauseScene'
import VictoryScene from './scenes/victoryScene'
import gameOverScene from './scenes/gameOverScene'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './config'
import { emitter } from './getUserName'

import './towerDefense.css'

import RightContent from '../../Components/RightBar/RightBar'
import FloatingChat from '../../Components/FloatingChat/FloatingChat'

class TowerDefense extends Component {
    state = {
        initialize: true,
        game: {
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            type: Phaser.AUTO,
            createDOMContainer: true,
            physics: {
                default: 'arcade',
            },
            scene: [
                startScene,
                gameScene,
                pauseScene,
                gameOverScene,
                VictoryScene,
            ],
        },
        data: this.props.data,
    }

    componentDidMount() {
        emitter.emit('getUserName', this.props.data.userName)
    }

    render() {
        const { initialize, game } = this.state

        return (
            <div className="body">
                <div className="game">
                    {/* <!-- ----------- Left Content----------- --> */}
                    <IonPhaser
                        class="td-content"
                        game={game}
                        initialize={initialize}
                    />

                    {/* <!-- ----------- Right Content----------- --> */}
                    <RightContent data={this.props.data} />
                    <FloatingChat data={this.props.data} />
                </div>
            </div>
        )
    }
}

export default TowerDefense
