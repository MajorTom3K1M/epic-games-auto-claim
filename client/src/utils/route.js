import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const mapStateToProps = ({ user: { userPresent } }) => ({
    userPresent
});

export const Protected = OriginalComponent => {
    const ProtectedComponent = ({ userPresent, location }) => (
        location?.state?.email ?
            <OriginalComponent /> :
            (
                userPresent ?
                    <Redirect to='/profile' /> :
                    <Redirect to='/' />
            )
    );
    return withRouter(
        connect(mapStateToProps)(ProtectedComponent)
    );
}

export const Auth = OriginalComponent => {
    const AuthComponent = ({ userPresent }) => (
        userPresent ?
            <OriginalComponent /> :
            <Redirect to='/' />
    );
    return withRouter(
        connect(mapStateToProps)(AuthComponent)
    );
}

export const OnlyNotAuth = OriginalComponent => {
    const OnlyNotAuthComponent = ({ userPresent }) => (
        userPresent ?
            <Redirect to='/profile' /> :
            <OriginalComponent />
    );
    return withRouter(
        connect(mapStateToProps)(OnlyNotAuthComponent)
    );
}