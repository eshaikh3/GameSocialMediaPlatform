import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import moment from 'moment'
import './FriendProfile.css'
import Icon from '../../images/icon.png'
import { IoLogoGameControllerB } from 'react-icons/io'
import { BsGenderAmbiguous } from 'react-icons/bs'
import { FaBirthdayCake } from 'react-icons/fa'
import { GrLocation } from 'react-icons/gr'
import FloatingChat from '../../Components/FloatingChat/FloatingChat'
import RightBar from '../../Components/RightBar/RightBar'
import { BsCheckLg, BsXLg } from 'react-icons/bs'
import { TiMessages } from 'react-icons/ti'

function FriendProfile({ data, dataSend }) {
    let navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const [fdInfo, setFdInfo] = useState({
        _id: '',
        userName: '',
        email: '',
        firstName: '',
        lastName: '',
        birthday: null,
        description: '',
        gender: '',
        location: '',
        imageUrl: '',
    })

    const getFdData = async () => {
        const response = await fetch(
            `https://pacific-savannah-96444.herokuapp.com/user/${searchParams.get(
                'user'
            )}`
        )
            .then((response) => response.json())
            .then((response) => {
                //console.log(response, "response");
                if (response.message === 'success') {
                    setFdInfo((prev) => response.user)
                } else {
                    console.log('Username is not found!')
                }
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        getFdData()
    }, [searchParams])

    function addFdBtn() {
        //console.log("Friending btn is clicked!")
        fetch('https://pacific-savannah-96444.herokuapp.com/updateFriend', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: data._id, friendId: fdInfo._id }),
        })
            .then((response) => response.json())
            .then((response) => {
                //console.log(response);
                if (response.message === 'success') {
                    //console.log(response.user);
                    dataSend(response.user)
                } else {
                    console.log('error at adding friend')
                }
            })
            .catch((err) => console.log(err))
    }

    function unFdBtn() {
        console.log('Unfriend btn is clicked!')
        fetch('https://pacific-savannah-96444.herokuapp.com/removeFriend', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: data._id, friendId: fdInfo._id }),
        })
            .then((response) => response.json())
            .then((response) => {
                //console.log(response);
                if (response.message === 'success') {
                    //console.log(response.user);
                    dataSend(response.user)
                } else {
                    console.log('error at adding friend')
                }
            })
            .catch((err) => console.log(err))
    }

    function chatFdBtn(fdId) {
        //console.log('Logged in user [', data._id, '] want to chat with friend [', fdId, ']');
        navigate(`/${data.userName}/profile/live-chat?chat=${fdId}`);
    }

    return (
        <>
            <div className="body">
                <div className="profile-content">

                    {/* <!-- ----------- Left Content----------- --> */}
                    <div className="left-content">
                        <div className="lfcon-top">
                            <div className="user-icon">
                                {fdInfo.imageUrl != '' && fdInfo.imageUrl != null ? (
                                    <img src={`${fdInfo.imageUrl}`} alt="icon" />
                                ) : (
                                    <img src={Icon} alt="icon" />
                                )}
                            </div>
                            
                            <div>
                            <h2>
                                {fdInfo.firstName != '' && fdInfo.firstName != null ? fdInfo.firstName : 'FirstName'}{' '}
                                {fdInfo.lastName !== '' && fdInfo.lastName !== null ? fdInfo.lastName : 'LastName'}
                            </h2>
                            
                            <div className="chat-btn" onClick={(e) => chatFdBtn(fdInfo._id)}>
                                <TiMessages size={16} color={"blue"}  
                                style={{"marginRight": "5px"}}/> 
                                <span>Chat with {fdInfo.firstName}</span>
                            </div>
                            </div>

                        </div>
                        
                        {data.friends != null && data.friends.length != 0 &&
                        data.friends.find(
                            (friend) => friend.userName == fdInfo.userName
                        ) != null ? (
                            <>
                            <Button
                                className="fd-btn"
                                size="md"
                                disabled={true}
                            >
                                <BsCheckLg />
                                &nbsp;&nbsp;&nbsp;Friended
                            </Button>
                            <Button
                                className="unfd-btn"
                                size="md"
                                onClick={unFdBtn}
                            >
                                <BsXLg />
                                &nbsp;&nbsp;&nbsp;Unfriend
                            </Button>
                            </>
                        ) : (
                            <Button
                                className="fd-btn"
                                size="md"
                                onClick={addFdBtn}
                            >
                                <BsCheckLg />
                                &nbsp;&nbsp;&nbsp;Add Friend
                            </Button>
                        )}

                        <div className="lfcon-bottom">
                            <div className="user-info">
                                <div>
                                    <span><IoLogoGameControllerB /></span>
                                    {fdInfo.userName || 'UserName'}
                                </div>
                                <div>
                                    <span><BsGenderAmbiguous /></span>
                                    {fdInfo.gender || 'Gender'}
                                </div>
                                <div>
                                    <span><FaBirthdayCake /></span>
                                    {fdInfo.birthday != '' && fdInfo.birthday != null ? 
                                        moment.utc(fdInfo.birthday).format('MMMM Do, YYYY'): 'Birthday'}
                                </div>
                                <div>
                                    <span><GrLocation /></span>
                                    {fdInfo.location || 'Location'}
                                </div>
                            </div>
                            
                            <div className="user-desc">
                                <p>
                                    {fdInfo.description || 'No description'}
                                </p>
                            </div>
                        </div>

                    </div>


                    <RightBar data={data} />

                    <FloatingChat data={data} />
                </div>
            </div>
        </>
    )
}

export default FriendProfile
