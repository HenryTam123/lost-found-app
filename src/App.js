import './style/style.css';
import { useState, useEffect } from 'react';
import { db } from './firebase-config';
// import { collection, getDocs, addDoc } from 'firebase/firestore'
import { Container, Navbar } from 'react-bootstrap';
import { AuthProvider } from "./context/AuthContext"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SignUp from './components/SignUp'
import Login from './components/Login'
import Header from './components/Header';
import Home from './components/Home'
import Footer from './components/Footer';
import Posts from './components/Posts';
import PostForm from './components/PostForm';

function App() {
  const [users, setUsers] = useState([]);
  // const usersCollectionRef = collection(db, 'users');

  useEffect(() => {
    // const getUsers = async () => {
    //   const data = await getDocs(usersCollectionRef);
    //   setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    // }

    // getUsers();
  }, [])

  return (
    <div className="App">
      <div className='w-100'>
        <Router>
          <AuthProvider>
            <Header />
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "90vh" }}>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/post-form" element={<PostForm />} />
              </Routes>
            </Container >
            <Footer />
          </AuthProvider>
        </Router>
      </div>
    </div>
  );
}

export default App;
