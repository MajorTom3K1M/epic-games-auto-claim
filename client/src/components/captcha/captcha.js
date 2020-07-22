import React from 'react';
import Loading from '../loading';
import { connect } from 'react-redux';
import { userDispatch } from '../../redux/login/actions';
import { withRouter } from 'react-router-dom';
import { EpicArkosePublicKey } from '../../utils/constants';
import { loginService } from '../../utils/services';
import { history } from '../../helpers';
import {
    Container, Row
} from 'reactstrap';

function setupEnforcement(myEnforcement) {
    console.log(myEnforcement)
}

class Captcha extends React.Component {
    state = {
        loading: false,
        sessionData: null
    }
    componentDidMount() {
        // console.log("Now it comes", new Arkose())
        // if (window.FunCaptcha) {
        //     this.scriptLoaded();
        // } else {
        // const script = document.getElementById("funcaptcha")
        // script.onload = () => this.scriptLoaded();
        // }
        console.log(this.state);

        setTimeout(() => {
            this.scriptLoaded();
        }, 1000);
    }
    componentDidUpdate(prevState) {
        const { sessionData } = this.state;

        // setTimeout(() => {
        //     this.scriptLoaded();
        // }, 1000);

        if (this.props.location.state) {
            var { email, password } = this.props.location.state;
        }
        // if (sessionData && prevState.sessionData !== sessionData) {
        //     loginService.login(email, password, sessionData)
        //         .then(({ statusText }) => {
        //             if (statusText === "OK") {
        //                 this.props.userDispatch(email);
        //                 history.push("/profile", { email });
        //             }
        //         }).catch((e) => {
        //             // console.log("error wtf", e)
        //             if (
        //                 e.response.data.errorCode === 'errors.com.epicgames.common.two_factor_authentication.required'
        //             ) {
        //                 const method = e.response.data.metadata.twoFactorMethod;
        //                 history.push("/twofactor", { email, password, method });
        //             } else {
        //                 history.push("/");
        //             }
        //         });
        // }
    }

    scriptLoaded() {
        this.setState({ loading: true });
        // console.log(this.props.location.state)
        if (this.props.location.state) {
            var { email, password } = this.props.location.state;
        }

        let obj = new window.FunCaptcha({
            public_key: EpicArkosePublicKey.LOGIN,
            target_html: "CAPTCHA",
            callback: (sessionData) => {
                // this.setState({ sessionData });
                // this.setState({ loading: false });
                console.log("CAPTCHA!!!!")

                loginService.login(email, password, sessionData)
                    .then(({ statusText }) => {
                        if (statusText === "OK") {
                            this.props.userDispatch(email);
                            history.push("/profile", { email });
                        }
                    }).catch((e) => {
                        // console.log("error wtf", e)
                        if (
                            e.response.data.errorCode === 'errors.com.epicgames.common.two_factor_authentication.required'
                        ) {
                            const method = e.response.data.metadata.twoFactorMethod;
                            history.push("/twofactor", { email, password, method });
                        } else {
                            window.location.path = '/';
                        }
                    });
            console.log(obj);
                // try {
                //     const { statusText } = await loginService.login(email, password, sessionData);
                //     console.log("IT OK BUT NOT SEND ANY.");
                //     if (statusText === "OK") {
                //         history.push("/profile", { email });
                //     }
                // } catch (e) {
                //     history.push("/");
                // }
                // loginService.login(email, password, sessionData)
                //     .then(({ statusText }) => {
                //         console.log("IT OK BUT NOT SEND ANY.")
                //         if (statusText === "OK") {
                //             history.push("/profile", { email });
                //         }
                //     }).catch((e) => {
                //         // console.log("error wtf", e)
                //         history.push("/");
                //     });
            }
        });
    }

    render() {
        const { loading } = this.state;
        return (
            <Container style={{ padding: 0, height: '100%' }}>
                {
                    loading ?
                        <span style={{ padding: 0, height: '100%' }} className="d-flex justify-content-center">
                            <Row className="align-items-center align-middle">
                                <div id="CAPTCHA"></div>
                            </Row>
                        </span>
                        : <Loading />
                }
            </Container>
        );
    }
}

export default withRouter(
    connect(null, { userDispatch })(Captcha)
);