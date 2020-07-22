import React from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const mapStateToProps = ({ user: { userPresent } }) => ({
    userPresent
});

const Protected = ({ userPresent, path, component: Component }) => {
    return (
        <Route
            path={path}
            render={props => (
                props?.location?.state?.email ?
                    <Component {...props} /> : 
                    (
                        userPresent ?
                            <Redirect to='/profile' /> :
                            <Redirect to='/' />
                    )
            )}
        />
    )
}

const Auth = ({ userPresent, path, component: Component }) => (
    <Route
        exact
        path={path}
        render={props => (
            userPresent ?
                <Component {...props} /> :
                <Redirect to='/' />
        )}
    />
);

const OnlyNotAuth = ({ userPresent, path, component: Component }) => (
    <Route
        exact
        path={path}
        render={props => (
            userPresent ?
                <Redirect to='/profile' /> :
                <Component {...props} />
        )}
    />
);

export const ProtectedRoute = withRouter(
    connect(mapStateToProps)(Protected)
);

export const AuthRoute = withRouter(
    connect(mapStateToProps)(Auth)
);

export const OnlyNotAuthRoute = withRouter(
    connect(mapStateToProps)(OnlyNotAuth)
);

