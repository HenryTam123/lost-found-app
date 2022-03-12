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
    const [timeSelected, setTimeSelected] = useState("12:00 AM")

    const itemNameRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    const rewardRef = useRef();
    const lostPlaceRef = useRef();
    const descriptionRef = useRef();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(null);
    const navigate = useNavigate();


    let times = ["12:00 AM", "0:30 AM", "1:00 AM", "1:30 AM", "2:00 AM", "2:30 AM", "3:00 AM", "3:30 AM", "4:00 AM", "4:30 AM", "5:00 AM", "5:30 AM", "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:00 AM",
        "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"]
    let categories = ['Accessory', 'Bag', 'Book & Stationery', 'Certificate', 'Clothes', 'Electronic Product', 'People', 'Pet', 'Valuables', 'Others']

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
                    switch (snapshot.state) {
                        case 'paused':
                            break;
                        case 'running':
                            break;
                    }
                },
                (error) => {
                    console.log(error);
                },
                () => {

                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((urls) => {
                            setUrls((prevState) => [...prevState, urls]);
                        });
                }
            );
        })

        Promise.all(promises)
            .then(() => console.log("All images uploaded"))
            .catch((err) => console.log(err));
    }


    const handleCreatePost = async (e) => {
        e.preventDefault()
        let newPost = {
            creator: currentUser.displayName,
            creatorEmail: currentUser.email,
            creatorPhoto: currentUser.photoURL,
            itemName: itemNameRef.current.value,
            description: descriptionRef.current.value.replace(/\n/g, "<br>"),
            lostPlace: lostPlaceRef.current.value,
            lostTime: time,
            imageUrls: urls,
            contact: {
                email: !!emailRef.current ? emailRef.current.value : null,
                phone: !!phoneRef.current ? phoneRef.current.value : null
            },
            category: categorySelected,
            lost_date: date,
            reward: !!rewardRef.current ? rewardRef.current.value : null
        }

        let res = await addPost(newPost)
        alert("Your item is posted successfully")
        navigate('/posts')
    }


    return (
        <div style={{ paddingTop: "75px" }}>
            <h4 className='py-3 custom-label' >List your lost item on our website</h4>
            {!!currentUser ? <div className='d-flex flex-wrap mb-4'>

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
                        <Form onSubmit={handleCreatePost}>
                            <Form.Group id='item_name' className='mb-3' >
                                <Form.Label>Name of your item <span className="text-muted">&#40;required&#41;</span></Form.Label>
                                <Form.Control type='text' placeholder='E.g. Brand ABC pencil' ref={itemNameRef} required></Form.Control>
                            </Form.Group>
                            <Form.Group id='item_description' className='mb-3' >
                                <Form.Label>Description <span className="text-muted">&#40;optional&#41;</span></Form.Label>
                                <Form.Control as='textarea' placeholder="E.g. features of the item?" ref={descriptionRef} style={{ reSize: "none" }} ></Form.Control>
                            </Form.Group>
                            <Form.Group id='item_lost_place' className='mb-3' >
                                <Form.Label>Where did you lose the item?  <span className="text-muted">&#40;required&#41;</span></Form.Label>
                                <Form.Control type='text' placeholder="E.g. TKO Mtr Station" required ref={lostPlaceRef} ></Form.Control>
                            </Form.Group>
                            <Form.Label>When did you lose your item?</Form.Label>

                            <Form.Group id='item_lost_date' className='mb-1' >
                                <Form.Label>Date<span className="text-muted"> &#40;required&#41;</span></Form.Label>

                                <DatePicker className="form-control" required selected={date} onChange={(date) => setDate(date)} />
                            </Form.Group>
                            <Form.Group id='item_lost_time' className='mb-3'>
                                <Form.Label>Time<span className="text-muted"> &#40;required&#41;</span></Form.Label>
                                <Form.Select aria-label="Default select example" value={timeSelected} onChange={e => setTimeSelected(e.target.value)}>
                                    <option disabled>Select Time here</option>

                                    {times.map((time, i) => {
                                        return (
                                            <option key={i}>{time}</option>

                                        )
                                    })}

                                </Form.Select>
                            </Form.Group>

                            <Form.Group id='contact' className='mb-3' >
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


                            <Form.Group id='item_category' className='mb-3'>
                                <Form.Label>Category <span className="text-muted">&#40;required&#41;</span></Form.Label>
                                <Form.Select aria-label="Default select example" value={categorySelected} onChange={e => setCateogrySelected(e.target.value)}>
                                    <option disabled>Select category here</option>

                                    {categories.map((category, i) => {
                                        return (
                                            <option key={i}>{category}</option>

                                        )
                                    })}

                                </Form.Select>
                            </Form.Group>
                            <Form.Group id='item_reward' className='mb-3'>
                                <Form.Label>Reward<span className="text-muted"> &#40;required&#41;</span></Form.Label>
                                <div className="d-flex">
                                    <Form.Control type="text" style={{ marginRight: "5px", width: "60px" }} value={"HKD"} disabled></Form.Control>
                                    <Form.Control type='text' placeholder='0' ref={rewardRef} required></Form.Control>
                                </div>
                            </Form.Group>
                            <Button type="submit" disabled={loading} className='w-100 mt-4 cursor-pointer'>Post</Button>

                        </Form>

                    </Card.Body>
                </Card>
            </div> : <Button onClick={navigate('/login')}>Login</Button>
            }

        </div >

    )
}

export default PostForm
