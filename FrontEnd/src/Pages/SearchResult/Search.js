import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './Search.css'
import FloatingChat from '../../Components/FloatingChat/FloatingChat'
import RightBar from '../../Components/RightBar/RightBar'
import Icon from '../../images/icon.png'
import { Card, Row, Col, Container } from 'react-bootstrap'
import { TiMessages } from 'react-icons/ti'

function Search({ data }) {
    let navigate = useNavigate();
    const [searchParams] = useSearchParams()

    let [users, setUsers] = useState([])

    useEffect(() => {
        fetch(
            `https://pacific-savannah-96444.herokuapp.com/users/${searchParams.get(
                'term'
            )}`
        )
            .then((response) => response.json())
            .then((response) => {
                if (response.message === 'success') {
                    //console.log(response.user);
                    setUsers(response.user)
                } else {
                    console.log('Username is not found!')
                }
            })
    }, [searchParams])

    function chatFdBtn(fdId) {
        //console.log('Logged in user [', data._id, '] want to chat with friend [', fdId, ']');
        navigate(`/${data.userName}/profile/live-chat?chat=${fdId}`);
    }

    return (
        <>
            {/* <NavBar data={data}/> */}
            <div className="main-content">
                <div className="setting-left">
                    <h2 className="mb-4">
                        Search Result for "{searchParams.get('term')}"
                    </h2>

                    <div className="fdlist-window">
                        <Container fluid className={'no-gutters mx-0 px-0'}>
                            <Row noGutters={true}>
                                {users != null && users.length != 0 ? (
                                    users.map((user) => {
                                        if (data.userName != user.userName)
                                            return (
                                                <Col xs={4} sm={4} md={4}>
                                                    <Card className="fdlist-card mb-4">
                                                        <Row>
                                                            <Col className="card-left">
                                                                <Card.Img
                                                                    className="fd-img"
                                                                    src={user.imageUrl || Icon}
                                                                />
                                                            </Col>

                                                            <Col xs={7}>
                                                                <div className="fdlist-body text-center">
                                                                    <Link
                                                                        to={`/${data.userName}/profile/friend?user=${user.userName}`}
                                                                        style={{
                                                                            textDecoration:
                                                                                'none',
                                                                        }}
                                                                    >
                                                                        <Card.Text className="card-txt">
                                                                            <div className="card-txt overflow-ellipsis">
                                                                                <p>{user.userName}</p>
                                                                                {/* <p >{ user.firstName} {' '} { user.lastName }</p>
                                                                                <p className="card-fd-username"> {user.userName}</p> */}
                                                                            </div>
                                                                        </Card.Text>
                                                                    </Link>
                                                                    <TiMessages size={20} color={"blue"} onClick={(e) => chatFdBtn(user._id)} style={{cursor: "pointer"}}/>

                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                            )

                                        return <></>
                                    })
                                ) : (
                                    <span>No User Found</span>
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

export default Search;