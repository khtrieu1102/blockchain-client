import React, { useState, useEffect, Fragment } from 'react';
import EmployeeHeaderNavbar from './nav-bar';
import EmployeeCustomSidebar from './custom-side-bar';
import { Jumbotron, Container, Col, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import './layout.scss';
import { useLocation } from 'react-router';
import _const from '../assets/const';
import actionCreators from '../redux/action-creators';
import appConfig from '../../appConfig.json';

const UsersLayout = (props) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const currentUserReducer = useSelector((state) => state.currentUserReducer);
    const { username } = currentUserReducer.currentUser;
    const [menuCollapse, setMenuCollapse] = useState(false);
    const [activeMenu, setActiveMenu] = useState(false);

    useEffect(() => {
        const pathName = location.pathname;
        if (pathName === '/') {
            setActiveMenu(pathName);
        }
        const elements = pathName.split('/');
        if (pathName !== activeMenu && elements[1]) {
            setActiveMenu(`/${elements[1]}`);
        }
    }, [location.pathname, activeMenu]);

    return (
        <Fragment>
            {/* <SideBar /> */}
            <EmployeeHeaderNavbar username={username} />
            <Jumbotron fluid className="jumbo">
                <Container className="text-center">
                    <h1 style={{ color: 'white' }}>
                        {username ? username.toUpperCase() : 'LOGIN TO YOUR WALLET NOW'}
                    </h1>
                    {<p>Blockchain - HCMUS - 2021</p>}
                </Container>
            </Jumbotron>

            <Container fluid style={{ width: '70%' }}>
                <Row className="justify-content-md-center">
                    <Col lg={12}>{props.children}</Col>
                </Row>
            </Container>
        </Fragment>
    );
};

export default UsersLayout;
