import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import logo from '../images/logo.jpeg'


const Footer = () => {
    return (
        <div className='w-100 bg-dark' style={{}} >
            <Container style={{ padding: "30px 0px" }}>
                <Row className="py-2">
                    <Col lg={4} md={4} sm={12} className="my-2 text-center">
                        <div className="text-white h5">
                            <img src={logo} alt='logo' width="40"
                                height="40" />
                        </div>
                        <div className="text-light ">Find Lost Items Online</div>
                    </Col>
                    <Col lg={4} md={4} sm={12} className="my-2 text-center" >
                        <div className="text-white h5">Contact Us</div>
                        <div className="text-light "><MailOutlineIcon style={{ color: "white", marginRight: "5px" }} />
                            4601courseproject@gmail.com</div>
                    </Col>
                    <Col lg={4} md={4} sm={12} className="text-center my-2">
                        <div className="text-white h5">Information</div>
                        <div><a className='text-light' target="_blank" href='https://www.termsandconditionsgenerator.com/live.php?token=h6xQxnYa5MI7NBiEaCWb0GnKWtjOZLdL'>Terms and Condition</a></div>
                        <div><a className='text-light ' target="_blank" href="https://www.termsfeed.com/live/b2f7405a-6825-4099-8fed-ccad12b2b59b">Privacy Policy</a></div>
                    </Col>

                </Row>
            </Container>
        </div>
    )
}

export default Footer