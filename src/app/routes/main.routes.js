import React, { lazy } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Layout from '../layout/layout';

const main_routes = [
    {
        path: '/',
        component: lazy(() => import('../views/dashboard.view')),
        exact: true,
    },
    {
        path: '/login',
        component: lazy(() => import('../views/login.view')),
    },
    {
        path: '/register',
        component: lazy(() => import('../views/register.view')),
    },
    {
        path: '/blockchain',
        component: lazy(() => import('../views/blockchain.view')),
    },
    {
        path: '*',
        component: lazy(() => import('../views/others/page-not-found-view')),
    },
];

const EmployeeScreens = ({ isAuthenticated }) => {
    return (
        <Router>
            <Layout>
                <Switch>
                    {isAuthenticated && (
                        <Route exact path="/login">
                            <Redirect to="/" />
                        </Route>
                    )}
                    {main_routes.map((item, index) => {
                        return (
                            <Route
                                key={index}
                                path={item.path}
                                exact={item.exact ? item.exact : null}
                                component={(props) => <item.component {...props} {...item.props} />}
                            />
                        );
                    })}
                </Switch>
            </Layout>
        </Router>
    );
};

export default EmployeeScreens;
