import React, { useState } from "react";
import { deletePost, createChatroom } from "../utilities/firestoreAPIs.js";
import { Card, Badge, Button, Col, Carousel, Modal } from "react-bootstrap";
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";
import MyMap from "./MyMap.jsx";
import markerLogo from "../images/marker.png";

const PostCard = ({ post = {}, isDetailMode = false, currentUser = {}, isProfileMode = false }) => {
  const [show, setShow] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseMap = () => setShowMap(false);
  const handleShowMap = () => setShowMap(true);

  const handleDeletePost = async () => {
    if (window.confirm("Do you really want to delete this post?")) {
      setIsLoading(true);
      await deletePost(post.id);
      setIsLoading(false);
      alert("Your post is deleted Successfully");
      navigate("/posts");
    }
  };

  const handleEditPost = () => {
    navigate(`/edit-form/${post.id}`);
  };

  const handleInbox = async (postId) => {
    await createChatroom(postId, currentUser);

    navigate(`/chatroom`, {
      state: { postId: postId, creatorEmail: post.creatorEmail, viewerEmail: currentUser.email },
    });
  };
  const navigate = useNavigate();
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body closeButton>
          <div className="text-center mb-3">Share this post to your social community</div>
          <div className="d-flex w-100 justify-content-center">
            <WhatsappShareButton url={window.location.href} title={`Help to find ${post.itemName}`} className="mx-2">
              <WhatsappIcon className="custom-social-icon" />
            </WhatsappShareButton>
            <FacebookShareButton
              url={window.location.href}
              quote={`Help to find ${post.itemName}`}
              hashtag={"lostandfound"}
              className="mx-2"
              v
            >
              <FacebookIcon className="custom-social-icon" />
            </FacebookShareButton>
            <TelegramShareButton url={window.location.href} title={`Help to find ${post.itemName}`} className="mx-2">
              <TelegramIcon className="custom-social-icon" />
            </TelegramShareButton>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showMap} onHide={handleCloseMap} size={"lg"}>
        <Modal.Body closeButton>
          <MyMap post={post} isViewOnlyMode={true} />
        </Modal.Body>
      </Modal>

      {isDetailMode ? (
        <Col lg={12}>
          <Card className=" w-100 my-3">
            {post.imageUrls.length > 0 ? (
              <Carousel variant="dark" interval={null}>
                {post.imageUrls.map((url, i) => (
                  <Carousel.Item key={i}>
                    <img
                      className="d-block w-100"
                      style={{ objectFit: "cover", height: "500px" }}
                      src={url}
                      key={i}
                      alt={`slide ${i + 1}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              ""
            )}
            <Card.Body>
              <Card.Title>
                <DriveFileRenameOutlineOutlinedIcon /> {post.itemName}
              </Card.Title>
              <Card.Text>
                <Badge style={{ marginRight: "5px" }} bg="secondary">
                  {post.category}
                </Badge>
                <Badge style={{ marginRight: "5px" }} bg="secondary">
                  {post.status}
                </Badge>
                <Badge style={{ marginRight: "5px" }} bg="primary">
                  Reward: ${post.reward || 0}
                </Badge>
              </Card.Text>

              <Card.Title>
                <DescriptionOutlinedIcon /> Description
              </Card.Title>
              <Card.Text className="custom-post-big-text-container">{post.description}</Card.Text>
              <Card.Title>
                <LocationOnOutlinedIcon /> Location
              </Card.Title>

              <Card.Text>
                {/* {post.district ? post.district + ", " : "none"} */}
                {post.lostPlace ? post.lostPlace : "none"}
              </Card.Text>
              <Card.Title>
                <DateRangeOutlinedIcon /> Date of {post.isLostItem ? "lost" : "found"}
              </Card.Title>
              <Card.Text>
                <Moment format="YYYY/MM/DD">{post["lost_date"].seconds * 1000}</Moment> {post.lostTime || ""}
              </Card.Text>
              <Card.Title>Contact</Card.Title>
              <Card.Text>
                <LocalPhoneOutlinedIcon /> Phone {post.contact.phone}
                <br />
                <EmailOutlinedIcon /> Email {post.contact.email}
              </Card.Text>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between" style={{ backgroundColor: "white" }}>
              <Card.Text>
                Posted by
                <span
                  style={{ marginLeft: "8px" }}
                  className="custom-text-underline-hover"
                  onClick={() => navigate(`/profile/${post.creatorEmail.split("@")[0]}`)}
                >
                  <img className="custom-personal-icon" src={post.creatorPhoto} alt="" />
                  {post.creator}
                </span>
                <div className="text-muted" style={{ fontSize: "13px" }}>
                  <Moment fromNow ago>
                    {post.createdAt}
                  </Moment>{" "}
                  ago
                </div>
              </Card.Text>
              <Card.Text style={{ marginTop: "1rem" }}>
                <span className="d-flex justify-content-end">
                  <Button style={{ marginRight: "10px" }} variant="secondary" onClick={handleShow}>
                    Share
                  </Button>

                  {!!currentUser ? (
                    post.creatorEmail === currentUser.email ? (
                      <>
                        <Button style={{ marginRight: "10px" }} variant="dark" onClick={handleEditPost}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={handleDeletePost}>
                          Delete
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="primary" onClick={() => handleInbox(post.id)}>
                          Inbox
                        </Button>
                      </>
                    )
                  ) : (
                    ""
                  )}
                </span>
              </Card.Text>
            </Card.Footer>
          </Card>
        </Col>
      ) : (
        <Col lg={isProfileMode ? 6 : 3} md={isProfileMode ? 6 : 4} sm={isProfileMode ? 12 : 6}>
          <Card className="shadow cursor-pointer custom-hover-effect w-100 my-3">
            {post.imageUrls.length > 0 ? (
              <Carousel variant="dark" interval={null}>
                {post.imageUrls.map((url, i) => (
                  <Carousel.Item key={i}>
                    <img
                      className="d-block w-100"
                      style={{ objectFit: "cover", height: "200px" }}
                      src={url}
                      alt={`slide ${i + 1}`}
                      key={i}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              ""
            )}
            <Card.Body style={{ cursor: "pointer" }} onClick={() => navigate(`/post/${post.id}`)}>
              <Card.Title>
                {" "}
                <DriveFileRenameOutlineOutlinedIcon /> {post.itemName}
              </Card.Title>
              <Card.Text>
                <Badge style={{ marginRight: "5px" }} bg="secondary">
                  {post.category}
                </Badge>
                <Badge style={{ marginRight: "5px" }} bg="secondary">
                  {post.status}
                </Badge>
                <Badge style={{ marginRight: "5px" }} bg="primary">
                  Reward: ${post.reward || 0}
                </Badge>
              </Card.Text>
              {post.lostPlace && (
                <Card.Text>
                  <LocationOnOutlinedIcon /> Location: {post.lostPlace}
                </Card.Text>
              )}
              <Card.Text className="custom-post-text-container">
                <DescriptionOutlinedIcon /> Description <br />
                {post.description}
              </Card.Text>
              {post.lost_date && (
                <Card.Text>
                  <DateRangeOutlinedIcon /> {post.isLostItem ? "Lost on" : "Found on"}{" "}
                  <Moment format="YYYY/MM/DD">{post["lost_date"].seconds * 1000}</Moment> {post.lostTime || ""}
                </Card.Text>
              )}
            </Card.Body>
            <Card.Footer style={{ backgroundColor: "white" }}>
              <Card.Text>
                Posted by
                <span
                  style={{ marginLeft: "8px" }}
                  className="custom-text-underline-hover"
                  onClick={() => navigate(`/profile/${post.creatorEmail.split("@")[0]}`)}
                >
                  <img className="custom-personal-icon" src={post.creatorPhoto} alt="" />
                  {post.creator}
                </span>
                <div className="text-muted" style={{ fontSize: "13px" }}>
                  <Moment fromNow ago>
                    {post.createdAt}
                  </Moment>{" "}
                  ago
                </div>
              </Card.Text>
              <Button
                variant="white border shadow-sm d-flex justify-content-center align-items-center"
                style={{ zIndex: "100", width: "100%" }}
                onClick={() => setShowMap(true)}
              >
                <img src={markerLogo} alt="marker" height={20} />
                <span style={{ marginLeft: "10px" }}>Google Map</span>
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      )}
    </>
  );
};

export default PostCard;
