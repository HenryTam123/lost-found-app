import React, { useRef, useState } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext.js';
import { Link, useNavigate } from "react-router-dom"

const SignUp = () => {
    const { signup } = useAuth();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match")
        }

        try {
            setError("")
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            navigate('/login');
        } catch {
            setError("Failed to create an account")
        }

        setLoading(false)
    }


    return (
        <div className="w-100 me-auto">
            <Card className="mx-auto" style={{ maxWidth: "600px" }}>
                <h2 className='text-center my-2'>Sign Up</h2>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id='email' >
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' ref={emailRef}></Form.Control>
                        </Form.Group>
                        <Form.Group id="password" className='mt-3'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' ref={passwordRef}></Form.Control>
                        </Form.Group>
                        <Form.Group id="password-confirm" className='mt-3'>
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type='password' ref={passwordConfirmRef}></Form.Control>
                        </Form.Group>
                        <Button type="submit" disabled={loading} className='w-100 mt-4 cursor-pointer'>Sign Up</Button>
                    </Form>

                </Card.Body>
            </Card>
            <div className='w-100 text-center mt-2 mx-auto' style={{ maxWidth: "600px" }}>
                Already have an account? <Link to="/login">Log In</Link>
            </div>
        </div>
    )
}

export default SignUp