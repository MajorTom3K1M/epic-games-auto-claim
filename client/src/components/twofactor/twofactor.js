import React, { useState } from 'react';
import Logo from '../../images/epic-auto-claim.png';
import ReactInputVerificationCode from 'react-input-verification-code';
import { connect } from 'react-redux';
import { userDispatch } from '../../redux/login/actions';
import { history } from '../../helpers';
import { withRouter } from 'react-router-dom';
import { loginService } from '../../utils/services';

import '../app/app.css';
import '../twofactor/twofactor.css';

const TwoFactor = (props) => {
    const [isLoading, setLoading] = useState(false);
    const [code, setCode] = useState(null);

    const onChange = (number) => {
        setCode(number);
        const element = document.getElementsByClassName("ReactInputVerificationCode__item")
        for (let i = 0; i < element.length; i++) {
            if (element[i].innerHTML) {
                let classLs = element[i].classList;
                if (!classLs.contains("haveInput")) {
                    element[i].classList.add("haveInput");
                }
            } else {
                element[i].classList.remove("haveInput");
            }
        }
    }

    const onSubmit = () => {
        if (props.location.state) {
            var { email, method } = props.location.state;
        }
        setLoading(true);
        loginService.loginMfa(email, code, method)
            .then(({ statusText }) => {
                setLoading(false);
                props.userDispatch(email);
                history.push("/profile", { email });
                // if (statusText === "OK") {
                // }
            })
            .catch((e) => {
                setLoading(false);
                history.push("/");
            });
    }

    const isEnable = () => {
        if (code && code.length >= 6 && !isLoading) {
            return "MuiButtonBase-root MuiButton-root MuiButton-contained SubmitButton MuiButton-containedPrimary MuiButton-fullWidth";
        }
        return "MuiButtonBase-root MuiButton-root MuiButton-contained SubmitButton MuiButton-containedPrimary MuiButton-fullWidth Mui-disabled";
    };

    return (
        <div className="modalbase-container">
            <div className="modalbase-content">
                <div className="modalbase-card">
                    <div className="optional-top-spacer"></div>
                    <div className="modalbase-card-content">
                        <div className="layout-vertical">
                            <div className="epiclogo-layout">
                                <img src={Logo} alt="Logo" className="EpicLogo" style={{ width: 130, height: 50 }} />
                            </div>
                            <h6 className="d-flex justify-content-center MuiTypography-root Subheading upper center MuiTypography-subtitle1">Enter the security code to continue</h6>
                            <form className="form-vertical" onSubmit={e => e.preventDefault()}>
                                <div className="MuiFormControl-root form-field masked-code MuiFormControl-fullWidth" style={{ backgroundColor: 'inherit' }}>
                                    <div className="custom-styles">
                                        <ReactInputVerificationCode
                                            id="input-verification-code"
                                            placeholder=""
                                            onChange={onChange}
                                            length={6}
                                        />
                                    </div>
                                </div>
                                <div className="controls-horizontal" style={{ marginTop: '30px' }}>
                                    <button
                                        className="MuiButtonBase-root MuiButton-root MuiButton-contained CancelButton MuiButton-containedSecondary MuiButton-fullWidth"
                                        type="button"
                                        id="cancel"
                                    >
                                        <span className="MuiButton-label">Cancel</span>
                                    </button>
                                    <div className="Spacer" style={{ width: '100%', height: '0px', maxWidth: '25px', maxHeight: '0px' }}></div>
                                    <button
                                        className={isEnable()}
                                        type="submit"
                                        id="continue"
                                        onClick={onSubmit}
                                    >
                                        {!isLoading ? <span className="MuiButton-label">Continue</span> : null}
                                        {isLoading ? <i style={{ fontSize: 20 }} className="fa fa-circle-o-notch fa-spin"></i> : null}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="optional-bottom-spacer"></div>
                </div>
            </div>
        </div>
    );

}

export default withRouter(
    connect(null, { userDispatch })(TwoFactor)
);