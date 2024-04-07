import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import NavBar from '../../Components/NavBar/NavBar'
import moment from 'moment'
import './Profile.css'
import Icon from '../../images/icon.png'
import { IoLogoGameControllerB } from 'react-icons/io'
import { BsGenderAmbiguous } from 'react-icons/bs'
import { FaBirthdayCake } from 'react-icons/fa'
import { GrLocation } from 'react-icons/gr'
import FloatingChat from '../../Components/FloatingChat/FloatingChat'
import RightBar from '../../Components/RightBar/RightBar'

function Profile({ data }) {
    //const navigate = useNavigate();

    // ********* Functions *************

    // const profileClicked = (data) => {
    //     navigate('/profile', data);
    // }
    const { username } = useParams()

    return (
        <div className="body">
            {/* <NavBar data={data}/> */}

            <div className="profile-content">

                {/* <!-- ----------- Left Content----------- --> */}
                <div className="left-content">
                    <div className="lfcon-top">
                        <div className="user-icon">
                            {data.imageUrl != '' && data.imageUrl != null ? (
                                <img src={`${data.imageUrl}`} alt="icon" />
                            ) : (
                                <img src={Icon} alt="icon" />
                            )}
                        </div>

                        <h2>
                            {data.firstName != '' && data.firstName != null ? data.firstName : 'FirstName'}{' '}
                            {data.lastName !== '' && data.lastName !== null ? data.lastName : 'LastName'}
                        </h2>
                    </div>
                    

                    <div className="lfcon-bottom">
                        <div className="user-info">
                            <div>
                                <span><IoLogoGameControllerB /></span>
                                {data.userName || 'UserName'}
                            </div>
                            <div>
                                <span><BsGenderAmbiguous /></span>
                                {data.gender != '' && data.gender != null ? data.gender : 'Gender'}
                            </div>
                            <div>
                                <span><FaBirthdayCake /></span>
                                {data.birthday != '' && data.birthday != null ? 
                                    moment.utc(data.birthday).format('MMMM Do, YYYY'): 'Birthday'}
                            </div>
                            <div>
                                <span><GrLocation /></span>
                                {data.location != '' && data.location != null? data.location: 'Location'}
                            </div>
                        </div>

                        <div className="user-desc">
                            <p>
                                {data.description != '' && data.description != null
                                    ? data.description
                                    : 'Go Setting to set up your personal description'}
                            </p>
                        </div>
                    </div>

                </div>


                {/* <!-- ----------- Left Content----------- --> */}
                {/* <div className="left-content">
                    <div className="user-icon">
                        {data.imageUrl != '' && data.imageUrl != null ? (
                            <img src={`${data.imageUrl}`} alt="icon" />
                        ) : (
                            <img src={Icon} alt="icon" />
                        )}
                    </div>

                    <div className="user-info">
                        <div>
                            <span>
                                <IoLogoGameControllerB />
                            </span>
                            {data.userName || 'UserName'}
                        </div>
                        <div>
                            <span>
                                <BsGenderAmbiguous />
                            </span>
                            {data.gender != '' && data.gender != null
                                ? data.gender
                                : 'Gender'}
                        </div>
                        <div>
                            <span>
                                <FaBirthdayCake />
                            </span>
                            {data.birthday != '' && data.birthday != null
                                ? moment
                                      .utc(data.birthday)
                                      .format('MMMM Do, YYYY')
                                : 'Birthday'}
                        </div>
                        <div>
                            <span>
                                <GrLocation />
                            </span>
                            {data.location != '' && data.location != null
                                ? data.location
                                : 'Location'}
                        </div>
                    </div>
                </div> */}

                {/* <!-- ----------- Mid Content----------- --> */}
                {/* <div className="mid-content">
                    <h2>
                        {data.firstName != '' && data.firstName != null
                            ? data.firstName
                            : 'FirstName'}{' '}
                        {data.lastName !== '' && data.lastName !== null
                            ? data.lastName
                            : 'LastName'}
                    </h2>
                    <div className="user-desc">
                        <p>
                            {data.description != '' && data.description != null
                                ? data.description
                                : 'Go Setting to set up your personal description'}
                        </p>
                    </div>
                </div> */}

                <RightBar data={data} />

                <FloatingChat data={data} />
            </div>
        </div>
    )
}

export default Profile
