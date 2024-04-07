import React from 'react';
import './Message.css';
import Icon from '../../images/icon.png';
import moment from 'moment-timezone';

export default function Message({ messageInfo, login_user }) {

    return (
        <div className={login_user ? 'msg login_user' : 'msg'}>
            <div className="msg-top">
                <img src={messageInfo.from.imageUrl || Icon} />
                <div>
                <p className='msg-from'>{messageInfo.from.userName}</p>
                <p>{messageInfo.content}</p>
                </div>
            </div>
            <div className="msg-bottom">
                {moment(messageInfo.time).tz("America/New_York").format("MMMDD, hh:mma")}
            </div>
        </div>
    )
}
