import React, { useEffect, useState } from "react";
import { getOneUserProfile, getUserPosts } from "../utilities/firestoreAPIs.js";
import { Form, Card, Button, Badge, Container, Row, Col, Carousel, Spinner } from "react-bootstrap";
import Moment from "react-moment";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "./PostCard";

const Profile = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let uid = location.pathname.split("/").pop();
      const userProfile = await getOneUserProfile(uid);
      setCurrentUserProfile(userProfile);

      if (!!userProfile) {
        const userPosts = await getUserPosts(userProfile.email);
        setPosts(userPosts);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div style={{ paddingTop: "75px" }}>
      <Container>
        <h4 className=" py-2 custom-label">User Profile</h4>
      </Container>
      <Container style={{ marginTop: "10vh" }} className="container d-flex flex-wrap my-3 justify-content-center mx-0">
        {isLoading ? (
          <div className="d-flex justify-content-center p-0" style={{ minHeight: "70vh" }}>
            <Spinner animation="border" className="my-auto" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            {!!currentUserProfile ? (
              <>
                <Col
                  className="shadow mx-2 my-2 p-3 d-flex flex-column text-center align-items-center h-50"
                  lg={3}
                  md={4}
                  sm={12}
                  xs={12}
                  style={{ backgroundColor: "white" }}
                >
                  <Card.Text>
                    <span style={{ marginLeft: "8px" }} className="custom-text-underline-hover">
                      <img className="custom-personal-profile-icon" src={currentUserProfile.photoURL} alt="icon" />
                    </span>
                  </Card.Text>
                  <Card.Title style={{ fontSize: "30px" }}>{currentUserProfile.displayName}</Card.Title>
                  <Card.Text>
                    @{currentUserProfile.email.split("@")[0]}
                    <br />
                    Joined At <Moment format="LL">{currentUserProfile.joinedAt}</Moment>
                  </Card.Text>
                </Col>
                <Col
                  className="shadow my-2 mx-2"
                  lg={8}
                  md={7}
                  sm={12}
                  xs={12}
                  style={{ backgroundColor: "white", minHeight: "80vh" }}
                >
                  <Card.Title className="px-3 pt-3">Listings</Card.Title>{" "}
                  <Row className="" style={{ padding: "5px" }}>
                    {posts.length !== 0 ? (
                      posts.map((post, i) => {
                        return <PostCard post={post} isProfileMode={true} />;
                      })
                    ) : (
                      <Card.Text style={{ minHeight: "80vh" }} className="text-center">
                        This User do not have any listing yet
                      </Card.Text>
                    )}
                  </Row>
                </Col>
              </>
            ) : (
              <div style={{ minHeight: "70vh" }}>User Profile does not exist</div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Profile;
