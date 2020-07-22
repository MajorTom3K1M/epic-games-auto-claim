import React from 'react';
import {
    Container
} from 'reactstrap';

import './loading.css';

class Loading extends React.Component {
    render() {
        return (
            <Container fluid={true} style={{ padding: 0, height: '100%' }} className="d-flex justify-content-center">
                <span className="loader">
                    <span className="loader-inner"></span>
                </span>
            </Container>
        );
    }
}

export default Loading; 