import React from 'react';
import './Popup.css';
import { AiFillCloseSquare } from 'react-icons/ai'

function Popup(props){
    return (props.trigger) ? (
        <div className='popup-screen'>
            <div className="popup-wrapper">
                <button className='close-btn' onClick={()=>props.setTrigger(false)}><AiFillCloseSquare/>Close</button>
                { props.children}
            </div>
        </div>
    ) : '';
}

export default Popup;