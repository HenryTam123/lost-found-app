import React, { useEffect } from 'react'
import { Button, Container, Row, Col } from 'react-bootstrap'
import landingPicture from '../images/landing.svg'
import Image from 'react-bootstrap/Image'
import { useNavigate } from "react-router-dom"
import { createUser } from '../utilities/firestoreAPIs'
import { useAuth } from "../context/AuthContext";


const Home = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const handleStart = () => {
        navigate('./posts')
    }


    useEffect(async () => {
        await createUser(currentUser)

    }, [])

    return (
        < >
            <Container style={{ minHeight: "70vh", paddingTop: "55px" }} >
                <Row className='py-5 px-1 mt-4'>
                    <Col xs={12} md={4} lg={4} className="my-auto">
                        <div className='h1 mb-4 mt-5' >
                            Help Someone Find Their Lost Items
                        </div>
                        <Button className='custom-bg-primary btn-lg font-weight-bold' onClick={handleStart}>GET STARTED</Button>
                    </Col>
                    <Col xs={12} md={8} lg={8} className="mt-3">
                        <Image src={landingPicture} fluid={true} />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Home