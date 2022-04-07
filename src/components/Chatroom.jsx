import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Container, Spinner, Toast, Image } from "react-bootstrap";
import Moment from "react-moment";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getChatrooms, updateChatMessage } from "../utilities/firestoreAPIs";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import moment from "moment";
import ImageIcon from "@mui/icons-material/Image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { storage } from "../firebase-config";
import emailjs from "@emailjs/browser";

let currentDay = "";

const Chatroom = ({ props }) => {
  const navigate = useNavigate();
  const [showLeft, setShowLeft] = useState(true);
  const [images, setImages] = useState([]);
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [currentChatroom, setCurrentChatroom] = useState();
  const [userInput, setUserInput] = useState("");
  const [urls, setUrls] = useState([]);

  // const [currentDay, setCurrentDay] = useState('')

  const { state } = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let data = await getChatrooms(currentUser);
      if (!!data) {
        data.sort((a, b) => (a.updatedAt < b.updatedAt || a.updatedAt < b.createdAt ? 1 : -1));
        if (!!state) {
          let removedChatroom = data.filter(
            (d) =>
              d.postId === state.postId &&
              state.creatorEmail === d.postCreatorEmail &&
              state.viewerEmail === d.postViewerEmail
          );
          data = data.filter(
            (d) =>
              d.postId !== state.postId ||
              state.creatorEmail !== d.postCreatorEmail ||
              state.viewerEmail !== d.postViewerEmail
          );

          data = removedChatroom.concat(data);
        }
        setChatrooms(data);
        setCurrentChatroom(data[0]);
        setIsLoading(false);
      }

      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleSelectChatroom = (chatroom) => {
    currentDay = "";
    setCurrentChatroom(chatroom);
    setShowLeft(false);
  };

  console.log(currentChatroom, currentUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInput !== "") {
      let newMessage = {
        createdAt: new Date().getTime(),
        message: userInput,
        sender: currentUser.email,
      };
      await updateChatMessage(currentChatroom.id, newMessage);
      let data = await getChatrooms(currentUser);
      data.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
      setChatrooms(data);
      setCurrentChatroom(data[0]);
      setUserInput("");
      await sendEmail({ message: userInput });
    }
  };

  const renderChatRoomDay = (day) => {
    if (day !== currentDay) {
      currentDay = day;
      return <div className="text-center">{currentDay}</div>;
    }
  };

  const hiddenFileInput = React.useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleChange = (e) => {
    if (e.target.files.length + urls.length > 5) {
      alert("You can only choose a maximm of FIVE photos");
      return;
    }
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prevState) => [...prevState, newImage]);
    }
  };

  const sendEmail = async ({ isImageSent = false, message = "" }) => {
    let { postCreatorEmail, postCreator, postViewer, postViewerEmail } = currentChatroom;

    let templateParams = {
      to_name: postViewer === currentUser.displayName ? postCreator : postViewer,
      from_name: currentUser.displayName,
      message: isImageSent ? "Photo preview is not available" : message,
      receiverEmail: postViewerEmail === currentUser.email ? postCreatorEmail : postViewerEmail,
    };

    return await emailjs.send("service_ogf0vd8", "template_o0fzq4k", templateParams, "Qj4Ix9Kr-T8s58Ruk");
  };

  useEffect(() => {
    handleUploadImage();
  }, [images]);

  const handleUploadImage = async () => {
    const promises = [];
    let photoUrls = [];
    if (images.length === 0) return;

    images.map((image) => {
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image, {
        contentType: "image/jpeg",
      });
      promises.push(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
            default:
            // console.log("fine");
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (urls) => {
            console.log(urls);

            let newMessage = {
              createdAt: new Date().getTime(),
              message: "",
              sender: currentUser.email,
              image: urls,
            };
            await updateChatMessage(currentChatroom.id, newMessage);
            let data = await getChatrooms(currentUser);
            data.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
            setChatrooms(data);
            setCurrentChatroom(data[0]);
            setUserInput("");
            setUrls([]);
            await sendEmail({ message: "[photo]" });
          });
        }
      );
    });

    Promise.all(promises)
      .then(() => {
        console.log(photoUrls);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ paddingTop: "75px" }}>
      <Container>
        <h4 className="py-2 custom-label">Your Inbox</h4>
      </Container>
      {!!currentUser && chatrooms.length !== 0 ? (
        <div className="custom-chat-container my-3 shadow">
          <Row className="w-100" style={{ marginLeft: "0px", paddingLeft: "0px", paddingRight: "0px" }}>
            <Col className={`custom-chat-left border ${!showLeft && " d-none d-md-block"}`} xs={12} lg={4} md={5}>
              {!!chatrooms &&
                currentChatroom &&
                chatrooms.map((chatroom, i) => (
                  <div
                    className={`custom-chat-snap border-bottom d-flex justify-content-between ${
                      chatroom.postId === currentChatroom.postId && "custom-chat-selected"
                    }`}
                    key={i}
                    onClick={() => handleSelectChatroom(chatroom)}
                  >
                    {currentUser.displayName === chatroom.postCreator ? (
                      <>
                        <div>
                          <img
                            className="custom-personal-icon-chat"
                            alt={"icon"}
                            style={{ marginTop: "5px" }}
                            src={chatroom.postViewerPhoto}
                          />
                        </div>
                        <div className="flex-1 d-flex flex-column w-100">
                          <div className="text-muted">{chatroom.postViewer}</div>
                          <div style={{ marginTop: "10px" }}>
                            {chatroom.messages.length !== 0 && (
                              <div className="custom-sameline-text">
                                {!!chatroom.messages[chatroom.messages.length - 1].image
                                  ? "[photo]"
                                  : chatroom.messages[chatroom.messages.length - 1].message}
                                <div className="text-muted" style={{ fontSize: "13px", marginLeft: "" }}>
                                  <Moment fromNow ago>
                                    {chatroom.updatedAt}
                                  </Moment>{" "}
                                  ago
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <img
                            className="custom-personal-icon-chat"
                            alt="icon"
                            style={{ marginTop: "5px" }}
                            src={chatroom.postCreatorPhoto}
                          />
                        </div>
                        <div className="flex-1 d-flex flex-column w-100">
                          <div className="text-muted">{chatroom.postCreator}</div>
                          <div style={{ marginTop: "10px" }}>
                            {chatroom.messages.length !== 0 && (
                              <div className="custom-sameline-text">
                                {!!chatroom.messages[chatroom.messages.length - 1].image
                                  ? "[photo]"
                                  : chatroom.messages[chatroom.messages.length - 1].message}
                                <div className="text-muted" style={{ fontSize: "13px", marginLeft: "" }}>
                                  <Moment fromNow ago>
                                    {chatroom.updatedAt}
                                  </Moment>{" "}
                                  ago
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="d-flex flex-column ml-auto">
                      <img className="custom-chat-post-icon" src={chatroom.postThumb} />
                    </div>
                  </div>
                ))}
            </Col>
            <Col
              style={{ padding: "0" }}
              className={`${showLeft && "d-none"} d-md-flex custom-chat-right d-flex flex-column`}
              xs={0}
              sm={0}
              lg={8}
              md={7}
            >
              {!!currentChatroom && (
                <>
                  <div className="custom-chat-header border-bottom border-top align-items-center">
                    <ArrowBackIcon
                      className="d-block d-xs-block d-sm-block d-md-none d-lg-none"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowLeft(true)}
                    />

                    <div className="d-flex align-items-center" style={{ minWidth: "150px", marginLeft: "10px" }}>
                      {currentUser.email === currentChatroom.postCreatorEmail ? (
                        <>
                          <img
                            alt="icon"
                            className={`${showLeft && " d-none d-md-block"} custom-personal-icon-chat`}
                            src={currentChatroom.postViewerPhoto}
                            style={{ marginTop: "5px" }}
                          />
                          <div className="">
                            <div
                              className="custom-text-underline-hover"
                              onClick={() => navigate(`/profile/${currentChatroom.postViewerEmail.split("@")[0]}`)}
                            >
                              {currentChatroom.postViewer}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            alt="icon"
                            className={`${showLeft && " d-none d-md-block"} custom-personal-icon-chat`}
                            src={currentChatroom.postCreatorPhoto}
                            style={{ marginTop: "5px" }}
                          />
                          <div className="">
                            <div
                              className="custom-text-underline-hover"
                              onClick={() => navigate(`/profile/${currentChatroom.postCreatorEmail.split("@")[0]}`)}
                            >
                              {currentChatroom.postCreator}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div
                      className="d-flex align-items-center w-auto"
                      style={{ justifySelf: "flex-end", marginRight: "20px", marginLeft: "auto", cursor: "pointer" }}
                      onClick={() => navigate(`/post/${currentChatroom.postId}`)}
                    >
                      <div className="cursor-pointer custom-sameline-text-two">{currentChatroom.postTitle}</div>
                      <img alt="icon" className="custom-chat-post-icon" src={currentChatroom.postThumb} />
                    </div>
                  </div>

                  <div className="custom-chat-body flex-1 d-flex flex-column">
                    {currentChatroom.messages.map((message, i) => {
                      if (message.sender === currentUser.email) {
                        return (
                          <>
                            {renderChatRoomDay(moment(message.createdAt).format("LL"))}
                            <div className="custom-chat-message-right" key={i}>
                              {message.message !== "" ? (
                                message.message
                              ) : (
                                <a href={message.image} target="_blank">
                                  <Image height={40} src={message.image} />
                                </a>
                              )}
                              <div>
                                <Moment format="LT" className="custom-chat-message-time">
                                  {message.createdAt}
                                </Moment>
                              </div>
                            </div>
                          </>
                        );
                      } else {
                        return (
                          <>
                            {renderChatRoomDay(moment(message.createdAt).format("LL"))}

                            <div className="custom-chat-message-left" key={i}>
                              {message.message !== "" ? (
                                message.message
                              ) : (
                                <a href={message.image} target="_blank">
                                  <Image height={40} src={message.image} />
                                </a>
                              )}
                              <div>
                                <Moment format="LT" className="custom-chat-message-time">
                                  {message.createdAt}
                                </Moment>
                              </div>
                            </div>
                          </>
                        );
                      }
                    })}
                  </div>
                  <div className="custom-chat-inputbox border-top d-flex align-items-center">
                    <Form
                      onSubmit={(e) => handleSubmit(e)}
                      className="d-flex align-items-center justify-content-between w-100"
                    >
                      {/* {!!urls &&
                        urls.map((url) => {
                          return (
                            <Image className="m-1 custom-input-image" src={url} style={{ height: "100px" }}></Image>
                          );
                        })} */}
                      <input
                        type="text"
                        placeholder="Input here.."
                        value={userInput}
                        style={{ border: "none" }}
                        onChange={(e) => {
                          setUserInput(e.target.value);
                        }}
                        className="custom-input-field w-100"
                      />

                      <>
                        <ImageIcon onClick={handleClick} className="cursor-pointer" />
                        <input
                          type="file"
                          ref={hiddenFileInput}
                          onChange={handleChange}
                          style={{ display: "none" }}
                          accept="image/*"
                        />
                      </>
                    </Form>
                  </div>
                </>
              )}
            </Col>
          </Row>
        </div>
      ) : isLoading ? (
        <div className="d-flex justify-content-center p-0" style={{ minHeight: "80vh" }}>
          <Spinner animation="border" className="my-auto" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div style={{ minHeight: "90vh" }}>You don't have any chatroom yet</div>
      )}
    </div>
  );
};

export default Chatroom;
