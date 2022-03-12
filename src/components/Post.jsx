import React, { useEffect, useState } from 'react';
import { getOnePost, deletePost, createChatroom } from '../utilities/firestoreAPIs.js';
import { Card, Button, Badge, Container, Row, Col, Carousel, Spinner, Modal } from 'react-bootstrap';
import Moment from 'react-moment';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"
import ShareIcon from '@mui/icons-material/Share';
import { WhatsappShareButton, WhatsappIcon, FacebookShareButton, FacebookIcon, TelegramShareButton, TelegramIcon } from 'react-share';

const Post = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [post, setPost] = useState([]);
    const { currentUser } = useAuth();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true)

    const location = useLocation();
    const navigate = useNavigate();


    const handleDeletePost = async () => {
        if (window.confirm("Do you really want to delete this post?")) {
            setIsLoading(true);
            await deletePost(post.id)
            setIsLoading(false)
            alert("Your post is deleted Successfully")
            navigate('/posts')
        }
    }

    const handleEditPost = () => {
        navigate(`/edit-form/${post.id}`)
    }

    const handleSharePost = () => {

    }

    const handleInbox = async (postId) => {
        await createChatroom(postId, currentUser)
        navigate(`/chatroom`)
    }

    useEffect(async () => {
        setIsLoading(true)
        let postId = location.pathname.split("/").pop();
        const data = await getOnePost(postId);
        setPost(data)
        setIsLoading(false)

    }, [])
    return (
        <div style={{ paddingTop: "75px" }}>
            <Container style={{ marginTop: "10vh" }} className='container d-flex flex-wrap my-3 justify-content-center mx-0'>
                {isLoading ? <div className='d-flex justify-content-center p-0' style={{ minHeight: "70vh" }}>
                    <Spinner animation="border" className="my-auto" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div> : <>


                    <Row className="w-100 m-0">

                        {post.length !== 0 &&
                            <><Modal show={show} onHide={handleClose}>

                                <Modal.Body closeButton>
                                    <div className='text-center mb-3'>Share this post to your social community</div>
                                    <div className='d-flex w-100 justify-content-center'>
                                        <WhatsappShareButton url={window.location.href} title={`Help to find ${post.itemName}`} className='mx-2'>
                                            <WhatsappIcon className="custom-social-icon" />
                                        </WhatsappShareButton>
                                        <FacebookShareButton url={window.location.href} quote={`Help to find ${post.itemName}`} hashtag={'lostandfound'} className='mx-2' v>
                                            <FacebookIcon className="custom-social-icon" />
                                        </FacebookShareButton>
                                        <TelegramShareButton url={window.location.href} title={`Help to find ${post.itemName}`} className='mx-2'>
                                            <TelegramIcon className="custom-social-icon" />
                                        </TelegramShareButton>
                                    </div>

                                </Modal.Body>

                            </Modal>
                                <Col lg={12}>
                                    <Card className=" w-100 my-3">
                                        {post.imageUrls.length > 0 ?
                                            <Carousel variant="dark" interval={null}>
                                                {post.imageUrls.map((url, i) => (
                                                    <Carousel.Item>
                                                        <img
                                                            className="d-block w-100"
                                                            style={{ objectFit: "cover", height: "500px" }}
                                                            src={url}
                                                            alt={`slide ${i + 1}`}
                                                        />
                                                    </Carousel.Item>
                                                ))}
                                            </Carousel>

                                            : ''}
                                        <Card.Body >

                                            <Card.Title>{post.itemName}</Card.Title>
                                            <Card.Text>
                                                <Badge style={{ marginRight: "5px" }} bg="secondary">{post.category}</Badge>
                                                <Badge style={{ marginRight: "5px" }} bg="secondary">{post.status === "not_found" ? "Not found yet" : "Found"}</Badge>
                                                <Badge style={{ marginRight: "5px" }} bg="primary">Reward: ${post.reward || 0}</Badge>

                                            </Card.Text>

                                            <Card.Title>Description</Card.Title>
                                            <Card.Text className='custom-post-big-text-container'>{post.description}</Card.Text>
                                            <Card.Title>Location</Card.Title>
                                            <Card.Text>{post.lostPlace ? post.lostPlace : 'none'}</Card.Text>
                                            <Card.Title>Date of Loss</Card.Title>
                                            <Card.Text><Moment format="YYYY/MM/DD">{post["lost_date"].seconds * 1000}</Moment> {post.lostTime || ''}</Card.Text>
                                            <Card.Title>Contact</Card.Title>
                                            <Card.Text>
                                                Phone: {post.contact.phone}
                                                <br />
                                                Email: {post.contact.email}
                                            </Card.Text>
                                        </Card.Body>
                                        <Card.Footer className='d-flex justify-content-between' style={{ backgroundColor: "white" }}>
                                            <Card.Text >
                                                Posted by
                                                <span style={{ marginLeft: "8px" }} className="custom-text-underline-hover" onClick={() => navigate(`/profile/${post.creatorEmail.split("@")[0]}`)}>
                                                    <img className='custom-personal-icon' src={post.creatorPhoto} />
                                                    {post.creator}
                                                </span>
                                                <div className='text-muted' style={{ fontSize: "13px" }}><Moment fromNow ago>{post.createdAt}</Moment> ago</div>
                                            </Card.Text>
                                            <Card.Text style={{ marginTop: "1rem" }}>
                                                <span className='d-flex justify-content-end'>
                                                    <Button style={{ marginRight: "10px" }} variant='secondary' onClick={handleShow}>Share</Button>

                                                    {!!currentUser ?
                                                        post.creatorEmail === currentUser.email ?
                                                            <>
                                                                <Button style={{ marginRight: "10px" }} variant='dark' onClick={handleEditPost}>Edit</Button>
                                                                <Button variant='danger' onClick={handleDeletePost}>Delete</Button>
                                                            </> :
                                                            <>
                                                                <Button variant='primary' onClick={() => handleInbox(post.id)}>Inbox</Button>
                                                            </> :
                                                        ''

                                                    }
                                                </span>
                                            </Card.Text>
                                        </Card.Footer>
                                    </Card>
                                </Col>

                            </>

                        }
                    </Row></>}
            </Container >


        </div >
    )
}

export default Post