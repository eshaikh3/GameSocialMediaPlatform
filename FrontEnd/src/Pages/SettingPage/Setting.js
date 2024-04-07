import React, { useState, useEffect } from 'react'
import NavBar from '../../Components/NavBar/NavBar'
import Icon from '../../images/icon.png'
import './Setting.css'
import FloatingChat from '../../Components/FloatingChat/FloatingChat'
import RightBar from '../../Components/RightBar/RightBar'
import { useNavigate} from 'react-router-dom'
import { Form, Button, FormGroup, Row, Col, Spinner, FormLabel} from 'react-bootstrap'

function Setting({ data, dataSend }) {
    let [userName, setUserName] = useState(
        data.userName !== '' && data.userName !== null ? data.userName : ''
    )

    let [email, setEmail] = useState(
        data.email !== '' && data.email !== null ? data.email : ''
    )

    let [password, setPassword] = useState('')
    let [confirmPassword, setConfirmPassword] = useState('')

    let [firstName, setFirstName] = useState(
        data.firstName !== '' && data.firstName !== null ? data.firstName : ''
    )

    let [lastName, setLastName] = useState(
        data.lastName !== '' && data.lastName !== null ? data.lastName : ''
    )

    let [birthday, setBirthday] = useState(
        data.birthday !== '' && data.birthday !== null ? data.birthday : null
    )

    let [location, setLocation] = useState(
        data.location !== '' && data.location !== null ? data.location : ''
    )

    let [description, setDescription] = useState(
        data.description !== '' && data.description !== null
            ? data.description
            : ''
    )

    let [gender, setGender] = useState(
        data.gender !== '' && data.gender !== null ? data.gender : ''
    )

    let [imageUrl, setImageUrl] = useState(
        data.imageUrl !== '' && data.imageUrl !== null ? data.imageUrl : ''
    )

    let [image, setImage] = useState(null)

    let [loading, setLoading] = useState(false)
    let [err, setErr] = useState(false)
    let [errMsg, setErrMsg] = useState('')
    let navigate = useNavigate()

    const onUserNameChange = (evt) => {
        setUserName((prev) => evt.target.value)
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

    const onLocationChange = (evt) => {
        setLocation((prev) => evt.target.value)
    }

    const onDescriptionChange = (evt) => {
        setDescription((prev) => evt.target.value)
    }

    const onGenderChange = (evt) => {
        setGender((prev) => evt.target.value)
    }

    const onImageChange = (evt) => {
        setImage((prev) => evt.target.files[0])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setErr(false)
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
            setLoading(true)

            if (image) {
                const formData = new FormData()
                formData.append('_id', data._id)
                formData.append('userName', userName)
                formData.append('email', email)
                formData.append('password', password)
                formData.append('firstName', firstName)
                formData.append('lastName', lastName)
                formData.append('birthday', birthday)
                formData.append('description', description)
                formData.append('gender', gender)
                formData.append('location', location)
                formData.append('image', image)

                fetch('https://pacific-savannah-96444.herokuapp.com/updateImage', {
                    method: 'put',
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((response) => {
                        if (response.message === 'success') {
                            setLoading(false)
                            dataSend(response.user)
                            navigate(`/${response.user.userName}/profile`)
                        } else {
                            setLoading(false)
                            setErrMsg(prev => 'Email or Username is already taken.')
                            setErr(true)
                        }
                    })
                    .catch((err) => {
                        setLoading(false)
                        setErrMsg(prev => 'Problem at creating profile')
                        setErr(true)
                    })
            }
            else {
                fetch("https://pacific-savannah-96444.herokuapp.com/update", {
                    method: "put",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ _id: data._id, userName: userName, email: email, password: password, firstName: firstName, lastName: lastName, birthday: birthday, description: description, gender: gender, location: location })
                })
                    .then((response) => response.json())
                    .then((response) => {
                        if (response.message === 'success') {
                            setLoading(false)
                            setErr(false)
                            dataSend(response.user)
                            navigate(`/${response.user.userName}/profile`)
                        } else {
                            setLoading(false)
                            setErrMsg(prev => 'Email or Username is already taken.')
                            setErr(true)
                        }
                    })
                    .catch((err) => {
                        setLoading(false)
                        setErrMsg(prev => 'Problem at creating profile')
                        setErr(true)
                    })
            }
            

            
            
        }
    }

    return (
        <>
            {/* <NavBar data={data}/> */}
            <div className="main-content">
                <div className="setting-left">
                    <h2 className="mb-4">Setting</h2>
                    <div className="setting-window">
                        <Form className="setting-form" onSubmit={handleSubmit}>
                            <div className="icon-upload">
                                <img
                                    src={
                                        imageUrl != '' && imageUrl != null
                                            ? imageUrl
                                            : Icon
                                    }
                                    alt="icon"
                                />
                            </div>
                            
                            

                            <div className="account-setting">
                                { (err)? <h6 id="errMsg"> {errMsg} </h6>: '' }
                                <Form.Group as={Row} className="mb-4">
                                    <FormLabel column sm="3">
                                        Profile Picture:
                                    </FormLabel>
                                    <Col sm="9">
                                        <Form.Control
                                            name="image"
                                            type="file"
                                            onChange={onImageChange}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-4">
                                    <FormLabel column sm="3">
                                        Username:
                                    </FormLabel>
                                    <Col sm="9">
                                        <Form.Control
                                            name="username"
                                            value={userName}
                                            placeholder="Username"
                                            required
                                            maxLength={64}
                                            onChange={onUserNameChange}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-4">
                                    <FormLabel column sm="3">
                                        Name:
                                    </FormLabel>
                                    <Col sm="9">
                                        <Row>
                                            <Col>
                                                <Form.Control
                                                    name="firstName"
                                                    value={firstName}
                                                    placeholder="First Name"
                                                    required
                                                    maxLength={64}
                                                    onChange={onFirstNameChange}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    name="lastName"
                                                    value={lastName}
                                                    placeholder="lastName"
                                                    required
                                                    maxLength={64}
                                                    onChange={onLastNameChange}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Form.Group>

                                <FormGroup as={Row} className="mb-4">
                                    <FormLabel column sm="3">
                                        Email:
                                    </FormLabel>
                                    <Col sm="9">
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={email}
                                            placeholder={data.email}
                                            disabled
                                        />
                                    </Col>
                                </FormGroup>

                                <Form.Group as={Row} className="mb-4">
                                    <Form.Label column sm="3">
                                        Birthday:{' '}
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control
                                            name="birthday"
                                            type="date"
                                            value={
                                                birthday !== '' &&
                                                birthday !== null
                                                    ? new Date(birthday)
                                                          .toISOString()
                                                          .split('T')[0]
                                                    : null
                                            }
                                            required
                                            onChange={onBirthdayChange}
                                        />
                                    </Col>
                                </Form.Group>

                                <FormGroup as={Row} className="mb-4 ">
                                    <FormLabel column sm="3">
                                        Password:
                                    </FormLabel>
                                    <Col sm="9">
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Enter old/new password to save changes"
                                            required
                                            maxLength={64}
                                            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                                            title="Password must be at least 8 characters in length, including at least 1 capital letter and 1 number."
                                            onChange={onPasswordChange}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup as={Row} className="pb-4 password">
                                    <FormLabel column sm="3">
                                        Confirm Password:
                                    </FormLabel>
                                    <Col sm="9">
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Enter confirm old/new password to save changes"
                                            required
                                            maxLength={64}
                                            onChange={onConfirmPasswordChange}
                                        />
                                    </Col>
                                </FormGroup>

                                <Form.Group as={Row} className="mt-3 mb-4">
                                    <FormLabel column sm="3">
                                        Description:
                                    </FormLabel>
                                    <Col sm="9">
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="description"
                                            value={description}
                                            placeholder={
                                                'Enter your personal description'
                                            }
                                            maxLength={800}
                                            onChange={onDescriptionChange}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-4">
                                    <FormLabel column sm="3">
                                        Gender:
                                    </FormLabel>
                                    <Col sm="9">
                                        <Form.Select
                                            name="gender"
                                            aria-label="gender"
                                            value={gender}
                                            onChange={onGenderChange}
                                        >
                                            <option value="">
                                                Select an option
                                            </option>
                                            <option value="Male">Male</option>
                                            <option value="Female">
                                                Female
                                            </option>
                                            <option value="Non-Binary">
                                                Non-binary
                                            </option>
                                            <option value="Prefer not to say">
                                                Prefer not to say
                                            </option>
                                        </Form.Select>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-4">
                                    <FormLabel column sm="3">
                                        Location:
                                    </FormLabel>
                                    <Col sm="9">
                                        <Form.Control
                                            name="location"
                                            value={location}
                                            placeholder={'Location'}
                                            maxLength={64}
                                            onChange={onLocationChange}
                                        />
                                    </Col>
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={loading}
                                >
                                    { loading ? <><Spinner animation="border" size="sm"/> Saving</>
                                        :
                                        "Save"
                                    }
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>

                {/* <!-- ----------- Right Bar----------- --> */}
                <RightBar data={data} />

                <FloatingChat data={data} />
            </div>
        </>
    )
}

export default Setting
