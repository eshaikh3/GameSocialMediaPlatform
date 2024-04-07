import React, { Component } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'
import Scene1 from './Scene1'
import Scene2 from './Scene2'
import titleScene from './titleScene'
import pauseScene from './pauseScene'
import endGameScene from './endGameScene'
import { emitter } from './getUserName'

import './spaceInvaders.css'

import RightContent from '../../Components/RightBar/RightBar'
import LiveChat from '../../Components/FloatingChat/FloatingChat'

class SpaceInvaders extends Component {
    state = {
        initialize: true,
        game: {
            width: 512,
            height: 544,
            type: Phaser.AUTO,
            physics: {
                default: 'arcade',
            },
            scene: [Scene1, Scene2, titleScene, pauseScene, endGameScene],
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
                        class="si-content"
                        game={game}
                        initialize={initialize}
                    />

                    {/* <!-- ----------- Right Content----------- --> */}
                    <RightContent data={this.props.data} />
                    <LiveChat data={this.props.data} />
                </div>
            </div>
        )
    }
}

export default SpaceInvaders
