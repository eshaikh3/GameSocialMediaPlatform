import React, { useState, useEffect } from 'react'
import './FriendRequest.css'
import FloatingChat from '../../Components/FloatingChat/FloatingChat'
import RightBar from '../../Components/RightBar/RightBar'
import { Link } from 'react-router-dom'
import { Button, Card, Row, Col } from 'react-bootstrap'
import { TiMessages } from 'react-icons/ti'
import { BsCheckLg, BsXLg } from 'react-icons/bs'

function FriendRequest({ data }) {
    return (
        <>
            {/* <NavBar data={data}/> */}
            <div className="main-content">
                <div className="setting-left">
                    <h2 className="mb-4">
                        Friend Requests (Need to update this page!!)
                    </h2>
                    {/*<div className="fdreq-window">
                        {data.friends === null || data.friends.length === 0 ? (
                            <span>No friend requests</span>
                        ) : (
                            data.friendsRequest.map((fd) => {
                                return (
                                    <Card className="fdreq-card mb-4">
                                        <Row>
                                            <Col>
                                                <Card.Img
                                                    className="fdreq-img"
                                                    src={fd.imgUrl}
                                                />
                                            </Col>

                                            <Col xs={7}>
                                                <div className="fdreq-body">
                                                    <Card.Text className="card-txt">
                                                        <Link
                                                            to={`/${data.userName}/profile/friend?user=${fd.userName}`}
                                                            style={{
                                                                textDecoration:
                                                                    'none',
                                                            }}
                                                        >
                                                            <b>
                                                                {fd.firstName}{' '}
                                                                {fd.lastName}
                                                            </b>
                                                        </Link>
                                                        sent you a friend
                                                        request.
                                                    </Card.Text>
                                                    <TiMessages
                                                        size={20}
                                                    ></TiMessages>
                                                </div>
                                            </Col>

                                            <Col xs={3}>
                                                <div className="fdreq-btns">
                                                    <Button
                                                        className="accept-btn"
                                                        size="sm"
                                                    >
                                                        <BsCheckLg />
                                                        &nbsp;&nbsp;&nbsp;Accept
                                                    </Button>
                                                    <Button
                                                        className="reject-btn"
                                                        size="sm"
                                                    >
                                                        <BsXLg />
                                                        &nbsp;&nbsp;&nbsp;Reject
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                )
                            })
                        )}

                        {/* <Card className="fdreq-card mb-4">
                        <Row>
                            <Col><Card.Img className="fdreq-img" src={Icon} /></Col>
                            
                            <Col xs={7}>
                                <div className="fdreq-body">
                                    <Card.Text className="card-txt"><b>Jeannette Wong</b> sent you a friend request.</Card.Text>
                                    <TiMessages size={20}></TiMessages>
                                </div>
                            </Col>

                            <Col xs={3}>
                                <div className="fdreq-btns">
                                    <Button className="accept-btn" size="sm"><BsCheckLg />&nbsp;&nbsp;&nbsp;Accept</Button>
                                    <Button className="reject-btn" size="sm"><BsXLg />&nbsp;&nbsp;&nbsp;Reject</Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    <Card className="fdreq-card mb-4">
                        <Row>
                            <Col><Card.Img className="fdreq-img" src={Icon} /></Col>
                            
                            <Col xs={7}>
                                <div className="fdreq-body">
                                    <Card.Text className="card-txt"><b>Danish Sharma</b> sent you a friend request.</Card.Text>
                                    <TiMessages size={20}></TiMessages>
                                </div>
                            </Col>

                            <Col xs={3}>
                                <div className="fdreq-btns">
                                    <Button className="accept-btn" size="sm"><BsCheckLg />&nbsp;&nbsp;&nbsp;Accept</Button>
                                    <Button className="reject-btn" size="sm"><BsXLg />&nbsp;&nbsp;&nbsp;Reject</Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    <Card className="fdreq-card mb-4">
                        <Row>
                            <Col><Card.Img className="fdreq-img" src={Icon} /></Col>
                            
                            <Col xs={7}>
                                <div className="fdreq-body">
                                    <Card.Text className="card-txt"><b>Ebrahim Shaikh</b> sent you a friend request.</Card.Text>
                                    <TiMessages size={20}></TiMessages>
                                </div>
                            </Col>

                            <Col xs={3}>
                                <div className="fdreq-btns">
                                    <Button className="accept-btn" size="sm"><BsCheckLg />&nbsp;&nbsp;&nbsp;Accept</Button>
                                    <Button className="reject-btn" size="sm"><BsXLg />&nbsp;&nbsp;&nbsp;Reject</Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    <Card className="fdreq-card mb-4">
                        <Row>
                            <Col><Card.Img className="fdreq-img" src={Icon} /></Col>
                            
                            <Col xs={7}>
                                <div className="fdreq-body">
                                    <Card.Text className="card-txt"><b>Leon Liu</b> sent you a friend request.</Card.Text>
                                    <TiMessages size={20}></TiMessages>
                                </div>
                            </Col>

                            <Col xs={3}>
                                <div className="fdreq-btns">
                                    <Button className="accept-btn" size="sm"><BsCheckLg />&nbsp;&nbsp;&nbsp;Accept</Button>
                                    <Button className="reject-btn" size="sm"><BsXLg />&nbsp;&nbsp;&nbsp;Reject</Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                    </div>*/}
                </div>

                {/* <!-- ----------- Right Bar----------- --> */}
                <RightBar data={data} />

                <FloatingChat data={data} />
            </div>
        </>
    )
}

export default FriendRequest
