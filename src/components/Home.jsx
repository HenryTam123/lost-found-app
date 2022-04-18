import React, { useEffect } from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import landingPicture from "../images/landing.svg";
import mapPicture from "../images/map.jpg";
import chatPicture from "../images/chatroom.jpg";
import listingPicture from "../images/listing.jpg";
import Image from "react-bootstrap/Image";
import { useNavigate } from "react-router-dom";
import { createUser } from "../utilities/firestoreAPIs";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleStart = () => {
    navigate("./posts");
  };

  useEffect(() => {
    const fetchData = async () => {
      await createUser(currentUser);
    };
    fetchData();
  }, []);

  return (
    <>
      <Container style={{ minHeight: "70vh", paddingTop: "55px" }}>
        <Row className="py-5 px-1 mt-4" style={{ margin: "5px" }}>
          <Col xs={12} md={4} lg={4} className="my-auto">
            <div className="h1 mb-4 mt-5">Help Someone Find Their Lost Items</div>
            <Button className="custom-bg-primary btn-lg font-weight-bold" onClick={handleStart}>
              GET STARTED
            </Button>
          </Col>
          <Col xs={12} md={8} lg={8} className="mt-3">
            <Image src={landingPicture} fluid={true} />
          </Col>
        </Row>
        <Row className="py-5 px-1 mt-4" style={{ margin: "5px" }}>
          <div className="text-center h1 mb-4 ">Features of our website</div>
          <Col xs={12} md={6} lg={4}>
            <Card className="text-center p-2 shadow border-radius">
              <Card.Title className="my-2">Lost Item Listing</Card.Title>
              <Card.Text className="mb-3">Listing items on our website is completely free</Card.Text>

              <Card.Img src={listingPicture} />
            </Card>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Card className="text-center p-2 shadow">
              <Card.Title className="my-2">Google Map Integration</Card.Title>
              <Card.Text className="mb-3">View the accurate location where the item is lost</Card.Text>

              <Card.Img src={mapPicture} />
            </Card>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Card className="text-center p-2 shadow">
              <Card.Title className="my-2">Chatroom</Card.Title>
              <Card.Text className="mb-3">Contact people directly through the Inbox function</Card.Text>

              <Card.Img src={chatPicture} />
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
