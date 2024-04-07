import React from 'react'
import NavBar from '../../Components/NavBar/NavBar'
import { Link } from 'react-router-dom'

import './GameLibrary.css'

import TowerDefenseGame from '../../images/towerDefense.jpg'
import SpaceInvaders from '../../images/spaceInvaders.png'
import RightBar from '../../Components/RightBar/RightBar'
import FloatingChat from '../../Components/FloatingChat/FloatingChat'

function GameLibrary({ data }) {
    return (
        <div className="body">
            {/* <NavBar data={data}/> */}
            <div className="gameLibrary">
                {/* <!-- ----------- Left Content----------- --> */}
                <div className="game-content">
                    <div>
                    <h4 className="gameTitle">Tower Defense Game</h4>
                    <Link
                        className="navList-link"
                        to={`/${data.userName}/profile/gameLibrary/towerDefense`}
                    >
                        <img src={TowerDefenseGame} alt="Tower Defense Game" />
                    </Link>
                    </div>
                    <div>
                    <h4 className="gameTitle">Space Invaders Game</h4>
                    <Link
                        className="navList-link"
                        to={`/${data.userName}/profile/gameLibrary/spaceInvaders`}
                    >
                        <img src={SpaceInvaders} alt="Space Invaders Game" />
                    </Link>
                    </div>
                </div>

                {/* <!-- ----------- Right Bar----------- --> */}
                <RightBar data={data} />
                <FloatingChat data={data} />
            </div>
        </div>
    )
}

export default GameLibrary
