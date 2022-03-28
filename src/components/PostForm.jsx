import React, { useState, useRef, useEffect } from 'react'
import { Form, Button, Card, Image } from 'react-bootstrap'
import { storage } from '../firebase-config'
import { useAuth } from "../context/AuthContext"
import { addPost } from '../utilities/firestoreAPIs'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom"
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import OriginalForm from './OriginalForm'


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

    const render = (status) => {
        return <h1>{status}</h1>;
    };

    return (
        <div style={{ paddingTop: "75px" }}>
            <h4 className='py-3 custom-label' >List your lost item on our website</h4>
            {!!currentUser ?

                <OriginalForm isUpdateMode={false} /> : <Button onClick={navigate('/login')}>Login</Button>
            }

        </div >

    )
}

export default PostForm
