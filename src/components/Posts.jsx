import React, { useEffect, useRef, useState } from 'react';
import { getPosts } from '../utilities/firestoreAPIs.js';
import { Form, Card, Button, Badge, Container, Row, Col, Carousel, Spinner } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import Moment from 'react-moment';
import { useNavigate } from "react-router-dom"


const Posts = () => {

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [textQuery, setTextQuery] = useState('');
    const [categorySelected, setCateogrySelected] = useState('All');
    const [sortingSelected, setSortingSelected] = useState('desc');
    const [statusSelected, setStatusSelected] = useState('All');
    const navigate = useNavigate();


    let categories = ['Accessory', 'Bag', 'Book & Stationery', 'Certificate', 'Clothes', 'Electronic Product', 'Pet', 'Valuables', 'Others']

    let filters = {
        textQuery: textQuery,
        category: categorySelected,
        status: statusSelected,
        sortBy: sortingSelected
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        filters = {
            textQuery: textQuery,
            category: categorySelected,
            status: statusSelected,
            sortBy: sortingSelected
        }

        const data = await getPosts(filters);
        setIsLoading(false)
        setPosts(data)

    }

    useEffect(async () => {
        setIsLoading(true)
        const data = await getPosts(filters);
        console.log(data)
        setPosts(data)
        setIsLoading(false)

    }, [])

    return (
        <>
            <Container className='container d-flex flex-wrap my-3 justify-content-center'>
                <Row className="w-100">
                    <Card className=" shadow-sm border" >
                        <Card.Header>Filters</Card.Header>
                        <Card.Body>
                            <Form className='mb-2 d-flex'>
                                <Form.Group id='item_category ' className='flex-1 ' style={{ marginRight: "10px" }}>

                                    <Form.Label className=" ">Category</Form.Label>
                                    <Form.Select aria-label="Default select example" value={categorySelected} onChange={e => setCateogrySelected(e.target.value)}>
                                        <option value={"All"}>All</option>

                                        {categories.map((category) => {
                                            return (
                                                <option>{category}</option>

                                            )
                                        })}

                                    </Form.Select>

                                </Form.Group>
                                <Form.Group id='item_status ' className='flex-1 ' style={{ marginRight: "10px" }}>

                                    <Form.Label className=" ">Status</Form.Label>
                                    <Form.Select aria-label="Default select example" value={statusSelected} onChange={e => setStatusSelected(e.target.value)}>
                                        <option value={'All'}>All</option>

                                        <option value={"found"} >Found</option>
                                        <option value={"not_found"}>Not Found Yet</option>
                                    </Form.Select>

                                </Form.Group>
                                <Form.Group id='item_sort ' className='flex-1 ' style={{ marginRight: "10px" }}>

                                    <Form.Label className=" ">Sort By</Form.Label>
                                    <Form.Select aria-label="Default select example" value={sortingSelected} onChange={e => setSortingSelected(e.target.value)}>
                                        <option value={'desc'}>Created Date &#40;latest on top&#41;</option>
                                        <option value={'asc'}>Created Date &#40;oldest on top&#41;</option>
                                    </Form.Select>

                                </Form.Group>

                                <Form.Group id='item_name' className='ml-3'>
                                    <Form.Label>Search by name</Form.Label>
                                    <Form.Control type='text' placeholder='E.g. Brand ABC pencil' value={textQuery} onChange={(e) => setTextQuery(e.target.value)} required></Form.Control>
                                </Form.Group>
                            </Form>
                            <Button onClick={(e) => handleSearch(e)}>Search</Button>

                        </Card.Body>
                    </Card>
                </Row>

                {isLoading ? <div className='d-flex justify-content-center' style={{ minHeight: "70vh" }}>
                    <Spinner animation="border" className="my-auto" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div> : <>

                    <Row className="w-100">
                        {
                            !!posts ? posts.map((post, i) => {
                                return (
                                    <Col lg={3} md={4} sm={6} key={i}>
                                        <Card className="shadow cursor-pointer custom-hover-effect w-100 my-3" key={i}>
                                            {post.imageUrls.length > 0 ?
                                                <Carousel variant="dark" interval={null}>
                                                    {post.imageUrls.map((url, i) => (
                                                        <Carousel.Item>
                                                            <img
                                                                className="d-block w-100"
                                                                style={{ objectFit: "cover", height: "200px" }}
                                                                src={url}
                                                                alt={`slide ${i + 1}`}
                                                            />
                                                        </Carousel.Item>
                                                    ))}
                                                </Carousel>

                                                : ''}
                                            <Card.Body style={{ cursor: "pointer" }} onClick={() => navigate(`/post/${post.id}`)}>
                                                <Card.Title>{post.itemName}</Card.Title>
                                                <Card.Text>
                                                    <Badge style={{ marginRight: "5px" }} bg="secondary">{post.category}</Badge>
                                                    <Badge bg="secondary">{post.status === "not_found" ? "Not found yet" : "Found"}</Badge>
                                                </Card.Text>

                                                <Card.Text>Description: {post.description}</Card.Text>
                                                {/* <Button variant="primary">More</Button> */}
                                                {post.lost_date &&
                                                    <Card.Text>Lost on <Moment format="YYYY/MM/DD">{post["lost_date"].seconds * 1000}</Moment></Card.Text>

                                                }
                                                {/* <Card.Text>Contact</Card.Text>
                                            <div>Phone: {post.contact.phone}</div>
                                            <div>Email: {post.contact.email}</div> */}

                                            </Card.Body>
                                            <Card.Footer>
                                                <Card.Text>
                                                    Posted by {post.creator}
                                                    <div className='text-muted' style={{ fontSize: "13px" }}><Moment fromNow ago>{post.createdAt}</Moment> ago</div>
                                                </Card.Text>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                )

                            }) :
                                <div>NO LISTING</div>
                        }
                    </Row>
                    <Pagination>
                        <Pagination.First />
                        <Pagination.Prev />
                        <Pagination.Item>{1}</Pagination.Item>
                        <Pagination.Ellipsis />

                        <Pagination.Item>{10}</Pagination.Item>
                        <Pagination.Item>{11}</Pagination.Item>
                        <Pagination.Item active>{12}</Pagination.Item>
                        <Pagination.Item>{13}</Pagination.Item>
                        <Pagination.Item disabled>{14}</Pagination.Item>

                        <Pagination.Ellipsis />
                        <Pagination.Item>{20}</Pagination.Item>
                        <Pagination.Next />
                        <Pagination.Last />
                    </Pagination></>}

            </Container>


        </>

    )
}

export default Posts