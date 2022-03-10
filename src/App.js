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
import Post from './components/Post'
import Posts from './components/Posts';
import PostForm from './components/PostForm';
import OwnListing from './components/OwnListing';
import EditForm from './components/EditForm';
import Chatroom from './components/Chatroom'

function App() {

  return (
    <div className="App">
      <div className='w-100' style={{ backgroundColor: "#f6f6f6" }}>
        <Router>
          <AuthProvider>
            <Header />
            <Container  >
              <Routes>
                <Route exact path="/" element={<Home />} />
                {/* <Route path="/signup" element={<SignUp />} /> */}
                <Route path="/login" element={<Login />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/post/:pid" element={<Post />} />
                <Route path="/your-listing" element={<OwnListing />} />
                <Route path="/post-form" element={<PostForm />} />
                <Route path="/edit-form/:pid" element={<EditForm />} />
                <Route path="/chatroom" element={<Chatroom />} />
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
