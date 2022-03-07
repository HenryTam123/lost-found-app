import React, { useState, useRef, useEffect } from 'react'
import { Form, Button, Card, Image } from 'react-bootstrap'
import { storage } from '../firebase-config'
import { useAuth } from "../context/AuthContext"
import { addPost } from '../utilities/firestoreAPIs'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom"


const PostForm = () => {

    const [images, setImages] = useState([])
    const [urls, setUrls] = useState([]);
    const [isPhoneSelected, setIsPhoneSelected] = useState(false)
    const [isEmailSelected, setIsEmailSelected] = useState(false)
    const [categorySelected, setCateogrySelected] = useState("Accessory")
    const itemNameRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    const descriptionRef = useRef();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const navigate = useNavigate();



    let categories = ['Accessory', 'Bag', 'Book & Stationery', 'Certificate', 'Clothes', 'Electronic Product', 'Pet', 'Valuables', 'Others']

    useEffect(() => {
        handleUploadImage()
    }, [images])

    const handleChange = (e) => {
        if (e.target.files.length + images.length > 5) {
            alert("You can only choose a maximm of FIVE photos")
            return
        }
        for (let i = 0; i < e.target.files.length; i++) {
            const newImage = e.target.files[i];
            newImage["id"] = Math.random();
            setImages((prevState) => [...prevState, newImage]);
        }
    };

    const handleUploadImage = () => {
        const promises = [];
        setUrls([])
        if (images.length === 0) return;

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
            .then(() => console.log("All images uploaded"))
            .catch((err) => console.log(err));
    }

    console.log("images: ", images);
    console.log("urls", urls);

    const handleCreatePost = async (e) => {
        e.preventDefault()
        let newPost = {
            creator: currentUser.displayName,
            creatorEmail: currentUser.email,
            itemName: itemNameRef.current.value,
            description: descriptionRef.current.value,
            imageUrls: urls,
            contact: {
                email: !!emailRef.current ? emailRef.current.value : null,
                phone: !!phoneRef.current ? phoneRef.current.value : null
            },
            category: categorySelected,
            lost_date: date,
        }

        let res = await addPost(newPost)
        alert("Your item is posted successfully")
        navigate('/posts')
    }


    return (
        <>
            <h4 className='my-4 py-2 custom-label'>List your lost item on our website</h4>
            {!!currentUser ? <div className='d-flex flex-wrap mb-4'>

                <Card className=" shadow-sm border m-2" >
                    <Card.Body>
                        <Form className='mb-2'>
                            <Form.Group id='image' >
                                <Form.Label>Photos of your Item <span className="text-muted">&#40;up to 5 photos&#41;</span></Form.Label>
                                <Form.Control type='file' multiple onChange={(e) => handleChange(e)}></Form.Control>
                            </Form.Group>
                        </Form>
                        {!!urls && urls.map(url => {
                            return (
                                <Image className="m-1" src={url} style={{ height: "100px" }}></Image>
                            )
                        })}
                    </Card.Body>
                </Card>

                <Card className=" shadow-sm border w-100 m-2" style={{ flex: "1", minWidth: "200px" }}>
                    <Card.Body>
                        <Form onSubmit={handleCreatePost}>
                            <Form.Group id='item_name' className='mb-2' >
                                <Form.Label>Name of your item <span className="text-muted">&#40;required&#41;</span></Form.Label>
                                <Form.Control type='text' placeholder='E.g. Brand ABC pencil' ref={itemNameRef} required></Form.Control>
                            </Form.Group>
                            <Form.Group id='item_description' className='mb-2' >
                                <Form.Label>Description <span className="text-muted">&#40;required&#41;</span></Form.Label>
                                <Form.Control as='textarea' placeholder="E.g. Where did you lose the item?" required ref={descriptionRef} style={{ reSize: "none" }} ></Form.Control>
                            </Form.Group>
                            <Form.Group id='contact' className='mb-2' >
                                <Form.Label>Contact Method <span className="text-muted">&#40;required&#41;</span></Form.Label>
                                <Form.Check type={'checkbox'} required >
                                    <Form.Check.Input checked={isPhoneSelected} type={'checkbox'} isValid onChange={(e) => setIsPhoneSelected(e.target.checked)} />
                                    <Form.Check.Label>{`Phone number`}</Form.Check.Label>
                                    {isPhoneSelected &&
                                        <Form.Control type='text' placeholder='E.g. 9876 5432' ref={phoneRef} ></Form.Control>
                                    }

                                </Form.Check>
                                <Form.Check type={'checkbox'} >
                                    <Form.Check.Input checked={isEmailSelected} type={'checkbox'} isValid onChange={(e) => setIsEmailSelected(e.target.checked)} />
                                    <Form.Check.Label>{`Email`}</Form.Check.Label>
                                    {isEmailSelected &&
                                        <Form.Control type='email' placeholder='E.g. jason123@gmail.com' ref={emailRef} ></Form.Control>}
                                </Form.Check>

                            </Form.Group>
                            <Form.Group id='item_description' className='mb-2' >
                                <Form.Label>When did you lose your item?<span className="text-muted"> &#40;required&#41;</span></Form.Label>
                                <DatePicker className="form-control" required selected={date} onChange={(date) => setDate(date)} />
                            </Form.Group>

                            <Form.Group id='item_category' className='mb-2'>
                                <Form.Label>Category <span className="text-muted">&#40;optional&#41;</span></Form.Label>
                                <Form.Select aria-label="Default select example" value={categorySelected} onChange={e => setCateogrySelected(e.target.value)}>
                                    <option disabled>Select category here</option>

                                    {categories.map((category, i) => {
                                        return (
                                            <option key={i}>{category}</option>

                                        )
                                    })}

                                </Form.Select>
                            </Form.Group>
                            <Button type="submit" disabled={loading} className='w-100 mt-4 cursor-pointer'>Post</Button>

                        </Form>

                    </Card.Body>
                </Card>
            </div> : <Button onClick={navigate('/login')}>Login</Button>}

        </>

    )
}

export default PostForm
