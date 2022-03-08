import React from 'react'
import { Button, Container, Row, Col } from 'react-bootstrap'
import landingPicture from '../images/landing2.png'
import Image from 'react-bootstrap/Image'
import { Link, useNavigate } from "react-router-dom"


const Home = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('./posts')
    }

    return (
        <>
            <Container style={{ minHeight: "70vh", marginTop: "10vh" }} >
                <Row>
                    <Col xs={12} md={4} lg={4} className="my-auto">
                        <div className='h1 mb-4' >
                            Help Someone Find Their Lost Items
                        </div>
                        <Button className='custom-bg-primary btn-lg font-weight-bold' onClick={handleStart}>GET STARTED</Button>
                    </Col>
                    <Col xs={12} md={8} lg={8}>
                        <Image src={landingPicture} fluid={true} />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Home