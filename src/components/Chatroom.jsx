import React, { useState, useEffect, useMemo } from 'react';
import { Form, Row, Col, Container, Spinner } from 'react-bootstrap';
import Moment from 'react-moment';
import { getChatrooms, updateChatMessage } from '../utilities/firestoreAPIs';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

const Chatroom = () => {
    const navigate = useNavigate()
    const [showLeft, setShowLeft] = useState(true)
    const { currentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false)
    const [chatrooms, setChatrooms] = useState([])
    const [currentChatroom, setCurrentChatroom] = useState()
    const [userInput, setUserInput] = useState('');

    useEffect(async () => {
        setIsLoading(true)
        let data = await getChatrooms(currentUser)
        if (!!data) {
            data.sort((a, b) => (a.updatedAt < b.updatedAt) ? 1 : -1)
            setChatrooms(data)
            setCurrentChatroom(data[0])
            setIsLoading(false)
        }



        setIsLoading(false)
    }, [])

    const handleSelectChatroom = (chatroom) => {
        setCurrentChatroom(chatroom)
        setShowLeft(false)

    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (userInput !== '') {
            console.log("called")
            let newMessage = {
                createdAt: new Date().getTime(),
                message: userInput,
                sender: currentUser.email
            }
            console.log(currentChatroom)
            await updateChatMessage(currentChatroom.id, newMessage)
            let data = await getChatrooms(currentUser)
            data.sort((a, b) => (a.updatedAt < b.updatedAt) ? 1 : -1)
            setChatrooms(data)
            setCurrentChatroom(data[0])
            setUserInput('')
        }

    }

    return (
        <div style={{ paddingTop: "75px" }}>
            <Container>
                <h4 className='py-2 custom-label'>Your Inbox</h4>
            </Container>
            {! !currentUser && chatrooms.length !== 0 ?
                <div className="custom-chat-container my-3 shadow" >
                    <Row className="w-100" style={{ marginLeft: "0px", paddingLeft: "0px", paddingRight: "0px" }}>
                        <Col className={`custom-chat-left border ${!showLeft && " d-none d-md-block"}`} xs={12} lg={4} md={5} >
                            {chatrooms && currentChatroom && chatrooms.map((chatroom, i) => (
                                <div className={`custom-chat-snap border-bottom d-flex justify-content-between ${chatroom.postId === currentChatroom.postId && 'custom-chat-selected'}`} key={i}
                                    onClick={() => handleSelectChatroom(chatroom)}>
                                    <div>
                                        <img className='custom-personal-icon-chat' style={{ marginTop: "5px" }} src={chatroom.postCreatorPhoto} />
                                    </div>
                                    <div className='flex-1 d-flex flex-column w-100'>
                                        <div className='text-muted'>{chatroom.postCreator}</div>
                                        {/* <div className="custom-sameline-text">{chatroom.postTitle}</div> */}
                                        <div style={{ marginTop: "10px" }} >

                                            <div className='custom-sameline-text'>{chatroom.messages[chatroom.messages.length - 1].message}</div>
                                            <div className='text-muted' style={{ fontSize: "13px", marginLeft: "" }}><Moment fromNow ago>{chatroom.updatedAt}</Moment> ago
                                            </div>
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column ml-auto'>
                                        <img className="custom-chat-post-icon" src={chatroom.postThumb} />
                                    </div>
                                </div>

                            ))}
                        </Col>
                        <Col className={`${showLeft && "d-none"} d-md-flex custom-chat-right d-flex flex-column`} xs={0} sm={0} lg={8} md={7}>
                            {!!currentChatroom &&
                                <>
                                    <div className='custom-chat-header border-bottom border-top align-items-center'>
                                        <ArrowBackIcon className="d-block d-xs-block d-sm-block d-md-none d-lg-none" style={{ cursor: "pointer" }} onClick={() => setShowLeft(true)} />

                                        <div className='d-flex align-items-center' style={{ minWidth: "180px", marginLeft: "10px" }}>
                                            <img className='custom-personal-icon-chat' src={currentChatroom.postCreatorPhoto} style={{ marginTop: "5px" }} />
                                            <div className=''>
                                                <div >{currentChatroom.postCreator}</div>
                                            </div>
                                        </div>

                                        <div className='d-flex align-items-center w-auto'
                                            style={{ justifySelf: "flex-end", marginRight: "20px", marginLeft: "auto", cursor: "pointer" }}
                                            onClick={() => navigate(`/post/${currentChatroom.postId}`)}
                                        >
                                            <div className='cursor-pointer custom-sameline-text-two' >{currentChatroom.postTitle}</div>
                                            <img className="custom-chat-post-icon" src={currentChatroom.postThumb} />

                                        </div>
                                    </div>

                                    <div className='custom-chat-body flex-1 d-flex flex-column'>
                                        {currentChatroom.messages.map((message, i) => {
                                            if (message.sender === currentUser.email) {
                                                return <div className='custom-chat-message-right' key={i}>{message.message}</div>
                                            } else {
                                                return <div className='custom-chat-message-left' key={i}>{message.message}</div>

                                            }
                                        })}
                                    </div>
                                    <div className='custom-chat-inputbox border-top'>
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Control type='text' placeholder='Input here..' value={userInput}
                                                onChange={(e) => { setUserInput(e.target.value) }}
                                            ></Form.Control>

                                        </Form>

                                    </div>

                                </>
                            }

                        </Col>

                    </Row>
                </div > : isLoading ? <div className='d-flex justify-content-center p-0' style={{ minHeight: "80vh" }}>
                    <Spinner animation="border" className="my-auto" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div> : <div style={{ minHeight: "90vh" }}>You don't have any chatroom yet</div>}

        </div >

    )
}

export default Chatroom