import React from 'react';
import Loading from '../loading';
import { connect } from 'react-redux';
import { userDispatch } from '../../redux/login/actions';
import { withRouter } from 'react-router-dom';
import { EpicArkosePublicKey } from '../../utils/constants';
import { loginService } from '../../utils/services';
import { history } from '../../helpers';
import loadScript from '../../helpers/load-script';
import removeScript from '../../helpers/remove-script';
import {
    Container, Row
} from 'reactstrap';

class Captcha extends React.Component {
    state = {
        loading: false
    }
    componentDidMount() {
        loadScript(
            document,
            'script',
            'fun-captcha',
            'https://cdn.arkoselabs.com/fc/js/96677ba21f0e74ba2a358a3053d33cd9/standard/funcaptcha_api.js',
            () => {
                this.scriptLoaded();
            });
    }

    scriptLoaded() {
        this.setState({ loading: true });
        if (this.props.location.state) {
            var { email, password } = this.props.location.state;
        }
        new window.FunCaptcha({
            public_key: EpicArkosePublicKey.LOGIN,
            target_html: "CAPTCHA",
            callback: (sessionData) => {
                loginService.login(email, password, sessionData)
                    .then(({ statusText }) => {
                        this.props.userDispatch(email);
                        history.push("/profile", { email });
                    }).catch((e) => {
                        if (
                            e.response.data.errorCode === 'errors.com.epicgames.common.two_factor_authentication.required'
                        ) {
                            const method = e.response.data.metadata.twoFactorMethod;
                            history.push("/twofactor", { email, password, method });
                        } else {
                            history.push("/");
                        }
                    });
            }
        });
    }

    componentWillUnmount() {
        removeScript(document, 'fun-captcha');
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