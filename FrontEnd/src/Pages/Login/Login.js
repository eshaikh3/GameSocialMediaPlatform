import React, { useState } from 'react'
import { Form, FormGroup, Button, Spinner } from 'react-bootstrap'
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../RouteAuth/auth'

import Logo from '../../images/logo.jpg'
import './Login.css'

function Login({ dataSend, socket }) {
    const navigate = useNavigate()

    // ******** States **********
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')

    let [loading, setLoading] = useState(false)
    let [errorMsg, setErrorMsg] = useState(false)

    const auth = useAuth()

    // ********* Functions *************

    const registerBtnClicked = () => {
        navigate('/register')
    }

    const onEmailChange = (evt) => {
        setEmail((prev) => evt.target.value)
    }

    const onPasswordChange = (evt) => {
        setPassword((prev) => evt.target.value)
    }

    const handleSubmit = (e) => {
        setErrorMsg(false);
        e.preventDefault()

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
            setErrorMsg(true)
        } else {
            setLoading(true)
            fetch('https://pacific-savannah-96444.herokuapp.com/login', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password }),
            })
                .then((response) => response.json())
                .then((response) => {
                    //console.clear();
                    //console.log(response);      // User's information
                    if (response.message === 'success') {
                        setLoading(false)
                        setErrorMsg(false)
                        //console.log(response.user);
                        dataSend(response.user)
                        auth.login()
                        socket.emit("send_user", { _id: response.user._id, userName: response.user.userName });
                        navigate(`/${response.user.userName}/profile`)
                    } else {
                        setLoading(false)
                        setErrorMsg(true)
                        auth.logout()
                    }
                })
                .catch((err) => {
                    //console.log(err);
                    setLoading(false)
                    setErrorMsg(true)
                    auth.logout()
                })

            //console.log("submitted Form!", e.target.email.value, e.target.password.value);
        }
    }

    return (
        <>
            <Form className="regist-form" onSubmit={handleSubmit}>
                <img className="mb-5" src={Logo} alt="logo" />
                <FormGroup className="mb-4">
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        required
                        onChange={onEmailChange}
                    />
                </FormGroup>

                <FormGroup className="pb-4">
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        onChange={onPasswordChange}
                    ></Form.Control>
                </FormGroup>

                <Button
                    variant="primary"
                    type="submit"
                    id="login-btn"
                    disabled={loading}
                >
                    { loading ? <><Spinner animation="border" size="sm"/> Loading</>
                    :
                    "Login"
                    }
                </Button>
                <Link className="back-to-login" to="/forgotpassword">
                    Forgot Password?
                </Link>
                {errorMsg ? (
                    <div>
                        <h6 style={{ color: 'red', marginTop: '10px' }}>
                            Email or Password Incorrect
                        </h6>
                    </div>
                ) : (
                    ' '
                )}
            </Form>

            <div className="regist-form" id="regist-box">
                <h6 className="mb-3 mt-3 text-center">
                    Do not have an GSMP's account?
                </h6>
                <Button size="sm" onClick={registerBtnClicked}>
                    Register
                </Button>
            </div>
        </>
    )
}

export default Login
