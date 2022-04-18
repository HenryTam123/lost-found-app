import React, { useEffect, useRef, useState } from "react";
import { getPosts } from "../utilities/firestoreAPIs.js";
import {
  Form,
  Card,
  Button,
  Badge,
  Container,
  Row,
  Col,
  Carousel,
  Spinner,
  Accordion,
  Modal,
  InputGroup,
} from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { useNavigate } from "react-router-dom";
import PostCard from "./PostCard.jsx";
import SearchIcon from "@mui/icons-material/Search";
import markerLogo from "../images/marker.png";
import MyMap from "./MyMap.jsx";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [totalDocs, setTotalDocs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [textQuery, setTextQuery] = useState("");
  const [textLocationQuery, setTextLocationQuery] = useState("");
  const [categorySelected, setCateogrySelected] = useState("All");
  const [districtSelected, setDistrictSelected] = useState("All");
  const [sortingSelected, setSortingSelected] = useState("desc");
  const [statusSelected, setStatusSelected] = useState("All");
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const handleCloseMap = () => setShowMap(false);
  const handleShowMap = () => setShowMap(true);
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

  let filters = {
    textQuery: textQuery,
    category: categorySelected,
    district: districtSelected,
    status: statusSelected,
    sortBy: sortingSelected,
  };

  let postPerPage = 8;

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    filters = {
      textQuery: textQuery,
      category: categorySelected,
      district: districtSelected,
      status: statusSelected,
      sortBy: sortingSelected,
    };

    const data = await getPosts(filters);
    setIsLoading(false);

    let filteredData = data.filter(
      (d) =>
        d.itemName.toLowerCase().includes(textQuery.toLowerCase()) ||
        d.lostPlace.toLowerCase().includes(textQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(textQuery.toLowerCase())
    );

    setPosts(filteredData);
    setTotalDocs(filteredData.length);
  };

  let pageItems = [];

  for (let i = 1; i <= totalDocs / postPerPage + 1; i++) {
    pageItems.push(
      <Pagination.Item value={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>
        {i}
      </Pagination.Item>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getPosts(filters);
      setPosts(data);
      setTotalDocs(data[0].totalDocs);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div style={{ paddingTop: "75px" }}>
      <Container className="d-flex justify-content-between align-items-center">
        <h4 className="mt-2 py-2 custom-label">Posts</h4>
        <Button
          className="border shadow-sm d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "white", color: "black" }}
          onClick={() => setShowMap(true)}
        >
          <img src={markerLogo} alt="marker" height={20} />
          <span style={{ marginLeft: "10px" }}>Google Map</span>
        </Button>
      </Container>
      <Modal show={showMap} onHide={handleCloseMap} size={"xl"}>
        <Modal.Body closeButton>
          <MyMap isViewAll={true} isViewOnlyMode={true} posts={posts} />
        </Modal.Body>
      </Modal>
      <Container className="container d-flex flex-wrap my-2 justify-content-center">
        <Row className="w-100">
          <Form onSubmit={(e) => handleSearch(e)} style={{ padding: "4px" }}>
            <InputGroup className="mb-3">
              <InputGroup.Text id="search_label" className="bg-white border-none">
                <SearchIcon />
              </InputGroup.Text>
              <Form.Control
                type="text"
                className="border-none"
                placeholder="Search location, description or name of item"
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
              />{" "}
            </InputGroup>
          </Form>

          <Accordion className=" accordion">
            <Accordion.Item eventKey="0" className="shadow-sm">
              <Accordion.Header>Filters</Accordion.Header>
              <Accordion.Body>
                <Form className="mb-2">
                  <Form.Group id="item_category " className="flex-1 " style={{ marginRight: "10px" }}>
                    <Form.Label className=" ">Category</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      value={categorySelected}
                      onChange={(e) => setCateogrySelected(e.target.value)}
                    >
                      <option value={"All"}>All</option>

                      {categories.map((category, i) => {
                        return <option key={i}>{category}</option>;
                      })}
                    </Form.Select>
                  </Form.Group>
                  {/* <Form.Group id="item_districts" className="flex-1 mt-2 " style={{ marginRight: "10px" }}>
                    <Form.Label className=" ">District</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      value={districtSelected}
                      onChange={(e) => setDistrictSelected(e.target.value)}
                    >
                      <option value={"All"}>All</option>

                      {districts.map((district, i) => {
                        return <option key={i}>{district}</option>;
                      })}
                    </Form.Select>
                  </Form.Group> */}
                  <Form.Group id="item_status " className="flex-1  mt-2" style={{ marginRight: "10px" }}>
                    <Form.Label className=" ">Status</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      value={statusSelected}
                      onChange={(e) => setStatusSelected(e.target.value)}
                    >
                      <option value={"All"}>All</option>

                      <option value={"Found"}>Found</option>
                      <option value={"Not Found Yet"}>Not Found Yet</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group id="item_sort " className="flex-1 mt-2" style={{ marginRight: "10px" }}>
                    <Form.Label className=" ">Sort By</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      value={sortingSelected}
                      onChange={(e) => setSortingSelected(e.target.value)}
                    >
                      <option value={"desc"}>Created Date &#40;latest on top&#41;</option>
                      <option value={"asc"}>Created Date &#40;oldest on top&#41;</option>
                    </Form.Select>
                  </Form.Group>
                  {/* <Form.Group id="item_location" className="ml-3 mt-2">
                    <Form.Label>Search by Location</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="E.g. Tseung Kwan O"
                      value={textLocationQuery}
                      onChange={(e) => setTextLocationQuery(e.target.value)}
                    ></Form.Control>
                  </Form.Group> */}
                  <Button className="mt-3" onClick={(e) => handleSearch(e)}>
                    Search
                  </Button>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Row>

        {isLoading ? (
          <div className="d-flex justify-content-center" style={{ minHeight: "70vh" }}>
            <Spinner animation="border" className="my-auto" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <Row className="w-100" style={{ minHeight: "90vh" }}>
              {posts.length !== 0 ? (
                posts.map((post, i) => {
                  if (i + 1 > (currentPage - 1) * postPerPage && i + 1 <= currentPage * postPerPage) {
                    return <PostCard post={post} key={i} />;
                  }
                  return;
                })
              ) : (
                <div className="text-center mt-3">NO LISTING</div>
              )}
            </Row>
            <Pagination className="mt-3">
              <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} />
              {pageItems}
              <Pagination.Next
                disabled={currentPage > totalDocs / postPerPage}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              />
            </Pagination>
          </>
        )}
      </Container>
    </div>
  );
};

export default Posts;
