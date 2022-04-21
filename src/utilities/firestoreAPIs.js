import {
  collection,
  doc,
  addDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  documentId,
} from "firebase/firestore";
import { getToken, onMessage } from "firebase/messaging";
import { db, messaging } from "../firebase-config";

export const getCurrentToken = async (setTokenFound) => {
  return getToken(messaging, { vapidKey: "GENERATED_MESSAGING_KEY" })
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
        setTokenFound(true);
      } else {
        setTokenFound(false);

        console.log("No registration token available. Request permission to generate one.");
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // catch error while creating client token
    });
};

export const getPosts = async (filters = {}, isGettingLostItem = true) => {
  let q1 = query(collection(db, "posts"), orderBy("createdAt", filters.sortBy));

  // console.log(filters)

  if (filters.category !== "All" && filters.status === "All" && filters.district === "All") {
    q1 = query(
      collection(db, "posts"),
      where("category", "==", filters.category),
      orderBy("createdAt", filters.sortBy)
    );
  } else if (filters.category === "All" && filters.status !== "All" && filters.district === "All") {
    q1 = query(collection(db, "posts"), where("status", "==", filters.status), orderBy("createdAt", filters.sortBy));
  } else if (filters.category !== "All" && filters.status !== "All" && filters.district === "All") {
    q1 = query(
      collection(db, "posts"),
      where("category", "==", filters.category),
      where("status", "==", filters.status),
      orderBy("createdAt", filters.sortBy)
    );
  } else if (filters.category !== "All" && filters.status === "All" && filters.district !== "All") {
    q1 = query(
      collection(db, "posts"),
      where("category", "==", filters.category),
      where("district", "==", filters.district),
      orderBy("createdAt", filters.sortBy)
    );
  } else if (filters.category === "All" && filters.status !== "All" && filters.district !== "All") {
    q1 = query(
      collection(db, "posts"),
      where("status", "==", filters.status),
      where("district", "==", filters.district),
      orderBy("createdAt", filters.sortBy)
    );
  } else if (filters.category !== "All" && filters.status !== "All" && filters.district !== "All") {
    q1 = query(
      collection(db, "posts"),
      where("category", "==", filters.category),
      where("status", "==", filters.status),
      where("district", "==", filters.district),
      orderBy("createdAt", filters.sortBy)
    );
  } else if (filters.category === "All" && filters.status === "All" && filters.district !== "All") {
    q1 = query(
      collection(db, "posts"),
      where("district", "==", filters.district),
      orderBy("createdAt", filters.sortBy)
    );
  }

  const res = await getDocs(q1);
  console.log(res.docs);
  const totalDocs = res.size;
  let data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id, totalDocs: totalDocs }));
  if (!isGettingLostItem) {
    data = data.filter((d) => !d.isLostItem);
  } else {
    data = data.filter((d) => d.isLostItem);
  }

  data = data.map((d) => ({ ...d, totalDocs: data.length }));
  return data;
};

export const getUserPosts = async (email) => {
  try {
    let q = query(collection(db, "posts"), where("creatorEmail", "==", email));

    const res = await getDocs(q);
    let data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return data;
  } catch (err) {
    console.error("Error getting document: ", err);
  }
};

export const getOnePost = async (postId) => {
  try {
    let q = query(collection(db, "posts"), where(documentId(), "==", postId));

    const res = await getDocs(q);
    let data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    return data[0];
  } catch (err) {
    console.error("Error getting document: ", err);
  }
};

export const uploadImages = async (files) => {
  if (!files) return;
};

export const addPost = async (newPost = {}) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      createdAt: new Date().getTime(),
      // status can be ["found", "not_found"]
      status: "not_found",
      ...newPost,
    });

    return docRef;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const updatePost = async (postId, updatedPost) => {
  try {
    // console.log(updatedPost)
    await setDoc(doc(db, "posts", postId), updatedPost, { merge: true });
  } catch (err) {
    console.error("Error updating document: ", err);
  }
};

export const deletePost = async (postId) => {
  try {
    const res = await deleteDoc(doc(db, "posts", postId));
  } catch (err) {
    console.error("Error deleting document: ", err);
  }
};

export const getChatrooms = async (userDoc) => {
  try {
    if (!!userDoc) {
      let q = query(collection(db, "users"), where("email", "==", userDoc.email));
      const user = await getDocs(q);
      if (user.docs.length === 0) {
        await createUser(userDoc);
      }

      const res = await getDocs(q);
      let data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      let returnData = [];

      if (data[0].chatroomIds.length !== 0) {
        let q2 = query(collection(db, "chatrooms"), where(documentId(), "in", data[0].chatroomIds));
        const res = await getDocs(q2);
        returnData = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      }

      return returnData;
    }
  } catch (err) {
    console.log(err);
  }
};

export const getOneChatroom = async (chatroomId) => {
  try {
    let q = query(collection(db, "chatrooms"), where(documentId, "==", chatroomId));

    const res = await getDocs(q);
    let data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    return data[0];
  } catch (err) {
    console.log(err);
  }
};

export const createUser = async (userDoc) => {
  try {
    if (!!userDoc) {
      let { displayName, photoURL, email } = userDoc;

      let q = query(collection(db, "users"), where("email", "==", email));

      let userDoc2 = await getDocs(q);
      let data = userDoc2.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      let docRef;
      if (data.length === 0) {
        docRef = await addDoc(collection(db, "users"), {
          displayName,
          photoURL,
          email,
          chatroomIds: [],
          uid: email.split("@")[0],
          joinedAt: new Date().getTime(),
        });
      }
      return docRef;
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const createChatroom = async (postId, userDoc) => {
  try {
    let post = await getOnePost(postId);

    let q = query(
      collection(db, "chatrooms"),
      where("postCreatorEmail", "==", post.creatorEmail),
      where("postViewerEmail", "==", userDoc.email),
      where("postId", "==", postId)
    );

    let chatroomDoc = await getDocs(q);
    let data = chatroomDoc.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    // if there is no existing chat between creator and viewer for a specific post, create one
    if (data.length === 0) {
      const docRef = await addDoc(collection(db, "chatrooms"), {
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        postId: postId,
        postTitle: post.itemName,
        postThumb: post.imageUrls[0],
        postCreatorEmail: post.creatorEmail,
        postCreator: post.creator,
        postCreatorPhoto: post.creatorPhoto,
        postViewer: userDoc.displayName,
        postViewerEmail: userDoc.email,
        postViewPhoto: userDoc.photoURL,
        messages: [],
      });
      // console.log("created chatroom with doc ID: ", docRef.id);
      await updateUserChatroomIds(post.creatorEmail, userDoc.email, docRef.id);
    }

    return;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const updateUserChatroomIds = async (creatorEmail, viewerEmail, chatroomId) => {
  try {
    let q = query(collection(db, "users"), where("email", "==", creatorEmail));
    let userDoc = await getDocs(q);
    let data = userDoc.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    await setDoc(doc(db, "users", data[0].id), { chatroomIds: [...data[0].chatroomIds, chatroomId] }, { merge: true });

    let q2 = query(collection(db, "users"), where("email", "==", viewerEmail));
    let userDoc2 = await getDocs(q2);
    let data2 = userDoc2.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    await setDoc(
      doc(db, "users", data2[0].id),
      { chatroomIds: [...data2[0].chatroomIds, chatroomId] },
      { merge: true }
    );

    return;
  } catch (err) {
    console.log(err);
  }
};

export const updateChatMessage = async (chatroomId, message) => {
  try {
    let q = query(collection(db, "chatrooms"), where(documentId(), "==", chatroomId));
    let chatroomDoc = await getDocs(q);
    let data = chatroomDoc.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    await setDoc(
      doc(db, "chatrooms", chatroomId),
      { messages: [...data[0].messages, message], updatedAt: new Date().getTime() },
      { merge: true }
    );
    return;
  } catch (err) {
    console.log(err);
  }
};

export const getOneUserProfile = async (uid) => {
  try {
    let q = query(collection(db, "users"), where("uid", "==", uid));

    const res = await getDocs(q);
    let data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    return data[0];
  } catch (err) {
    console.log(err);
  }
};
