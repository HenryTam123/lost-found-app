import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import googleLoginIcon from '../images/google-login-icon.jpg'
import facebookLoginIcon from '../images/facebook-login-icon.jpg'


export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login, signInWithGoogle, signInWithFacebook } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate('/home');
        } catch {
            setError("Failed to log in")
        }

        setLoading(false)
    }

    const handleGoogleLogin = async (e) => {
        try {
            setError("")
            setLoading(true)
            await signInWithGoogle();
            navigate('/');
        } catch (err) {
            console.log(error)
            setError("Failed to log in")
        }
    }

    const handleFacebookLogin = async (e) => {
        try {
            setError("")
            setLoading(true)
            await signInWithFacebook();
            navigate('/');
        } catch (err) {
            console.log(error)
            setError("Failed to log in")
        }

    }

    return (
        <div className="w-100 me-auto">
            <Card className="mx-auto" style={{ maxWidth: "600px" }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Log In</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email" className='mt-3'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password" className='mt-3'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-3" type="submit">
                            LOG IN
                        </Button>
                    </Form>
                    <div className="w-100 text-end mt-3 ml-auto">
                        <Link to="/forgot-password" className="cursor-pointer" style={{ color: "grey" }}>Forgot Password?</Link>
                    </div>
                    <div className="w-100 text-center mt-3">
                        - OR -
                    </div>
                    <Button disabled={loading} onClick={handleGoogleLogin} variant="light" style={{ backgroundColor: "white" }} className="w-100 mt-3 p-2 shadow-sm">
                        <img src={googleLoginIcon} style={{ height: "30px", marginRight: "10px" }} />

                        Sign in with Google
                    </Button>
                    <Button disabled={loading} onClick={handleFacebookLogin} style={{ backgroundColor: "rgb(59,89,152)" }} className="w-100 mt-3 p-2 shadow-sm">
                        <img src={facebookLoginIcon} style={{ height: "30px", marginRight: "10px" }} />
                        Sign in with Facebook
                    </Button>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2 mx-auto" style={{ maxWidth: "600px" }}>
                Need an account? <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    )
}
