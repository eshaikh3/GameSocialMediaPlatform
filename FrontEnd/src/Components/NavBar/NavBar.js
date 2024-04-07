import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './NavBar.css'
import Logo from '../../images/logo.jpg'
import Icon from '../../images/icon.png'
import { BsSearch } from 'react-icons/bs'
import { BiLogOut } from 'react-icons/bi'
import { useAuth } from '../../RouteAuth/auth'

function NavBar({ data, onLogout }) {
    // State/Hooks
    let navigate = useNavigate()

    let [searchTerm, setSearchTerm] = useState('')

    const auth = useAuth()

    function logOut() {
        onLogout()
        auth.logout()
    }

    function iconClicked() {
        navigate(`/${data.userName}/profile`)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (searchTerm.length > 0) {
                navigate(`/${data.userName}/profile/search?term=${searchTerm}`)
            }
        }
    }

    return (
        <div className="nav-bar">
            <div className="nav">
                <div className="logo">
                    <img src={Logo} className="logo" alt="logo" />
                </div>

                <div className="nav-links">
                    <img
                        src={
                            (data.imageUrl != '') & (data.imageUrl != null)
                                ? data.imageUrl
                                : Icon
                        }
                        alt="icon"
                        onClick={iconClicked}
                    />
                    <ul id="navList">
                        {/* <li>
                            <Link
                                className="navList-link"
                                to={`/${data.userName}/profile/friendrequest`}
                            >
                                Friend Request
                            </Link>
                        </li> */}
                        <li>
                            <Link
                                className="navList-link"
                                to={`/${data.userName}/profile/friendlist`}
                            >
                                Friend List
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="navList-link"
                                to={`/${data.userName}/profile/gameLibrary`}
                            >
                                Game Library
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="navList-link"
                                to={`/${data.userName}/profile/live-chat`}
                            >
                                Chats
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="navList-link"
                                to={`/${data.userName}/profile/setting`}
                            >
                                Setting
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="nav-right">
                    <ul>
                        <li>
                            <button className="logout-btn" onClick={logOut}>
                                <BiLogOut className="sm-icon" />
                                Log out
                            </button>
                        </li>
                        <li className="search-box">
                            <BsSearch />
                            <input
                                type="text"
                                placeholder="Search GSMP"
                                maxLength={64}
                                required
                                onChange={(e) =>
                                    setSearchTerm((prev) => e.target.value)
                                }
                                onKeyDown={handleKeyDown}
                            />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NavBar
