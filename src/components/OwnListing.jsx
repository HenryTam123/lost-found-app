import React, { useEffect, useState } from "react";
import { getUserPosts } from "../utilities/firestoreAPIs.js";
import { Button, Container, Row, Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PostCard from "./PostCard";

const OwnListing = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(async () => {
    setIsLoading(true);
    const data = await getUserPosts(currentUser.email);
    setPosts(data);
    setIsLoading(false);
  }, []);
  return (
    <div style={{ paddingTop: "75px" }}>
      <Container style={{ marginTop: "30px" }}>
        <h4 className="text-start custom-label py-2">Your Posts</h4>
      </Container>
      {!!currentUser ? (
        <Container className="container d-flex flex-wrap justify-content-center mb-3 ">
          {isLoading ? (
            <div className="d-flex justify-content-center w-100" style={{ minHeight: "70vh" }}>
              <Spinner animation="border" className="my-auto" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              <Row className="w-100">
                {posts.length !== 0 ? (
                  posts.map((post, i) => {
                    return <PostCard post={post} key={i} />;
                  })
                ) : (
                  <div style={{ minHeight: "80vh" }}>You do not have any listing yet</div>
                )}
              </Row>
            </>
          )}
        </Container>
      ) : (
        <Button onClick={navigate("/login")}>Login</Button>
      )}
    </div>
  );
};

export default OwnListing;
