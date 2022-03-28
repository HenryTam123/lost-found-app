import React, { useState, useEffect } from 'react'
import { getOnePost } from '../utilities/firestoreAPIs.js';
import {  Container, Alert, Spinner } from 'react-bootstrap'
import { useAuth } from "../context/AuthContext"
import { useLocation, useNavigate } from "react-router-dom"
import { addPost } from '../utilities/firestoreAPIs'
import OriginalForm from './OriginalForm'

const EditForm = () => {
    const [currentPost, setCurrentPost] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [urls, setUrls] = useState([]);
    const { currentUser } = useAuth();


    const location = useLocation();
    const navigate = useNavigate();
   



    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            let postId = location.pathname.split("/").pop();
            const data = await getOnePost(postId);
            setCurrentPost(data)
            setIsLoading(false)
        }
        fetchData()
    }, [])

    return (

        <div style={{ paddingTop: "75px" }}>
            <Container className="my-4" >
                {isLoading ? <div className='d-flex justify-content-center' style={{ minHeight: "70vh" }}>
                    <Spinner animation="border" className="my-auto" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div> :
                    <>
                        <h4 className='my-4 py-2 custom-label'>Update your item</h4>


                        {!!currentUser && currentUser.email === currentPost.creatorEmail ?
                            <OriginalForm isUpdateMode={true} /> : <div style={{ minHeight: "70vh" }}>
                                <Alert variant='danger'>Unauthorized</Alert>
                            </div>}</>}


            </Container>
        </div>


    )
}

export default EditForm
