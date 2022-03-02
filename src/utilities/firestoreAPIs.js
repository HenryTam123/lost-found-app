import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from '../firebase-config';

export const getPosts = async () => {
    const res = await getDocs(collection(db, "posts"));
    let data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return data
}

export const uploadImages = async (files) => {
    if (!files) return;


}

export const addPost = async (newPost = {}) => {
    try {
        console.log(newPost)
        const docRef = await addDoc(collection(db, "posts"), {
            createdAt: new Date().getTime(),
            isFound: false,
            ...newPost,
            //   creator: newPost.creator,
            //   itemName: newPost.itemName,
            //   description: newPost.description,
            //   category: newPost.category,
            //   contact: {
            //       phoneNumber: ,
            //       email:
            //   }
        });
        console.log("Document written with ID: ", docRef.id);

        return docRef
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}