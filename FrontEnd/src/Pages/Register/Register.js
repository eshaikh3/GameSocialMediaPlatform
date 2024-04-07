import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, FormGroup, Row, Col, Spinner } from 'react-bootstrap'
import Logo from '../../images/logo.jpg'
import './Register.css'

function Register() {
    // ************* States **************
    let [userName, setUserName] = useState('')
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [confirmPassword, setConfirmPassword] = useState('')
    let [firstName, setFirstName] = useState('')
    let [lastName, setLastName] = useState('')
    let [birthday, setBirthday] = useState(null)
    let [privacy, setPrivacy] = useState(false)

    let [loading, setLoading] = useState(false)
    let [err, setErr] = useState(false)
    let [errMsg, setErrMsg] = useState('')
    let navigate = useNavigate()

    // ********* Functions **********
    const onUserNameChange = (evt) => {
        setUserName((prev) => evt.target.value)
    }

    const onEmailChange = (evt) => {
        setEmail((prev) => evt.target.value)
    }

    const onPasswordChange = (evt) => {
        setPassword((prev) => evt.target.value)
    }

    const onConfirmPasswordChange = (evt) => {
        setConfirmPassword((prev) => evt.target.value)
    }

    const onFirstNameChange = (evt) => {
        setFirstName((prev) => evt.target.value)
    }

    const onLastNameChange = (evt) => {
        setLastName((prev) => evt.target.value)
    }

    const onBirthdayChange = (evt) => {
        setBirthday((prev) => evt.target.value)
    }

    const onPrivacyChange = (evt) => {
        setPrivacy((prev) => evt.target.checked)
    }

    const handleSubmit = (e) => {
        setLoading(true)
        setErr(false)
        e.preventDefault()
        
        const age =
            new Date(
                Date.now() - new Date(birthday).getTime()
            ).getUTCFullYear() - 1970

        if (age < 13) {
            setErrMsg(prev => 'Must be 13+ to register')
            setErr(true)
        }
        else if(password != confirmPassword){
            setErrMsg(prev => 'Password and Confirm Password do not match')
            setErr(true)
        }
        else {
            // setLoading(true)
            fetch('https://pacific-savannah-96444.herokuapp.com/register', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: userName,
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    birthday: birthday,
                    privacy: privacy,
                }),
            })
                .then((response) => response.json())
                .then((response) => {

                    if (response.message === 'success') {
                        setErr(false)
                        navigate('/login')
                    } else {
                        setErrMsg(prev => 'Email or Username is already taken.')
                        setErr(true)
                    }
                })
                .catch((err) => {
                    setErrMsg(prev => 'Problem at creating profile')
                    setErr(true)
                })
        }
        setLoading(false)
    }

    return (
        <div className="body">
            <Form className="regist-form" onSubmit={handleSubmit}>
                <img className="mb-3" src={Logo} alt="logo" />
                
                { (err) ?  <h6 id="errMsg">{errMsg}</h6> : '' }
                
                <h6 className="mb-4">Set up your log in information</h6>
                <FormGroup className="mb-4">
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        required
                        onChange={onEmailChange}
                    />
                </FormGroup>

                <FormGroup className="mb-4">
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        maxLength={64}
                        pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                        title="Password must be at least 8 characters in length, including at least 1 capital letter and 1 number."
                        onChange={onPasswordChange}
                    />
                </FormGroup>

                <FormGroup className="pb-4 password">
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        required
                        maxLength={64}
                        // pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                        // title="Password must be at least 8 characters in length, including at least 1 capital letter and 1 number."
                        onChange={onConfirmPasswordChange}
                    />
                </FormGroup>

                <h6 className="mb-4 mt-3">Set up your profile</h6>
                <Row className="mb-4">
                    <Col>
                        <Form.Group>
                            <Form.Control
                                name="firstName"
                                placeholder="First Name"
                                required
                                maxLength={64}
                                onChange={onFirstNameChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group>
                            <Form.Control
                                name="lastName"
                                placeholder="Last Name"
                                required
                                maxLength={64}
                                onChange={onLastNameChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-4">
                    <Form.Control
                        name="username"
                        placeholder="Username"
                        required
                        maxLength={64}
                        onChange={onUserNameChange}
                    />
                </Form.Group>

                <Form.Group className="mb-4 birthday">
                    <Form.Label>Birthday:</Form.Label>
                    <Form.Control
                        name="birthday"
                        type="date"
                        required
                        onChange={onBirthdayChange}
                    />
                </Form.Group>

                <Form.Group className="mb-4 policy-check">
                    <input
                        name="privacy"
                        type="checkbox"
                        id="privacy"
                        required
                        onChange={onPrivacyChange}
                    />{' '}
                    &nbsp;
                    <label>
                        {' '}
                        I agree to the{' '}
                        <Link to="/policy">
                            GSMP's Terms & Conditions Policy
                        </Link>
                    </label>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                { loading ? <><Spinner animation="border" size="sm"/> Registering</>
                    :
                    "Register"
                    }
                </Button>
            </Form>
            <Link className="back-to-login" to="/login">
                Back to Login
            </Link>
        </div>
    )
}

export default Register
