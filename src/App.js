import './style/style.css';
import { Container } from 'react-bootstrap';
import { AuthProvider } from "./context/AuthContext"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
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
import Profile from './components/Profile';
import Logout from './components/Logout';
import PageNotFound from './components/PageNotFound';
import CustomToast from './components/CustomToast';
import Support from './components/Support'

function App() {

  return (
    <div className="App">
      <div className='w-100' style={{ backgroundColor: "#f6f6f6", "overflow": "hidden" }}>
        <Router>
          <AuthProvider>
            <Header />
            <Container  >
              {/* <CustomToast /> */}
              <Routes>
                <Route exact path="/" element={<Home />} />
                {/* <Route path="/signup" element={<SignUp />} /> */}
                <Route exact path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/post/:pid" element={<Post />} />
                <Route path="/your-listing" element={<OwnListing />} />
                <Route path="/post-form" element={<PostForm />} />
                <Route path="/edit-form/:pid" element={<EditForm />} />
                <Route path="/chatroom" element={<Chatroom />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/support-us" element={<Support />} />
                <Route path="*" element={<PageNotFound />} />

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
