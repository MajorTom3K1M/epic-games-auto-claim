import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import './notfound.css';

class NotFound extends React.Component {
    render() {
        return (
            <Container fluid style={{ height: '100%' }} className="wrapper d-flex align-items-center align-middle">
                <Col>
                    <Row>
                        <div className="head">
                            <div className="meta"></div>
                            <div className="meta"></div>
                        </div>
                    </Row>
                    <span style={{ width: '100%', height: '100%' }} className="d-flex justify-content-center">
                        <div className="body">
                        </div>
                    </span>
                </Col>
            </Container>
        );
    }
}

export default NotFound;