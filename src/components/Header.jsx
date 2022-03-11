import React, { useState } from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Header = () => {
    const { currentUser } = useAuth();

    return (
        <>
            <Navbar bg="white" variant="light" className='w-100 mt-0 shadow-sm position-fixed' style={{ top: "0px", zIndex: 1000 }} expand="md">
                <Container className="px-3">
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
                                <Nav.Link href="/chatroom">Inbox </Nav.Link>
                            </>}

                        </Nav>
                        {!!currentUser ?

                            <Nav className="ml-auto">
                                {/* <Nav.Link href="/chatroom">
                                    <ChatBubbleOutlineIcon />
                                </Nav.Link> */}
                                <Nav.Link className='d-flex my-auto' href={`/profile/${currentUser.email.split("@")[0]}`}>
                                    <img className='custom-personal-icon' src={currentUser.photoURL} />
                                    <div className=''> {currentUser.displayName}</div>
                                </Nav.Link>

                                <Nav.Link href="/logout">Logout</Nav.Link>

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