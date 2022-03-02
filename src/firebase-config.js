import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";


const app = initializeApp({
    apiKey: "AIzaSyDYduFQd6bwFg4Ocv1fa6bm8eeKWDzwYss",
    authDomain: "project-cae7c.firebaseapp.com",
    projectId: "project-cae7c",
    databaseURL: "gs://project-cae7c.appspot.com/",
    storageBucket: "project-cae7c.appspot.com",
    messagingSenderId: "782972508890",
    appId: "1:782972508890:web:0c9046590357c7a54d23e3",
    measurementId: "G-7K8EF6DN6L"
})

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;