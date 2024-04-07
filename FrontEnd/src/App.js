import React, { useState, useEffect } from 'react'
import { Row, Col, Container } from 'react-bootstrap'

import { Route, Routes } from 'react-router-dom'

import './App.css'

import Register from './Pages/Register/Register'
import Login from './Pages/Login/Login'
import Footer from './Components/Footer/Footer'
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword'
import Profile from './Pages/Profile/Profile'
import Setting from './Pages/SettingPage/Setting'
import GameLibrary from './Pages/GameLibrary/GameLibrary'
import TowerDefense from './games/towerDefense/towerDefense'
import SpaceInvaders from './games/SpaceInvaders/spaceInvaders'
import FriendRequest from './Pages/FriendRequest/FriendRequest'
import FriendList from './Pages/FriendList/FriendList'
import FriendProfile from './Pages/FriendProfile/FriendProfile'

import NavBar from './Components/NavBar/NavBar'
import Search from './Pages/SearchResult/Search'
import LiveChat from './Pages/Chat/Chat'
import ErrorPage from './Pages/ErrorPage/ErrorPage'

// Auth
import { AuthProvider } from './RouteAuth/auth'
import { RequireAuth } from './RouteAuth/requireAuth'

// Socket Configuration
import io from 'socket.io-client'
const socket = io.connect("https://gsmp-backend-socket.herokuapp.com")

function App() {
    let [userInfo, setUserInfo] = useState({
        _id: '',
        userName: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        birthday: null,
        privacy: false,
        description: '',
        gender: '',
        location: '',
        imageUrl: '',
        imagePublicId: '',
        friends: null,
        friendsRequest: null,
    })

    const sendUserInfo = (data) => {
        setUserInfo((prev) => data)
    }

    const logout = () => {
        socket.emit("remove_user", { userName: userInfo._id });
        
        setUserInfo((prev) => {
            prev = {
                _id: '',
                userName: '',
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                birthday: null,
                privacy: false,
                description: '',
                gender: '',
                location: '',
                imageUrl: '',
                imagePublicId: '',
                friends: null,
                friendsRequest: null,
            }
        })
    }

    return (
        <AuthProvider>
        <main className="App">
            <Routes>
                <Route path="/" element={<Login dataSend={sendUserInfo} socket={socket} />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/login"
                    element={<Login dataSend={sendUserInfo} socket={socket} />}
                />
                <Route path="/forgotpassword" element={<ForgotPassword />} />

                {/* After login */}
                <Route
                    path="/:username/profile" element={
                        <RequireAuth>
                            <NavBar data={userInfo} onLogout={logout} />
                            <Profile data={userInfo} />{' '}
                        </RequireAuth>
                    }
                />


                <Route
                    path="/:username/profile/friend"
                    element={
                        <RequireAuth>
                            <NavBar data={userInfo} onLogout={logout} />
                            <FriendProfile
                                data={userInfo}
                                dataSend={sendUserInfo}
                            />
                        </RequireAuth>
                    }
                />

                <Route
                    path="/:username/profile/live-chat"
                    element={
                        <RequireAuth>
                            <NavBar data={userInfo} onLogout={logout} />
                            <LiveChat data={userInfo} dataSend={sendUserInfo} socket={socket} />
                        </RequireAuth>
                    }
                />

                <Route
                    path="/:username/profile/setting"
                    element={
                        <RequireAuth>
                            <NavBar data={userInfo} onLogout={logout} />
                            <Setting data={userInfo} dataSend={sendUserInfo} />
                        </RequireAuth>
                    }
                />

                <Route
                    path="/:username/profile/friendrequest"
                    element={
                        <RequireAuth>
                            <NavBar data={userInfo} onLogout={logout} />
                            <FriendRequest data={userInfo} />
                        </RequireAuth>
                    }
                />

                <Route
                    path="/:username/profile/friendlist"
                    element={
                        <RequireAuth>
                            <NavBar data={userInfo} onLogout={logout} />
                            <FriendList data={userInfo} dataSend={sendUserInfo} />
                        </RequireAuth>
                    }
                />

                <Route
                    path="/:username/profile/gameLibrary"
                    element={
                        <RequireAuth>
                            <NavBar data={userInfo} onLogout={logout} />
                            <GameLibrary data={userInfo} />
                        </RequireAuth>
                    }
                />

                <Route
                    path="/:username/profile/gameLibrary/towerDefense"
                    element={
                        <RequireAuth>
                            <NavBar data={userInfo} onLogout={logout} />
                            <TowerDefense data={userInfo} />
                        </RequireAuth>
                    }
                />

                <Route
                    path="/:username/profile/gameLibrary/spaceInvaders"
                    element={
                        <RequireAuth>
                            <NavBar data={userInfo} onLogout={logout} />
                            <SpaceInvaders data={userInfo} />
                        </RequireAuth>
                    }
                />

                <Route
                    path="/:username/profile/search"
                    element={
                        <RequireAuth>
                            <NavBar data={userInfo} onLogout={logout} />
                            <Search data={userInfo} />
                        </RequireAuth>
                    }
                />

                <Route path='*' element={<ErrorPage />} />
            </Routes>

            <Footer />
        </main>
        </AuthProvider>
    )
}

export default App
