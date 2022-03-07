import React, { useState } from 'react'
import { Container, Button, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

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
            <Navbar bg="white" variant="light" className='shadow-sm' expand="md">
                <Container>
                    <Navbar.Brand href="/">L&amp;F</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="navbarScroll">

                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="#features">Features</Nav.Link>
                            <Nav.Link href="/posts">Posts</Nav.Link>
                            {!!currentUser && <>
                                <Nav.Link href="/post-form">List your item</Nav.Link>
                                <Nav.Link href="/your-listing">Your Posts</Nav.Link>
                            </>}

                        </Nav>
                        {!!currentUser ?

                            <Nav className="ml-auto">
                                <Nav.Link className='d-flex my-auto'>
                                    <PersonOutlineIcon className="mr-2" />
                                    <div className=''> {currentUser.displayName}</div>
                                </Nav.Link>

                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>

                            </Nav>
                            :
                            <Nav className="ml-auto">
                                <Nav.Link href="./signup">Sign Up</Nav.Link>

                                <Nav.Link href="./login">Log In</Nav.Link>
                            </Nav>
                        }
                    </Navbar.Collapse>

                </Container>
            </Navbar>
        </>
    )
}

export default Header