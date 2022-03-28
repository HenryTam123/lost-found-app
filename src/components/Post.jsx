import React, { useEffect, useState } from 'react';
import { getOnePost, deletePost, createChatroom } from '../utilities/firestoreAPIs.js';
import { Container, Row, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"
import PostCard from './PostCard.jsx';

const Post = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [post, setPost] = useState([]);
    const { currentUser } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect( () => {
        const fetchData = async () =>{
            setIsLoading(true)
            let postId = location.pathname.split("/").pop();
            const data = await getOnePost(postId);
            setPost(data)
            setIsLoading(false)
        }

        fetchData()
        
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
                            <PostCard post={post} isDetailMode={true} currentUser={currentUser} />
                        }
                    </Row></>}
            </Container >
        </div >
    )
}

export default Post