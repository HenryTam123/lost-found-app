import {
    collection, doc, addDoc, getDoc, getDocs, setDoc, deleteDoc, query,
    where, orderBy, startAt, endAt, FieldPath, documentId, limit
} from "firebase/firestore";
import { db } from '../firebase-config';

export const getPosts = async (filters = {}) => {

    let pageSize = 4;

    let q1 = query(collection(db, "posts"),
        orderBy("createdAt", filters.sortBy),
    );

    if (filters.category !== "All" && filters.status === "All") {
        q1 = query(collection(db, "posts"),
            where('category', "==", filters.category),
            orderBy("createdAt", filters.sortBy)
        )

    }
    else if (filters.category === "All" && filters.status !== "All") {
        q1 = query(collection(db, "posts"),
            where("status", "==", filters.status),
            orderBy("createdAt", filters.sortBy)

        )

    } else if (filters.category !== "All" && filters.status !== "All") {
        q1 = query(collection(db, "posts"),
            where('category', "==", filters.category),
            where("status", "==", filters.status),
            orderBy("createdAt", filters.sortBy)

        )

    }

    const res = await getDocs(q1);
    const totalDocs = res.size;
    let data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id, totalDocs: totalDocs }));
    return data

}

export const getUserPosts = async (email) => {

    try {
        let q = query(collection(db, "posts"), where("creatorEmail", "==", email));

        const res = await getDocs(q);
        let data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        return data
    } catch (err) {
        console.error("Error getting document: ", err);
    }

}

export const getOnePost = async (postId) => {
    try {
        let q = query(collection(db, "posts"), where(documentId(), "==", postId));

        const res = await getDocs(q);
        let data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log(data)

        return data

    } catch (err) {
        console.error("Error getting document: ", err);
    }

}

export const uploadImages = async (files) => {
    if (!files) return;
}

export const addPost = async (newPost = {}) => {
    try {
        console.log(newPost)
        const docRef = await addDoc(collection(db, "posts"), {
            createdAt: new Date().getTime(),
            // status can be ["found", "not_found"]
            status: "not_found",
            ...newPost,
        });
        console.log("Document written with ID: ", docRef.id);

        return docRef
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}


export const updatePost = async (postId, updatedPost) => {
    try {
        console.log(postId)
        await setDoc(doc(db, "posts", postId), updatedPost, { merge: true });

    } catch (err) {
        console.error("Error updating document: ", err);

    }
}

export const deletePost = async (postId) => {
    try {
        const res = await deleteDoc(doc(db, "posts", postId));
        console.log(res)
    } catch (err) {
        console.error("Error deleting document: ", err);

    }

}