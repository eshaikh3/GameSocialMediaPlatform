import React, { useState, useEffect } from 'react'
import './FloatingChat.css'
import Icon from '../../images/icon.png'
import { Form, Button, FormLabel } from 'react-bootstrap'

function FloatingChat({ data }) {
    let [showChat, setShowChat] = useState('')
    const openForm = () => setShowChat('block')
    const closeForm = () => setShowChat('none')

    return (
        <div className="live-chat">
            <Form
                className="form-container"
                id="myForm"
                style={{ display: showChat }}
            >
                <div className="chat-title">
                    <img src={Icon} alt="icon" />
                    <p>Friend Name #2</p>
                </div>

                <Form.Group className="chat-history"></Form.Group>

                {/* <textarea placeholder="Type message.." name="msg" required></textarea> */}
                <Form.Group>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        name="msg"
                        placeholder="Type message.."
                        maxLength={200}
                        required
                    />
                </Form.Group>

                <Button type="submit" className="btn">
                    Send
                </Button>
                <Button className="btn cancel" onClick={closeForm}>
                    Close
                </Button>
            </Form>

            <div className="conversation-list">
                <div className="conversation">
                    <img src={Icon} alt="icon" onClick={openForm} />
                </div>
                {/* <div className="conversation">
                    <img src={Icon} alt="icon" onClick={openForm} />
                </div>
                <div className="conversation">
                    <img src={Icon} alt="icon" onClick={openForm} />
                </div>
                <div className="conversation">
                    <img src={Icon} alt="icon" onClick={openForm} />
                </div>
                <div className="conversation">
                    <img src={Icon} alt="icon" onClick={openForm} />
                </div> */}
            </div>
        </div>
    )
}

export default FloatingChat
