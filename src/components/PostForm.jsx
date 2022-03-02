import React, { useState, useRef } from 'react'
import { Form, Button, Card, Image } from 'react-bootstrap'
import { storage } from '../firebase-config'
import { useAuth } from "../context/AuthContext"
import { addPost } from '../utilities/firestoreAPIs'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const PostForm = () => {

    const [images, setImages] = useState([])
    const [urls, setUrls] = useState([]);
    const itemNameRef = useRef();
    const descriptionRef = useRef();
    const [progress, setProgress] = useState(0);
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false)


    const handleChange = (e) => {
        for (let i = 0; i < e.target.files.length; i++) {
            const newImage = e.target.files[i];
            newImage["id"] = Math.random();
            setImages((prevState) => [...prevState, newImage]);
        }
    };

    const handleUploadImage = (e) => {
        const promises = [];
        setUrls([])
        images.map((image) => {
            const storageRef = ref(storage, `images/${image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, image, { contentType: 'image/jpeg' })
            promises.push(uploadTask);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    console.log(error);
                },
                () => {

                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((urls) => {
                            console.log('File available at', urls);

                            setUrls((prevState) => [...prevState, urls]);
                        });
                }
            );
        })

        Promise.all(promises)
            .then(() => alert("All images uploaded"))
            .catch((err) => console.log(err));
    }

    console.log("images: ", images);
    console.log("urls", urls);

    const handleCreatePost = async (e) => {
        e.preventDefault()
        let newPost = {
            creator: currentUser.displayName,
            item_name: itemNameRef.current.value,
            description: descriptionRef.current.value,
            imageUrls: urls
        }

        let res = await addPost(newPost)
        alert("Your item is posted successfully")
    }


    return (
        <div className='border d-flex '>
            {/* <h4 className='text-center my-2 p-2'>List your lost item on our website</h4> */}

            <Card className="mx-auto shadow-sm border" style={{ maxWidth: "600px" }}>
                <Card.Body>
                    <Form >
                        <Form.Group id='image' >
                            <Form.Label>Photos of your Item</Form.Label>
                            <Form.Control type='file' multiple onChange={(e) => handleChange(e)}></Form.Control>
                        </Form.Group>
                        <Button className="mt-3" onClick={handleUploadImage}>Upload</Button>
                    </Form>
                    {!!urls && urls.map(url => {
                        return (
                            <Image src={url} style={{ height: "100px" }}></Image>
                        )
                    })}
                </Card.Body>
            </Card>

            <Card className="mx-auto shadow-sm border" style={{ maxWidth: "600px" }}>
                <Card.Body>
                    <Form onSubmit={handleCreatePost}>
                        <Form.Group id='item_name' >
                            <Form.Label>Name of your item</Form.Label>
                            <Form.Control type='text' placeholder='E.g. Brand ABC pencil' ref={itemNameRef}></Form.Control>
                        </Form.Group>
                        <Form.Group id='item_description' >
                            <Form.Label>Description</Form.Label>
                            <Form.Control as='textarea' placeholder="E.g. Where did you lose the item?" ref={descriptionRef} style={{ reSize: "none" }} ></Form.Control>
                        </Form.Group>
                        <Button type="submit" disabled={loading} className='w-100 mt-4 cursor-pointer'>Post</Button>

                    </Form>

                </Card.Body>
            </Card>
        </div>
    )
}

export default PostForm
