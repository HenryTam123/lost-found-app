import React from 'react'
import { Button, Container, Row, Col } from 'react-bootstrap'
import landingPicture from '../images/landing2.png'
import Image from 'react-bootstrap/Image'

const Home = () => {
    return (
        <>
            <Container>
                <Row>
                    <Col xs={12} md={4} lg={4} className="my-auto">
                        <div className='h1 mb-4' >
                            Help Someone Find Their Lost Items
                        </div>
                        <Button className='custom-bg-primary btn-lg font-weight-bold'>GET STARTED</Button>
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