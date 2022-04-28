import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import googleLoginIcon from "../images/google-login-icon.jpg";
import facebookLoginIcon from "../images/facebook-login-icon.jpg";
import { createUser } from "../utilities/firestoreAPIs";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, signInWithGoogle, signInWithFacebook, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!!currentUser) {
      navigate("/items-lost");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/home");
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async (e) => {
    try {
      setError("");
      setLoading(true);
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      setError("Failed to log in");
    }
  };

  const handleFacebookLogin = async (e) => {
    try {
      setError("");
      setLoading(true);
      await signInWithFacebook();
      navigate("/");
    } catch (err) {
      setError("Failed to log in");
    }
  };

  return (
    <div className="w-100 " style={{ minHeight: "90vh", paddingTop: "105px" }}>
      <Card className="mx-auto shadow" style={{ maxWidth: "600px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          <Button
            disabled={loading}
            onClick={handleGoogleLogin}
            variant="light"
            style={{ backgroundColor: "white" }}
            className="w-100 mt-3 p-2 shadow-sm"
          >
            <img src={googleLoginIcon} style={{ height: "30px", marginRight: "10px" }} />
            Sign in with Google
          </Button>
          <Button
            disabled={loading}
            onClick={handleFacebookLogin}
            style={{ backgroundColor: "rgb(59,89,152)" }}
            className="w-100 mt-3 p-2 shadow-sm"
          >
            <img src={facebookLoginIcon} style={{ height: "30px", marginRight: "10px" }} />
            Sign in with Facebook
          </Button>
        </Card.Body>
      </Card>
      {/* <div className="w-100 text-center mt-2 mx-auto" style={{ maxWidth: "600px" }}>
                Need an account? <Link to="/signup">Sign Up</Link>
            </div> */}
    </div>
  );
}
