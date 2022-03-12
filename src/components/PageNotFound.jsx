import React from 'react'
import { Container, Alert } from 'react-bootstrap'

const PageNotFound = () => {
    return (
        <div style={{ paddingTop: "100px" }}>
            <Container style={{ minHeight: "90vh", fontSize: "30px" }} className="d-flex text-center justify-content-center">
                <Alert variant='danger' style={{ height: "80px" }}>
                    Page Not Found
                </Alert>
            </Container>

        </div>
    )
}

export default PageNotFound