import React, { useState } from 'react'
import { Form, FormGroup, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

import Logo from '../../images/logo.jpg'

function ForgotPassword() {
    const [email, setEmail] = useState("");
    let navigate = useNavigate()

    const onEmailChange = (evt) => {
        //console.log(evt.target.value)
        setEmail((prev) => evt.target.value)
    }

    const registerBtnClicked = () => {
        navigate('/register')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch("https://pacific-savannah-96444.herokuapp.com/forgotpassword", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
        })
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
            }) 
            .catch((err) => {
                console.log(err);
            })
        document.getElementById('sentEmail').hidden = false
        document.getElementById('userEmail').readOnly = true
        console.log(document.getElementById('userEmail'))
    }

    return (
        <>
            <Form className="regist-form" onSubmit={handleSubmit}>
                <img className="mb-5" src={Logo} alt="logo" />

                <h5 className="mb-2">Find Your Account</h5>
                <p className="mb-4">
                    Please enter your email and we will send you an updated
                    password for you to get back into your account.
                </p>

                <div id="sentEmail" hidden>
                    <h6 style={{ color: 'green', marginTop: '10px' }}>
                        New password is sent to the email if the email is
                        registered. Check spam messages.
                    </h6>
                </div>

                <FormGroup className="mb-4">
                    <Form.Control
                        id="userEmail"
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        required
                        readOnly={false}
                        onChange={onEmailChange}
                    />
                </FormGroup>

                <Button variant="primary" type="submit" id="login-btn">
                    Send Email
                </Button>
                <Link className="back-to-login" to="/login">
                    Back to Login
                </Link>
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

export default ForgotPassword
