import React, { useState, useEffect } from 'react'
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"


const Logout = () => {
    const [error, setError] = useState("")
    const navigate = useNavigate();
    const { logout } = useAuth();


    useEffect(() => {
        const handleLogout = async () => {
            try {
                await logout()
                navigate("/login")
            } catch {
                setError("Failed to log out")
            }
        }
        handleLogout()
    }, [])
    return (
        <div>Logout</div>
    )
}

export default Logout