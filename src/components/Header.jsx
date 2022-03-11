import React, { useState } from 'react'
import { Container, Button, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const Header = () => {
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async (e) => {
        e.preventDefault()

        try {
            await logout()
            navigate("/login")
        } catch {
            setError("Failed to log out")
        }
    }

    return (
        <>
            <Navbar bg="white" variant="light" className='w-100 mt-0 shadow-sm position-fixed' style={{ top: "0px", zIndex: 1000 }} expand="md">
                <Container>
                    <Navbar.Brand href="/">L&amp;F</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="navbarScroll">

                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            {/* <Nav.Link href="#features">Features</Nav.Link> */}
                            <Nav.Link href="/posts">Posts</Nav.Link>
                            {!!currentUser && <>
                                <Nav.Link href="/post-form">List your item</Nav.Link>
                                <Nav.Link href="/your-listing">Your Posts</Nav.Link>
                            </>}

                        </Nav>
                        {!!currentUser ?

                            <Nav className="ml-auto">
                                <Nav.Link href="/chatroom">
                                    <ChatBubbleOutlineIcon />
                                </Nav.Link>
                                <Nav.Link className='d-flex my-auto'>
                                    <img className='custom-personal-icon' src={currentUser.photoURL} />
                                    <div className='' onClick={() => navigate(`/profile/${currentUser.email.split("@")[0]}`)}> {currentUser.displayName}</div>
                                </Nav.Link>

                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>

                            </Nav>
                            :
                            <Nav className="ml-auto">
                                {/* <Nav.Link href="./signup">Sign Up</Nav.Link> */}

                                <Nav.Link href="/login">Log In</Nav.Link>
                            </Nav>
                        }
                    </Navbar.Collapse>

                </Container>
            </Navbar>
        </>
    )
}

export default Header