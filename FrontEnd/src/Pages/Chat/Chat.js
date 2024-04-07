import React, { useState, useEffect, useRef} from 'react'
import './Chat.css'
import Icon from '../../images/icon.png'
import Global from '../../images/global.png'
import RightBar from '../../Components/RightBar/RightBar'
import Message from '../../Components/Message/Message'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { RiChatNewLine } from 'react-icons/ri';

export default function LiveChat({ data, socket }) {
    let navigate = useNavigate();
    let scrollChatDown = document.querySelector('.cm-top');
    
    // make sure the useEffect[] only fire once
    const dataFetchedRef = useRef(false);

    const [convoList, setConvoList] = useState([]);
    const [filterConvoList, setFilterConvoList] = useState([]);

    const [newChat, setNewChat ] = useState('');
    let [errorMsg, setErrorMsg] = useState(false);

    const [searchParams] = useSearchParams();
    //const [chat, setChat] = useState(searchParams.get('fd'));

    // Messages input from text space
    const [message, setMessage] = useState("");

    // Array of messages to be displayed
    const [msgArray, setMsgArray] = useState([]);   // if it is global chat, max 100 messages

    // To to which the messages needs to be sent
    // Right now only empty room for global chat
    //const [room, setRoom] = useState("");

    const msgInput = useRef(null);

    function chatClicked(fdId){
        navigate(`/${data.userName}/profile/live-chat?fd=${fdId}`)
    }

    const onSearchChatChange = (evt) => {
        setFilterConvoList(prev => convoList.filter (
            c=>c.userName.includes(evt.target.value))
        );
    };

    // Messages Event changes or sending message to socket.
    const onMessageChange = (evt) => {
        setMessage(prev => evt.target.value);
    };

    const checkConvoExist = async (fd, isUsername) => {
        console.log('fdid: ', fd)
        const foundFd = convoList.find(c => {
            if(isUsername) return c.userName == fd
            else return c._id == fd
        });

        if(foundFd != undefined){
            //if chat is already exist, return the chat
            navigate(`/${data.userName}/profile/live-chat?fd=${foundFd._id}`);
            setErrorMsg(false);
            clearInputValue();
        }
        // user enter friend username in the input box to start a new chat
        else if (isUsername){
            //see if the username exist in the database first
            await fetch(`https://pacific-savannah-96444.herokuapp.com/user/${fd}`)
                .then((response) => response.json())
                .then((response) => {
                    if (response.message === 'success' && response.user != null) {
                        //create a new chat
                        createNewChat(response.user._id);
                        //loadConvoListForUser();
                        //navigate(`/${data.userName}/profile/live-chat?fd=${response.user._id}`);
                    }
                    else{
                        //To Do: display some sort of error message to user
                        console.log('Unable to create new chat. Username is not found!');
                        setErrorMsg(true);
                    }
                })
                .catch((err) => console.log(err))
        }
        // navigate to current page from click "chat" button from other pages
        else{
            createNewChat(fd);
            //navigate(`/${data.userName}/profile/live-chat?fd=${fd}`);
        }
    }


    // Press "Enter" to start a new chat
    const handleKeyPressFromNewChat = (e) => {
        if (e.key === 'Enter')
            checkConvoExist(newChat, true);
    }

    const createNewChat = async (fdId) => {
        // Leaving the global room in socket
        socket.emit("leave_global");
        var time = Date.now();
        var msg = {
            to: searchParams.get('chat'),
            from: data._id,
            content: "Hello, my name is " + data.userName,
            time: time
        }

        //fetch the chat history for 'data._id' && 'searchParams.get('fd')'
        await fetch('https://pacific-savannah-96444.herokuapp.com/storemessage', { 
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                messageInfo: { 
                    recipients: [data._id, fdId],
                    message: msg
                    // {
                    //     to: searchParams.get('fd'),
                    //     from: data._id,
                    //     content: "Hello, my name is " + data.userName,
                    //     time: Date.now()
                    // }
                }
            })
        })
        .then((response) => response.json())
        .then((response) => {
            if (response.message === "success"){

                loadConvoListForUser();
                navigate(`/${data.userName}/profile/live-chat?fd=${searchParams.get('chat')}`);
            }

        })
        // .then((response) => {
        //     if (response.message === "success"){
        //         navigate(`/${data.userName}/profile/live-chat`);
        //         navigate(`/${data.userName}/profile/live-chat?fd=${fdId}`);
        //     }

        // })
        .catch((err) => console.log("Err from storing message: ", err)); 
    }

    const sendMessage = () => {
        if (message){
        let time = new Date();
        //socket.emit("send_message", { message: { content: message, time: time }, room: room });
        socket.emit("send_message", 
                                {
                                    to: searchParams.get('fd'),
                                    from: 
                                    {
                                        _id: data._id,
                                        userName: data.userName, 
                                        imageUrl: data.imageUrl
                                    },
                                    content: message,
                                    time: time 
                                }
        );

        if(searchParams.get('fd') == 'global'){
            if(msgArray.length == 100){
                msgArray.shift();
            }
        }
        else{
            //If not global chat, save the message into the database:
            fetch('https://pacific-savannah-96444.herokuapp.com/storemessage', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messageInfo: {
                        recipients: [data._id, searchParams.get('fd')],
                        message:{
                            to: searchParams.get('fd'),
                            from: data._id,
                            content: message,
                            time: time
                        }
                    }
                }),
            })
            .catch((err) => console.log(err))
        }

        setMsgArray(prev => [...prev, 
            {
                //to: "global",
                to: searchParams.get('fd'),
                from:
                {
                    _id: data._id,
                    userName: data.userName,
                    imageUrl: data.imageUrl
                },
                content: message,
                time: time
            }]);

        msgInput.current.value = '';
    }
        setMessage(prev => '');
    };

    const handleKeyPressFromMsg = (evt) => {
        if (evt.key === 'Enter' && message) {
            evt.preventDefault();
            sendMessage();
        }
        if (evt.which === 13){
            evt.preventDefault();
        }
        setMessage(prev => '');
    };

    const clearInputValue = () =>{
        var inputValue = document.querySelector('.addChat-input');
        if (inputValue.value !="") {
            inputValue.value = "";
        }
    }

    const loadConvoListForUser = async() => {
        await fetch(`https://pacific-savannah-96444.herokuapp.com/conversations/${data._id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((response) => response.json())
        .then((response) => {
            if (response.message === "success") {
                setConvoList(prev => response.conversationsData);
                setFilterConvoList(prev => response.conversationsData);
            }
        })
        .catch((err) => console.log(err));
    }

    //fetch a list of conversation the 'data._id' has (the logged in user) 
    useEffect(()=>{
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        loadConvoListForUser();
        // if(searchParams.get('fd'))
        //     checkConvoExist(searchParams.get('fd'), false);
        if(searchParams.get('chat'))
        checkConvoExist(searchParams.get('chat'), false);
    },[])

    // update the message array each time the URL(searchParams)/socket change 
    useEffect(() => {
        loadConvoListForUser();
        setMsgArray(prev => []);

        if (searchParams.get('fd') == 'global') {
            socket.emit("join_global");
        }

        if (searchParams.get('fd') != 'global'){
            // Leaving the global room in socket
            socket.emit("leave_global");
            //fetch the chat history for 'data._id' && 'searchParams.get('fd')'
            fetch('https://pacific-savannah-96444.herokuapp.com/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipients: [data._id, searchParams.get('fd')]
                }),
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.message === "success") {
                        response.messagesData.messages.forEach(element => setMsgArray(prev => [...prev, element]));
                    }
                    else {
                        setMsgArray(prev => []);
                    }
                })
                .catch((err) => console.log(err))
        }
        
        socket.on("receive_message", (dataMessage) => {
            if(searchParams.get('fd') == 'global' && dataMessage.to == 'global'){
                // only keep the latest 100 message for the global chat
                if(msgArray.length == 100) {
                    msgArray.shift();
                }
    
                setMsgArray(prev => [...prev, dataMessage]);
            }
            else if (searchParams.get('fd') != 'global' && dataMessage.to != 'global'){
                setMsgArray(prev => [...prev, dataMessage]);
            }
        })
        
        return function cleanup() {
            socket.removeListener("receive_message");
        };
    }, [searchParams, socket])

    // keep the chat scroll to the bottom
    useEffect(() => {
        if(scrollChatDown){
            scrollChatDown.scrollTop = scrollChatDown.scrollHeight - scrollChatDown.clientHeight;
        }
    }, [msgArray])

    useEffect(()=>{
        setErrorMsg(false);
        clearInputValue();
    }, [searchParams.get('fd')])

    // useEffect(()=>{
    //     //navigate(`/${data.userName}/profile/live-chat?fd=${searchParams.get('fd')}`);
    // },[convoList])

    return (
        <div className="main-content">
            <div className="left-content-chat">
                <div className="chat-window">
                    <div className="chat-menu">
                        <div className="cm-wp">
                            <div className="addChat">
                                { errorMsg ? <div className='addChat-err'> Username is not found!</div> : ''}
                                <RiChatNewLine size={20} color={"green"}/>
                                <span className="addChat-title">Start a new chat</span>
                                <input
                                    placeholder="Enter username"
                                    className="addChat-input"
                                    maxLength={64}
                                    onChange={(e) =>setNewChat((prev) => e.target.value)}
                                    onKeyPress={handleKeyPressFromNewChat}
                                    />
                            </div>

                            <input
                                placeholder="Search chat"
                                className="search-chat"
                                maxLength={64}
                                required
                                onChange={onSearchChatChange}
                            />

                            <div className={"chats-list"}>
                                <div className={searchParams.get('fd') == 'global'? "chat-select active": "chat-select"} onClick={()=>chatClicked('global')}>
                                    <img className="chat-img" src={Global} />
                                    <span> Global Chat</span>
                                </div>

                                { (filterConvoList != null && filterConvoList.length != 0) ?
                                        filterConvoList.map((c, i) => (
                                            <div className={ (searchParams.get('fd') == c._id)? "chat-select active": "chat-select"} key={i} onClick={()=>chatClicked(c._id)}>
                                                <img className="chat-img" src={c.imageUrl || Icon} />
                                                <span> {c.userName} </span>
                                            </div>
                                        ))
                                        :
                                        <></>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="chat-msg">
                        <div className="chat-wp">
                            {searchParams.get('fd') ?
                            <>
                                <div className="cm-top">
                                {
                                    (msgArray != null && msgArray.length != 0) ?
                                        msgArray.map((element, i) => {
                                            return <Message 
                                                    key={i} 
                                                    login_user={data._id == element.from._id}
                                                    messageInfo={element}
                                                    />
                                        })
                                        :
                                        <div style={{textAlign: "center", "padding-top": "100px"}} > Say something to start the chat </div>
                                }
                                </div>

                                <div className="cm-bottom">
                                    <textarea
                                        ref={msgInput}
                                        className="msg-input"
                                        placeholder="send a message..."
                                        onChange={onMessageChange} 
                                        onKeyPress={handleKeyPressFromMsg}
                                    >
                                    </textarea>
                                        <button className="send-msg-btn" onClick={sendMessage}> Send </button>
                                </div>
                            </>
                            :
                            <div style={{textAlign: "center", "padding-top": "100px"}}>Select a chat or start a new conversation</div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <RightBar data={data} />
        </div>
    )
}
