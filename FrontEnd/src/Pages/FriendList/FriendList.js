import React, { useState, useEffect } from 'react'
import './FriendList.css'
import Icon from '../../images/icon.png'
import FloatingChat from '../../Components/FloatingChat/FloatingChat'
import RightBar from '../../Components/RightBar/RightBar'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Container } from 'react-bootstrap'
import { TiMessages } from 'react-icons/ti'
import { RiDeleteBinLine } from 'react-icons/ri'
import { BsSearch } from 'react-icons/bs'

function FriendList({ data, dataSend }) {
    let navigate = useNavigate();
    const [filterFdList, setFilterFdList] = useState(data.friends); 

    const onSearchFdChange = (evt) => { 
        setFilterFdList(prev => data.friends.filter( 
          f => f.userName.includes(evt.target.value)) 
        ); 
    } 

    function unFdBtn(fdId) {
        //console.log('Unfriend btn is clicked!')
        fetch('https://pacific-savannah-96444.herokuapp.com/removeFriend', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: data._id, friendId: fdId }),
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
            {/* <NavBar data={data}/> */}
            <div className="main-content">
                <div className="setting-left">
                    <h2 className="mb-4">Friend List</h2>

                    <div className="search-box-wrapper">
                        <div className="fd-search-box">
                            <BsSearch />
                            <input 
                                placeholder="Search friend" 
                                maxLength={64} 
                                onChange={onSearchFdChange} />
                        </div>
                    </div>

                    <div className="fdlist-window">
                        <Container fluid className={'no-gutters mx-0 px-0'}>
                            <Row noGutters={true}>
                                {filterFdList === null || filterFdList.length === 0 ? (
                                    <span>No friends</span>
                                ) : (
                                    filterFdList.map((fd, i) => {
                                        return (
                                            <Col key={i} xs={4} sm={4} md={4}>
                                                <Card className="fdlist-card mb-4">
                                                    <Row>
                                                        <Col className="card-left">
                                                            <Card.Img
                                                                className="fd-img"
                                                                src={ fd.imageUrl || Icon }
                                                            />
                                                        </Col>

                                                        <Col xs={7}>
                                                            <div className="fdlist-body text-center">
                                                                <Link className="card-link"
                                                                    to={`/${data.userName}/profile/friend?user=${fd.userName}`}
                                                                    >
                                                                    <Card.Text>
                                                                        <div className="card-txt overflow-ellipsis">
                                                                            {/* <p>{ fd.firstName} {' '} { fd.lastName }</p> */}
                                                                            <p>{fd.userName}</p>
                                                                            {/* <p className="card-fd-username"> {fd.userName}</p> */}
                                                                        </div>
                                                                    </Card.Text>
                                                                </Link>
                                                                <div>
                                                                <TiMessages size={20} color={"blue"} onClick={(e) => chatFdBtn(fd._id)} style={{cursor: "pointer"}}/>
                                                                &nbsp;
                                                                <RiDeleteBinLine size={20} color={"red"} onClick={(e) => unFdBtn(fd._id)} style={{cursor: "pointer"}} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                        )
                                    })
                                )}
                            </Row>
                        </Container>
                    </div>
                </div>

                {/* <!-- ----------- Right Bar----------- --> */}
                <RightBar data={data} />

                <FloatingChat data={data} />
            </div>
        </>
    )
}

export default FriendList
