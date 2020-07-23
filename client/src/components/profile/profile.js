import React from 'react';
import Loading from '../loading';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { freegamesService, loginService } from '../../utils/services';
import {
    Col,
    Row,
    Card, CardImg, CardTitle,
    CardText, CardBody, CardImgOverlay,
    Container
} from 'reactstrap';
import {
    CheckCircle
} from 'react-feather';

import "./profile.css";

const mapStateToProps = ({ user: { email, userPresent } }) => ({
    email,
    userPresent
})

class Captcha extends React.Component {
    state = {
        freeGames: null,
        user: null
    };

    componentDidMount() {
        const { email } = this.props;
        freegamesService.getFreeGames(email)
            .then((freeGames) => {
                this.setState({ freeGames })
                loginService.getProfile(email)
                    .then((user) => {
                        console.log(user);
                        this.setState({ user })
                    }).catch((e) => {
                        console.log(e);
                    });
            }).catch((e) => {
                console.log(e);
            });
        freegamesService.purhcase(email)
            .then(({ statusText }) => {
                if (statusText === "OK") {
                    console.log("OK")
                    freegamesService.getFreeGames(email)
                        .then((freeGames) => { 
                            this.setState({ freeGames })
                        }).catch((e) => {
                            console.log(e);
                        });
                }
            }).catch((e) => {
                console.log(e);
            });

    }

    renderCard(freeGames) {
        return freeGames.map((detail, index) => {
            var date = new Date(detail.endDate)
            const mo = new Intl.DateTimeFormat('th', { month: 'short' }).format(date);
            const da = new Intl.DateTimeFormat('th', { day: '2-digit' }).format(date);
            const ti = new Intl.DateTimeFormat('th', { hour: 'numeric', minute: 'numeric' }).format(date);
            return (
                <Col sm={3} className="d-flex align-items-center align-middle justify-content-center" style={{ paddingBottom: 15 }} key={index}>
                    <Card>
                        <CardImg top src={detail?.keyImages.filter(images => images.type === "Thumbnail")[0]?.url} alt={detail?.productName} />
                        {
                            !detail.purchasable ?
                                <CardImgOverlay className="d-flex align-items-center justify-content-center">
                                    <span style={{ marginBottom: 70 }}>
                                        <span className="d-flex justify-content-center">
                                            <CheckCircle size={'80px'} color={"#4fdf6f"} />
                                        </span>
                                        <br />
                                        <CardText style={{ fontSize: '18px', opacity: 1, color: '#fff' }}>ALREADY CLAIM</CardText>
                                    </span>
                                </CardImgOverlay> : null
                        }
                        <CardBody>
                            <CardTitle>{detail?.productName}</CardTitle>
                            <CardText>ฟรีแล้ววันนี้ - {`${mo} ${da} เวลา ${ti}`}</CardText>
                        </CardBody>
                    </Card>
                </Col>
            )
        })
    }

    render() {
        const { freeGames, user } = this.state;
        const { userPresent } = this.props;
        return (
            <>
                {
                    freeGames && user && userPresent ?
                        <Container fluid={true} style={{ padding: 0, height: '100%' }}>
                            <div className="content">
                                <Row className="justify-content-center" style={{ margin: "20px" }}>
                                    <div className="greet-text">
                                        {'  '}Hello {user?.userInfo?.displayName?.value}! {'  '}
                                    </div>
                                </Row>
                                <div className="d-flex align-items-center align-middle">
                                    <Row className="justify-content-center">
                                        {freeGames ? this.renderCard(freeGames) : null}
                                    </Row>
                                </div>
                            </div>
                        </Container> :
                        <Loading />
                }
            </>
        );
    }
}

export default withRouter(
    connect(mapStateToProps)(Captcha)
);