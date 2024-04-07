import React, { useEffect } from 'react'
import './RightBar.css'
import Ads from '../../images/ads.jpg'
import Icon from '../../images/icon.png'
import { Link } from 'react-router-dom'

function RightBar({ data }) {
    useEffect(() => {}, [data])

    return (
        <div className="right-content">
            <div className="friends">
                <h4>Friends</h4>

                {data.friends === null || data.friends.length === 0 ? (
                    <span>No friends</span>
                ) : (
                    data.friends.slice(0, 5).map((fd, i) => {
                        return (
                            <Link
                                key={i}
                                to={`/${data.userName}/profile/friend?user=${fd.userName}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="frd-list">
                                    {/* <img src={Icon} alt="icon" /> */}
                                    <img src={fd.imageUrl || Icon} alt="icon" />
                                    <p>
                                        {fd.userName}
                                    </p>
                                </div>
                            </Link>
                        )
                    })
                )}
            </div>

            <div className="ads">
                <h4>Advertisement</h4>
                <img src={Ads} alt="Ads" />
            </div>
        </div>
    )
}

export default RightBar
