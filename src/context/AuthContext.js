// import firebase from "firebase";
import React, { useContext, useState, useEffect, createContext } from "react"
import { auth } from "../firebase-config";
import {
    GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup,
    signOut, createUserWithEmailAndPassword, FacebookAuthProvider
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState({})
    const [loading, setLoading] = useState(true)

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function signInWithGoogle() {
        let googleProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleProvider);

    }

    function signInWithFacebook() {
        let facebookProvider = new FacebookAuthProvider();
        return signInWithPopup(auth, facebookProvider);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth);
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    // function updatePassword(password) {
    //     return currentUser.updatePassword(password)
    // }

    // function updateEmail(email) {
    //     return currentUser.updateEmail(email)
    // }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setCurrentUser(user)
            // await createUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        login,
        signup,
        signInWithGoogle,
        signInWithFacebook,
        logout,
        resetPassword,
        // updateEmail,
        // updatePassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}