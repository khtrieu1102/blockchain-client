import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Button, Image, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
    FaPager,
    FaBuffer,
    FaLocationArrow,
    FaUserGraduate,
    FaHome,
    FaSignOutAlt,
    FaPenNib,
} from 'react-icons/fa';
import './nav-bar.scss';
import actionCreators from '../redux/action-creators';
import { useSelector, useDispatch } from 'react-redux';

const HeaderNavbar = (props) => {
    const dispatch = useDispatch();
    const { username } = props;
    const signOut = () => {
        dispatch(actionCreators.currentUser.deleteAllInformation());
        dispatch(actionCreators.authorization.signOut());
    };

    return (
        <Navbar collapseOnSelect expand="lg" bg="info" variant="dark" href="#x">
            <a to="/" href="#x">
                <Navbar.Brand>
                    <Link to="/" className="text-light mr-2">
                        SAPHASAN Chain
                    </Link>
                </Navbar.Brand>
            </a>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto"></Nav>
                <Nav>
                    <Nav.Link>
                        <Link to="/blockchain" className="text-light mr-2">
                            Blockchain
                        </Link>
                    </Nav.Link>
                    <Nav.Link>
                        <Link to="/transaction-pool" className="text-light mr-2">
                            TxPool
                        </Link>
                    </Nav.Link>
                    <Nav.Link>
                        <Link to="/transactions" className="text-light mr-2">
                            Transactions
                        </Link>
                    </Nav.Link>
                    <Nav.Link>
                        <Link to="/uTxO" className="text-light mr-2">
                            All uTxO
                        </Link>
                    </Nav.Link>
                    <Nav.Link>
                        <Link to="/notification" className="text-light mr-2">
                            <FaPenNib />
                        </Link>
                    </Nav.Link>
                    {username ? (
                        <Button eventKey={2} variant="danger" onClick={signOut}>
                            <FaSignOutAlt /> Logout
                        </Button>
                    ) : (
                        <Button eventKey={2} variant="primary" onClick={signOut}>
                            <Link to="/login" className="text-light mr-2">
                                <FaPager /> Log In
                            </Link>
                        </Button>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default HeaderNavbar;
