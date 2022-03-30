import React, { useState, useEffect } from "react";
import { getOnePost } from "../utilities/firestoreAPIs.js";
import { Form, Button, Card, Image, Container, Alert, Spinner } from "react-bootstrap";
import { storage } from "../firebase-config";
import { useAuth } from "../context/AuthContext";
import { updatePost } from "../utilities/firestoreAPIs";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";
import { addPost } from "../utilities/firestoreAPIs";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CategoryIcon from "@mui/icons-material/Category";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import PaidIcon from "@mui/icons-material/Paid";
import MyMap from "./MyMap";

const OriginalForm = ({ post = {}, isUpdateMode = false }) => {
  const [currentPost, setCurrentPost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);
  const [isPhoneSelected, setIsPhoneSelected] = useState(false);
  const [isEmailSelected, setIsEmailSelected] = useState(false);
  const [categorySelected, setCateogrySelected] = useState("Accessory");
  const [districtSelected, setDistrictSelected] = useState("Islands");
  const [statusSelected, setStatusSelected] = useState("Not found Yet");
  const [reward, setReward] = useState(0);
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [itemName, setItemName] = useState("");
  const [lostPlace, setLostPlace] = useState("");
  const [lostTime, setLostTime] = useState("1:00 PM");
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [wordCount, setWordCount] = useState(0);
  const [validated, setValidated] = useState(false);
  const [markerLatLng, setMarkerLatLng] = useState({});
  const [markerAddress, setMarkerAddress] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  let times = [
    "12:00 AM",
    "0:30 AM",
    "1:00 AM",
    "1:30 AM",
    "2:00 AM",
    "2:30 AM",
    "3:00 AM",
    "3:30 AM",
    "4:00 AM",
    "4:30 AM",
    "5:00 AM",
    "5:30 AM",
    "6:00 AM",
    "6:30 AM",
    "7:00 AM",
    "7:30 AM",
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:00 AM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
    "10:00 PM",
    "10:30 PM",
    "11:00 PM",
    "11:30 PM",
  ];
  let categories = [
    "Accessory",
    "Bag",
    "Book & Stationery",
    "Certificate",
    "Clothes",
    "Electronic Product",
    "People",
    "Pet",
    "Valuables",
    "Others",
  ];
  let districts = [
    "Central and Western",
    "Eastern",
    "Islands",
    "Kowloon City",
    "Kwai Tsing",
    "Kwun Tong",
    "North",
    "Sai Kung",
    "Sha Tin",
    "Sham Shui Po",
    "Southern",
    "Tai Po",
    "Tsuen Wan",
    "Tuen Mun",
    "Wan Chai",
    "Wong Tai Sin",
    "Yau Tsim Mong",
    "Yuen Long",
  ];
  const renderData = (post = {}) => {
    if (!!post && !!post.contact) {
      setItemName(post.itemName);
      setEmail(post.contact.email);
      setPhone(post.contact.phone);
      setDescription(post.description);
      setCateogrySelected(post.category);
      setStatusSelected(post.status);
      setLostPlace(post.lostPlace);
      setMarkerLatLng(post.latlng);
      setMarkerAddress(post.lostPlace);
      setLostTime(post.lostTime);
      setReward(post.reward || 0);
      setDate(new Date(post.lost_date.seconds * 1000));
      if (!!post.contact.phone) setIsPhoneSelected(true);
      if (!!post.contact.email) setIsEmailSelected(true);

      setUrls(post.imageUrls);
    }
  };

  useEffect(() => {
    handleUploadImage();
  }, [images]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let postId = location.pathname.split("/").pop();
      const data = await getOnePost(postId);
      console.log(data);
      setCurrentPost(data);
      renderData(data);
      setIsLoading(false);
    };
    if (isUpdateMode) {
      fetchData();
    }
  }, []);

  const countWord = (text) => {
    if (text) {
      return text.match(/[\u00ff-\uffff]|\S+/g).length || 0;
    }
    return 0;
  };

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

  const handleUploadImage = () => {
    const promises = [];
    setUrls([]);
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
              console.log("fine");
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((urls) => {
            setUrls((prevState) => [...prevState, urls]);
          });
        }
      );
    });

    Promise.all(promises)
      .then(() => console.log("All images uploaded"))
      .catch((err) => console.log(err));
  };

  const handleUpdatePost = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    setValidated(true);

    if (form.checkValidity() === true) {
      let newPost = {
        creator: currentUser.displayName,
        creatorEmail: currentUser.email,
        itemName: itemName,
        description: description,
        imageUrls: urls,
        contact: {
          email: email,
          phone: phone,
        },
        latlng: {
          lat: markerLatLng.lat,
          lng: markerLatLng.lng,
        },
        lostPlace: document.getElementById("marker_address").value,
        // district: districtSelected,
        lostTime: lostTime,
        status: statusSelected,
        category: categorySelected,
        lost_date: date,
        updatedAt: new Date().getTime(),
        reward: reward,
      };

      console.log(newPost);

      let res = await updatePost(currentPost.id, newPost);
      alert("Your item is updated successfully");
      navigate("/your-listing");
    }
  };

  const handleCreatePost = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      console.log("run");

      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);

    console.log(markerLatLng.lat, markerLatLng.lng, document.getElementById("marker_address").value);

    if (form.checkValidity() === true) {
      let newPost = {
        creator: currentUser.displayName,
        creatorEmail: currentUser.email,
        itemName: itemName,
        description: description,
        imageUrls: urls,
        contact: {
          email: email,
          phone: phone,
        },
        latlng: {
          lat: markerLatLng.lat,
          lng: markerLatLng.lng,
        },
        lostPlace: document.getElementById("marker_address").value,
        // district: districtSelected,
        lostTime: lostTime,
        status: statusSelected,
        category: categorySelected,
        lost_date: date,
        reward: reward,
      };

      console.log(newPost);

      let res = await addPost(newPost);
      alert("Your item is posted successfully");
      navigate("/posts");
    }
  };
  return (
    <div className="d-flex flex-wrap">
      <Card className=" shadow border m-2">
        <Card.Body>
          <Form className="mb-2">
            <Form.Group id="image">
              <Form.Label>
                Photos of your Item <span className="text-muted">&#40;up to 5 photos&#41;</span>
              </Form.Label>
              <Form.Control type="file" multiple onChange={(e) => handleChange(e)}></Form.Control>
            </Form.Group>
          </Form>
          {!!urls &&
            urls.map((url) => {
              return <Image className="m-1" src={url} style={{ height: "100px" }}></Image>;
            })}
        </Card.Body>
      </Card>

      <Card className=" shadow border w-100 m-2" style={{ flex: "1", minWidth: "200px" }}>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={isUpdateMode ? handleUpdatePost : handleCreatePost}>
            <Form.Group id="item_name" className="mb-3">
              <Form.Label>
                <DriveFileRenameOutlineIcon /> Name of your item <span className="text-muted">&#40;required&#41;</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="E.g. Brand ABC pencil"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group id="item_description" className="mb-3">
              <Form.Label>
                <DescriptionOutlinedIcon /> Description &#40;max. 200 words&#41;{" "}
                <span className="text-muted">&#40;required&#41;</span>
              </Form.Label>
              <span className="custom-word-count"> {`${wordCount}/200`}</span>
              <Form.Control
                as="textarea"
                placeholder="E.g. features of your item?"
                required
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setWordCount(countWord(e.target.value));
                }}
                style={{ reSize: "none" }}
              ></Form.Control>
            </Form.Group>

            <Form.Group id="item_lost_place" className="mb-3">
              <Form.Label>
                <LocationOnOutlinedIcon /> Where did you lose the item?{" "}
                <span className="text-muted">&#40;required&#41;</span>
              </Form.Label>
              <MyMap
                setMarkerLatLng={setMarkerLatLng}
                markerLatLng={markerLatLng}
                isViewOnlyMode={false}
                setMarkerAddress={setMarkerAddress}
                markerAddress={markerAddress}
              />
              {/* <Form.Group id="item_location_district" className="mb-3 d-flex mt-3">
                <Form.Select aria-label="Default select example" style={{ width: "200px", marginRight: "5px" }} value={districtSelected} onChange={(e) => setDistrictSelected(e.target.value)}>
                  <option disabled>Select district here</option>

                  {districts.map((district, i) => {
                    return <option key={i}>{district}</option>;
                  })}
                </Form.Select>

                <Form.Control type="text" placeholder="E.g. TKO Mtr Station" required value={lostPlace} onChange={(e) => setLostPlace(e.target.value)}></Form.Control>
              </Form.Group> */}
            </Form.Group>
            <Form.Label>
              <DateRangeOutlinedIcon /> When did you lose your item?
            </Form.Label>
            <Form.Group id="item_lost_time_date" className="mb-3">
              <Form.Label>
                Date<span className="text-muted"> &#40;required&#41;</span>
              </Form.Label>
              <DatePicker
                className="form-control"
                required
                selected={date}
                onChange={(date) => setDate(date)}
                maxDate={new Date()}
              />
            </Form.Group>
            <Form.Group id="item_lost_time_time" className="mb-3">
              <Form.Label>
                Time<span className="text-muted"> &#40;required&#41;</span>
              </Form.Label>
              <Form.Select
                aria-label="Default select example"
                value={lostTime}
                onChange={(e) => setLostTime(e.target.value)}
                required
              >
                <option disabled>Select Time here</option>

                {times.map((time, i) => {
                  return <option key={i}>{time}</option>;
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group id="contact" className="mb-3">
              <Form.Label>
                <LocalPhoneOutlinedIcon /> Contact Method <span className="text-muted">&#40;required&#41;</span>
              </Form.Label>
              <Form.Check type={"checkbox"} required>
                <Form.Check.Input
                  checked={isPhoneSelected}
                  type={"checkbox"}
                  required
                  onChange={(e) => setIsPhoneSelected(e.target.checked)}
                />
                <Form.Check.Label>{`Phone number`}</Form.Check.Label>
                {isPhoneSelected && (
                  <>
                    <Form.Control
                      type="text"
                      placeholder="E.g. 9876 5432"
                      required
                      pattern="^[0-9]+$"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">Please provide a valid phone number.</Form.Control.Feedback>
                  </>
                )}
              </Form.Check>
              <Form.Check type={"checkbox"}>
                <Form.Check.Input
                  checked={isEmailSelected}
                  required
                  type={"checkbox"}
                  onChange={(e) => setIsEmailSelected(e.target.checked)}
                />
                <Form.Check.Label>{`Email`}</Form.Check.Label>
                {isEmailSelected && (
                  <>
                    <Form.Control
                      type="email"
                      placeholder="E.g. jason123@gmail.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      pattern="/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}"
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback>
                  </>
                )}
              </Form.Check>
            </Form.Group>

            <Form.Group id="item_category" className="mb-3">
              <Form.Label>
                <CategoryIcon /> Category <span className="text-muted">&#40;optional&#41;</span>
              </Form.Label>
              <Form.Select
                aria-label="Default select example"
                value={categorySelected}
                onChange={(e) => setCateogrySelected(e.target.value)}
              >
                <option disabled>Select category here</option>

                {categories.map((category, i) => {
                  return <option key={i}>{category}</option>;
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group id="item_reward" className="mb-3">
              <Form.Label>
                <PaidIcon /> Reward <span className="text-muted">&#40;required&#41;</span>
              </Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  style={{ marginRight: "5px", width: "60px" }}
                  value={"HKD"}
                  disabled
                ></Form.Control>
                <Form.Control
                  type="text"
                  placeholder="0"
                  required
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  pattern="^[0-9]*$"
                ></Form.Control>
                {/* <Form.Control.Feedback type="invalid">Please input number only.</Form.Control.Feedback>  */}
              </div>{" "}
            </Form.Group>
            <Form.Group id="item_status" className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                aria-label="Default select example"
                value={statusSelected}
                onChange={(e) => setStatusSelected(e.target.value)}
              >
                <option disabled>Select status here</option>
                <option value={"Not Found Yet"}>Not Found Yet</option>
                <option value={"Found"}>Found</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" disabled={loading} className="w-100 mt-4 cursor-pointer">
              {isUpdateMode ? "Update" : "Create"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OriginalForm;
