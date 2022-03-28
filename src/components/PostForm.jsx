import React from 'react'
import { Button } from 'react-bootstrap'
import { useAuth } from "../context/AuthContext"
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom"
import OriginalForm from './OriginalForm'


const PostForm = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
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
