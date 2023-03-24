import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';

//import SignUpForm from './SignupForm';
//import LoginForm from './LoginForm';

import Auth from './utils/auth';

const AppNavbar = () => {
    // set modal display state
    // const [showModal, setShowModal] = useState(false);

    const logout = (event) => {
        event.preventDefault();
        Auth.logout();
    };

    return (
        <>
            <Navbar bg='dark' variant='dark' expand='lg'>
                <Container fluid>
                    <Navbar.Brand as={Link} to='/'>
                        Google Books Search
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls='navbar' />
                    <Navbar.Collapse id='navbar' className='d-flex flex-row-reverse'>
                        <Nav className='ml-auto d-flex'>
                            <Nav.Link as={Link} to='/'>
                                Search For Books
                            </Nav.Link>
                            {/* if user is logged in show saved books and logout option */}
                            {Auth.loggedIn() ? (
                                <>
                                    <Nav.Link as={Link} to='/saved'>
                                        See Your Books
                                    </Nav.Link>
                                    <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                                </>
                            ) : (
                                <>
                                    <Link className="btn btn-lg btn-info m-2" to="/login">
                                        Login
                                    </Link>
                                    <Link className="btn btn-lg btn-light m-2" to="/signup">
                                        Signup
                                    </Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default AppNavbar;