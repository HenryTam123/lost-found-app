import React, { useState, useRef, useEffect } from 'react'
import { getOnePost } from '../utilities/firestoreAPIs.js';
import { Form, Button, Card, Image, Container, Alert, Spinner } from 'react-bootstrap'
import { storage } from '../firebase-config'
import { useAuth } from "../context/AuthContext"
import { updatePost } from '../utilities/firestoreAPIs'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom"


const EditForm = () => {
    const [currentPost, setCurrentPost] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [urls, setUrls] = useState([]);
    const [isPhoneSelected, setIsPhoneSelected] = useState(false);
    const [isEmailSelected, setIsEmailSelected] = useState(false);
    const [categorySelected, setCateogrySelected] = useState("Accessory");
    const [statusSelected, setStatusSelected] = useState(null);
    const [reward, setReward] = useState(0)
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [itemName, setItemName] = useState('')
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());

    const location = useLocation();
    const navigate = useNavigate();
    let categories = ['Accessory', 'Bag', 'Book & Stationery', 'Certificate', 'Clothes', 'Electronic Product', 'Pet', 'Valuables', 'Others']
    let status = ['Found', 'Not Found Yet']

    useEffect(() => {
        handleUploadImage();
    }, [images])

    useEffect(async () => {
        setIsLoading(true)
        let postId = location.pathname.split("/").pop();
        const data = await getOnePost(postId);
        setCurrentPost(data)

        renderData(data)
        setIsLoading(false)

    }, [])

    const renderData = (post) => {
        console.log(post)

        setItemName(post.itemName);
        setEmail(post.contact.email);
        setPhone(post.contact.phone);
        setDescription(post.description);
        setCateogrySelected(post.category);
        setStatusSelected(post.status);
        setReward(post.reward || 0)
        setDate(new Date(post.lost_date.seconds * 1000));
        if (!!post.contact.phone) setIsPhoneSelected(true);
        if (!!post.contact.email) setIsEmailSelected(true);

        setUrls(post.imageUrls);
    }


    const handleChange = (e) => {
        if (e.target.files.length + urls.length > 5) {
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

    const handleUpdatePost = async (e) => {
        e.preventDefault()
        let newPost = {
            creator: currentUser.displayName,
            creatorEmail: currentUser.email,
            itemName: itemName,
            description: description,
            imageUrls: urls,
            contact: {
                email: email,
                phone: phone
            },
            status: statusSelected,
            category: categorySelected,
            lost_date: date,
            updatedAt: new Date().getTime(),
            reward: reward
        }

        let res = await updatePost(currentPost.id, newPost)
        alert("Your item is updated successfully")
        navigate('/your-listing')
    }

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


                        {!!currentUser && currentUser.email === currentPost.creatorEmail ? <div className='d-flex flex-wrap'>

                            <Card className=" shadow border m-2" >
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

                            <Card className=" shadow border w-100 m-2" style={{ flex: "1", minWidth: "200px" }}>
                                <Card.Body>
                                    <Form onSubmit={handleUpdatePost}>
                                        <Form.Group id='item_name' className='mb-2' >
                                            <Form.Label>Name of your item <span className="text-muted">&#40;required&#41;</span></Form.Label>
                                            <Form.Control type='text' placeholder='E.g. Brand ABC pencil' value={itemName} onChange={(e) => setItemName(e.target.value)} required></Form.Control>
                                        </Form.Group>
                                        <Form.Group id='item_description' className='mb-2' >
                                            <Form.Label>Description <span className="text-muted">&#40;required&#41;</span></Form.Label>
                                            <Form.Control as='textarea' placeholder="E.g. Where did you lose the item?" required value={description} onChange={(e) => setDescription(e.target.value)} style={{ reSize: "none" }} ></Form.Control>
                                        </Form.Group>
                                        <Form.Group id='contact' className='mb-2' >
                                            <Form.Label>Contact Method <span className="text-muted">&#40;required&#41;</span></Form.Label>
                                            <Form.Check type={'checkbox'} required >
                                                <Form.Check.Input checked={isPhoneSelected} type={'checkbox'} isValid onChange={(e) => setIsPhoneSelected(e.target.checked)} />
                                                <Form.Check.Label>{`Phone number`}</Form.Check.Label>
                                                {isPhoneSelected &&
                                                    <Form.Control type='text' placeholder='E.g. 9876 5432' value={phone} onChange={(e) => setPhone(e.target.value)} ></Form.Control>
                                                }

                                            </Form.Check>
                                            <Form.Check type={'checkbox'} >
                                                <Form.Check.Input checked={isEmailSelected} type={'checkbox'} isValid onChange={(e) => setIsEmailSelected(e.target.checked)} />
                                                <Form.Check.Label>{`Email`}</Form.Check.Label>
                                                {isEmailSelected &&
                                                    <Form.Control type='email' placeholder='E.g. jason123@gmail.com' value={email} onChange={(e) => setEmail(e.target.value)} ></Form.Control>}
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
                                        <Form.Group id='item_name' className='mb-2' >
                                            <Form.Label>Reward <span className="text-muted">&#40;required&#41;</span></Form.Label>
                                            <div className="d-flex">
                                                <Form.Control type="text" style={{ marginRight: "5px", width: "60px" }} value={"HKD"} disabled></Form.Control>
                                                <Form.Control type='text' placeholder='0' value={reward} onChange={(e) => setReward(e.target.value)} required></Form.Control>
                                            </div>                                        </Form.Group>
                                        <Form.Group id='item_status' className='mb-2'>
                                            <Form.Label>Status</Form.Label>
                                            <Form.Select aria-label="Default select example" value={statusSelected} onChange={e => setStatusSelected(e.target.value)}>
                                                <option disabled>Select status here</option>
                                                <option value={"not_found"}>Not Found Yet</option>
                                                <option value={"found"}>Found</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Button type="submit" disabled={loading} className='w-100 mt-4 cursor-pointer'>Update</Button>

                                    </Form>

                                </Card.Body>
                            </Card>
                        </div> : <div style={{ minHeight: "70vh" }}>
                            <Alert variant='danger'>Unauthorized</Alert>
                        </div>}</>}


            </Container>
        </div>


    )
}

export default EditForm
