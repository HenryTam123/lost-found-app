import React, { useState, useEffect } from 'react'
import { getOnePost } from '../utilities/firestoreAPIs.js';
import { Form, Button, Card, Image, Container, Alert, Spinner } from 'react-bootstrap'
import { storage } from '../firebase-config'
import { useAuth } from "../context/AuthContext"
import { updatePost } from '../utilities/firestoreAPIs'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom"
import { addPost } from '../utilities/firestoreAPIs'
import OriginalForm from './OriginalForm'

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
    const [lostPlace, setLostPlace] = useState('')
    const [lostTime, setLostTime] = useState('')
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());

    const location = useLocation();
    const navigate = useNavigate();
    let times = ["12:00 AM", "0:30 AM", "1:00 AM", "1:30 AM", "2:00 AM", "2:30 AM", "3:00 AM", "3:30 AM", "4:00 AM", "4:30 AM", "5:00 AM", "5:30 AM", "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:00 AM",
        "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"]
    let categories = ['Accessory', 'Bag', 'Book & Stationery', 'Certificate', 'Clothes', 'Electronic Product', 'People', 'Pet', 'Valuables', 'Others']

    useEffect(() => {
        handleUploadImage();
    }, [images])

    useEffect(async () => {
        const fetchData = async () => {
            setIsLoading(true)
            let postId = location.pathname.split("/").pop();
            const data = await getOnePost(postId);
            setCurrentPost(data)

            renderData(data)
            setIsLoading(false)
        }
        fetchData()
    }, [])

    const renderData = (post) => {
        setItemName(post.itemName);
        setEmail(post.contact.email);
        setPhone(post.contact.phone);
        setDescription(post.description);
        setCateogrySelected(post.category);
        setStatusSelected(post.status);
        setLostPlace(post.lostPlace);
        setLostTime(post.lostTime);
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
            lostPlace: lostPlace,
            lostTime, lostTime,
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

    const handleCreatePost = async (e) => {
        e.preventDefault()
        let newPost = {
            creator: currentUser.displayName,
            creatorEmail: currentUser.email,
            creatorPhoto: currentUser.photoURL,
            itemName: itemName,
            description: description,
            lostPlace: lostPlace,
            lostTime: lostTime,
            imageUrls: urls,
            contact: {
                email: email || null,
                phone: phone || null
            },
            category: categorySelected,
            lost_date: date,
            reward: reward || 0
        }

        let res = await addPost(newPost)
        alert("Your item is posted successfully")
        navigate('/posts')
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


                        {!!currentUser && currentUser.email === currentPost.creatorEmail ?
                            <OriginalForm isUpdateMode={true} /> : <div style={{ minHeight: "70vh" }}>
                                <Alert variant='danger'>Unauthorized</Alert>
                            </div>}</>}


            </Container>
        </div>


    )
}

export default EditForm
