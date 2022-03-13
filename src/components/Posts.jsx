import React, { useEffect, useRef, useState } from 'react';
import { getPosts } from '../utilities/firestoreAPIs.js';
import { Form, Card, Button, Badge, Container, Row, Col, Carousel, Spinner, Accordion } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import Moment from 'react-moment';
import { useNavigate } from "react-router-dom"
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PostCard from './PostCard.jsx';

const Posts = () => {

    const [posts, setPosts] = useState([]);
    const [totalDocs, setTotalDocs] = useState(0);
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [textQuery, setTextQuery] = useState('');
    const [categorySelected, setCateogrySelected] = useState('All');
    const [sortingSelected, setSortingSelected] = useState('desc');
    const [statusSelected, setStatusSelected] = useState('All');
    const navigate = useNavigate();


    let categories = ['Accessory', 'Bag', 'Book & Stationery', 'Certificate', 'Clothes', 'Electronic Product', "People", 'Pet', 'Valuables', 'Others']

    let filters = {
        textQuery: textQuery,
        category: categorySelected,
        status: statusSelected,
        sortBy: sortingSelected
    }

    let postPerPage = 8;

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

        let filteredData = data.filter(d => d.itemName.toLowerCase().includes(textQuery.toLowerCase()))

        setPosts(filteredData)
        setTotalDocs(filteredData.length)
    }


    let pageItems = [];

    for (let i = 1; i <= (totalDocs / postPerPage) + 1; i++) {

        pageItems.push(
            <Pagination.Item value={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>
                {i}
            </Pagination.Item>
        )
    }

    useEffect(async () => {
        setIsLoading(true)
        const data = await getPosts(filters);
        setPosts(data)
        setTotalDocs(data[0].totalDocs)
        setIsLoading(false)

    }, [])

    return (
        <div style={{ paddingTop: "75px" }}>
            <Container>
                <h4 className=' py-2 custom-label'>Posts</h4>
            </Container>
            <Container className='container d-flex flex-wrap my-3 justify-content-center'>

                <Row className="w-100">
                    <Accordion className=" accordion" >
                        <Accordion.Item eventKey="0" className="shadow-sm">
                            <Accordion.Header>Filters</Accordion.Header>
                            <Accordion.Body>
                                <Form className='mb-2'>
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
                                    <Form.Group id='item_status ' className='flex-1  mt-2' style={{ marginRight: "10px" }}>

                                        <Form.Label className=" ">Status</Form.Label>
                                        <Form.Select aria-label="Default select example" value={statusSelected} onChange={e => setStatusSelected(e.target.value)}>
                                            <option value={'All'}>All</option>

                                            <option value={"found"} >Found</option>
                                            <option value={"not_found"}>Not Found Yet</option>
                                        </Form.Select>

                                    </Form.Group>
                                    <Form.Group id='item_sort ' className='flex-1 mt-2' style={{ marginRight: "10px" }}>

                                        <Form.Label className=" ">Sort By</Form.Label>
                                        <Form.Select aria-label="Default select example" value={sortingSelected} onChange={e => setSortingSelected(e.target.value)}>
                                            <option value={'desc'}>Created Date &#40;latest on top&#41;</option>
                                            <option value={'asc'}>Created Date &#40;oldest on top&#41;</option>
                                        </Form.Select>

                                    </Form.Group>

                                    <Form.Group id='item_name' className='ml-3  mt-2'>
                                        <Form.Label>Search by name</Form.Label>
                                        <Form.Control type='text' placeholder='E.g. Brand ABC pencil' value={textQuery} onChange={(e) => setTextQuery(e.target.value)} required></Form.Control>
                                    </Form.Group>
                                    <Button className="mt-3" onClick={(e) => handleSearch(e)}>Search</Button>

                                </Form>
                            </Accordion.Body>

                        </Accordion.Item>
                    </Accordion>
                </Row>

                {isLoading ? <div className='d-flex justify-content-center' style={{ minHeight: "70vh" }}>
                    <Spinner animation="border" className="my-auto" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div> : <>

                    <Row className="w-100">
                        {
                            !!posts ? posts.map((post, i) => {
                                if (i + 1 > (currentPage - 1) * postPerPage && i + 1 <= currentPage * postPerPage) {
                                    return (
                                        <PostCard post={post} key={i} />
                                    )
                                }
                                return

                            }) :
                                <div>NO LISTING</div>
                        }
                    </Row>
                    <Pagination className='mt-3'>

                        <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} />
                        {pageItems}
                        <Pagination.Next disabled={currentPage > totalDocs / postPerPage} onClick={() => setCurrentPage(prev => prev + 1)} />

                    </Pagination></>}

            </Container>


        </div>

    )
}

export default Posts