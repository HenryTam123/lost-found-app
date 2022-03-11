import {
    collection, doc, addDoc, getDocs, setDoc, deleteDoc, query,
    where, orderBy, documentId
} from "firebase/firestore";
import { db } from '../firebase-config';

export const getPosts = async (filters = {}) => {

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

        return data[0]

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

export const getChatrooms = async (userDoc) => {
    try {

        if (!!userDoc) {
            let q = query(collection(db, "users"), where("email", "==", userDoc.email))
            const user = await getDocs(q);
            if (user.docs.length === 0) {
                await createUser(userDoc)
            }

            const res = await getDocs(q);
            let data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

            let returnData = []

            if (data[0].chatroomIds.length !== 0) {
                let q2 = query(collection(db, "chatrooms"), where(documentId(), "in", data[0].chatroomIds))
                const res = await getDocs(q2);
                returnData = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            }

            console.log(returnData)

            return returnData
        }

    } catch (err) {
        console.log(err)
    }
}

export const getOneChatroom = async (chatroomId) => {
    try {

        let q = query(collection(db, "chatrooms"), where(documentId, "==", chatroomId))

        const res = await getDocs(q);
        let data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log(data[0])

        return data[0]
    } catch (err) {
        console.log(err)
    }
}

export const createUser = async (userDoc) => {
    try {
        if (!!userDoc) {
            let { displayName, photoURL, email } = userDoc

            let q = query(collection(db, "users"), where("email", "==", email));

            let userDoc2 = await getDocs(q);
            let data = userDoc2.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

            console.log(data)
            let docRef
            if (data.length === 0) {
                docRef = await addDoc(collection(db, "users"), {
                    displayName,
                    photoURL,
                    email,
                    chatroomIds: [],
                    uid: email.split("@")[0],
                    joinedAt: new Date().getTime()
                });
                console.log("created userDoc with doc ID: ", docRef.id);

            }
            return docRef
        }

    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const createChatroom = async (postId, userDoc) => {
    try {
        let post = await getOnePost(postId);

        let q = query(collection(db, "chatrooms"),
            where("postCreatorEmail", "==", post.creatorEmail),
            where("postViewerEmail", "==", userDoc.email),
            where("postId", "==", postId))

        let chatroomDoc = await getDocs(q);
        let data = chatroomDoc.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        console.log(data)

        // if there is no existing chat between creator and viewer for a specific post, create one
        if (data.length === 0) {
            const docRef = await addDoc(collection(db, "chatrooms"), {
                createdAt: new Date().getTime(),
                postId: postId,
                postCreatorEmail: post.creatorEmail,
                postTitle: post.itemName,
                postCreator: post.creator,
                postThumb: post.imageUrls[0],
                postCreatorPhoto: post.creatorPhoto,
                postViewerEmail: userDoc.email,
                messages: []
            });
            console.log("created chatroom with doc ID: ", docRef.id);
            await updateUserChatroomIds(post.creatorEmail, userDoc.email, docRef.id)
        }

        return
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const updateUserChatroomIds = async (creatorEmail, viewerEmail, chatroomId) => {
    try {
        let q = query(collection(db, "users"), where("email", "==", creatorEmail))
        let userDoc = await getDocs(q);
        let data = userDoc.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        console.log(data)

        await setDoc(doc(db, "users", data[0].id), { chatroomIds: [...data[0].chatroomIds, chatroomId] }, { merge: true });

        let q2 = query(collection(db, "users"), where("email", "==", viewerEmail))
        let userDoc2 = await getDocs(q2);
        let data2 = userDoc2.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log(data2)


        await setDoc(doc(db, "users", data2[0].id), { chatroomIds: [...data2[0].chatroomIds, chatroomId] }, { merge: true });

        return

    } catch (err) {
        console.log(err)
    }
}

export const updateChatMessage = async (chatroomId, message) => {
    try {
        let q = query(collection(db, "chatrooms"), where(documentId(), "==", chatroomId))
        let chatroomDoc = await getDocs(q);
        let data = chatroomDoc.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

        await setDoc(doc(db, "chatrooms", chatroomId), { messages: [...data[0].messages, message], updatedAt: new Date().getTime() }, { merge: true });
        return

    } catch (err) {
        console.log(err)
    }
}

export const getOneUserProfile = async (uid) => {
    try {

        let q = query(collection(db, "users"), where("uid", "==", uid))

        const res = await getDocs(q);
        let data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log(data[0])

        return data[0]
    } catch (err) {
        console.log(err)
    }
}
