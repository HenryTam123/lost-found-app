import React, { useEffect, useState } from 'react';
import { getPosts } from '../utilities/firestoreAPIs.js';
import { Card, Button, Badge, Container, Row, Col, Carousel } from 'react-bootstrap';
import PencilImage from '../images/pencil.jpg';
import Moment from 'react-moment';

const Posts = () => {

    const [posts, setPosts] = useState([]);

    const [newPost, setNewPost] = useState({});

    useEffect(async () => {
        const data = await getPosts();
        console.log(data)
        setPosts(data)
    }, [])

    return (
        <>
            <Container className='container d-flex flex-wrap my-3'>
                <Row className="w-100">
                    {
                        !!posts ? posts.map((post, i) => {
                            console.log(post)
                            return (
                                <Col lg={3} md={4} sm={6}>
                                    <Card className="shadow cursor-pointer w-100 my-3" key={i}>
                                        {post.imageUrls.length > 0 ?
                                            <Carousel variant="dark">
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
                                        <Card.Body>
                                            <Card.Title>{post.item_name}</Card.Title>
                                            <Card.Text>{post.description}</Card.Text>
                                            <Button variant="primary">More</Button>
                                            <Card.Text> <Badge bg="secondary">clothes</Badge></Card.Text>
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
                            <div>NO LISTING</div>
                    }
                </Row>

            </Container>


        </>

    )
}

export default Posts