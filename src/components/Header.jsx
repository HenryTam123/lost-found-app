import React, { useState } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import logo from "../images/logo.jpeg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <Navbar
        bg="white"
        variant="light"
        className="w-100 mt-0 shadow-sm position-fixed"
        style={{ top: "0px", zIndex: 1000 }}
        expand="md"
      >
        <Container className="px-3">
          <Navbar.Brand href="/">
            <img src={logo} alt="logo" width="40" height="40" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto text-center">
              <Nav.Link href="/">Home</Nav.Link>
              {/* <Nav.Link href="#features">Features</Nav.Link> */}
              <Nav.Link href="/posts">Posts</Nav.Link>
              {!!currentUser && (
                <>
                  <Nav.Link href="/post-form">List your item</Nav.Link>
                  <Nav.Link href="/your-listing">Your Posts</Nav.Link>
                  <Nav.Link href="/chatroom">Inbox </Nav.Link>
                  <Nav.Link href="/support-us">Support Us </Nav.Link>
                </>
              )}
            </Nav>
            {!!currentUser ? (
              <Nav className="ml-auto">
                <Nav.Link
                  className="d-flex my-auto justify-content-center"
                  href={`/profile/${currentUser.email.split("@")[0]}`}
                >
                  <img className="custom-personal-icon" src={currentUser.photoURL} />
                  <div className="d-flex align-items-center"> {currentUser.displayName}</div>
                </Nav.Link>

                <Nav.Link className="d-flex align-items-center justify-content-center" href="/logout">
                  Logout
                </Nav.Link>
              </Nav>
            ) : (
              <Nav className="ml-auto">
                {/* <Nav.Link href="./signup">Sign Up</Nav.Link> */}

                <Nav.Link href="/login">Log In</Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
