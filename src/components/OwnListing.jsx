import React, { useEffect, useState } from 'react';
import { getUserPosts } from '../utilities/firestoreAPIs.js';
import { Card, Button, Badge, Container, Row, Col, Carousel, Spinner } from 'react-bootstrap';
import Moment from 'react-moment';
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const OwnListing = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(async () => {
        setIsLoading(true)
        const data = await getUserPosts(currentUser.email);
        console.log(data)
        setPosts(data)
        setIsLoading(false)

    }, [])
    return (
        <div>
            <Container>
                <h4 className='text-start custom-label py-2'>Your Posts</h4>

            </Container>
            {!!currentUser ? <Container className='container d-flex flex-wrap my-3 '>

                {isLoading ? <div className='d-flex justify-content-center w-100' style={{ minHeight: "70vh" }}>
                    <Spinner animation="border" className="my-auto" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div> : <>

                    <Row className="w-100">
                        {
                            !!posts ? posts.map((post, i) => {
                                return (
                                    <Col lg={3} md={4} sm={6} key={i}>
                                        <Card className="shadow cursor-pointer custom-hover-effect w-100 my-3" key={i}>
                                            {post.imageUrls.length > 0 ?
                                                <Carousel variant="dark" interval={null}>
                                                    {post.imageUrls.map((url, i) => (
                                                        <Carousel.Item>
                                                            <img
                                                                className="d-block w-100"
                                                                style={{ objectFit: "cover", height: "200px" }}
                                                                src={url}
                                                                alt={`slide ${i + 1}`}
                                                            />
                                                        </Carousel.Item>
                                                    ))}
                                                </Carousel>

                                                : ''}
                                            <Card.Body style={{ cursor: "pointer" }} onClick={() => navigate(`/post/${post.id}`)}>
                                                <Card.Title>{post.itemName}</Card.Title>
                                                <Card.Text>
                                                    <Badge style={{ marginRight: "5px" }} bg="secondary">{post.category}</Badge>
                                                    <Badge bg="secondary">{post.status === "not_found" ? "Not found yet" : "Found"}</Badge>
                                                </Card.Text>

                                                <Card.Text>Description: {post.description}</Card.Text>
                                                {/* <Button variant="primary">More</Button> */}
                                                {post.lost_date &&
                                                    <Card.Text>Lost on <Moment format="YYYY/MM/DD">{post["lost_date"].seconds * 1000}</Moment></Card.Text>

                                                }
                                                {/* <Card.Text>Contact</Card.Text>
                                            <div>Phone: {post.contact.phone}</div>
                                            <div>Email: {post.contact.email}</div> */}

                                            </Card.Body>
                                            <Card.Footer>
                                                <Card.Text>
                                                    Posted by {post.creator}
                                                    <div className='text-muted' style={{ fontSize: "13px" }}><Moment fromNow ago>{post.createdAt}</Moment> ago</div>
                                                </Card.Text>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                )

                            }) :
                                <div>You do not have any listing yet</div>
                        }
                    </Row>
                </>}

            </Container> : <Button onClick={navigate('/login')}>Login</Button>}

        </div>
    )
}

export default OwnListing