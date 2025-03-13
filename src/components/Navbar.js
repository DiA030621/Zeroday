import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaHouse, FaCartShopping, FaHandHoldingDollar} from "react-icons/fa6";
import Logo from "../Logo.png";
import React from "react";

const NavbarComponent = () => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary navbar">
            <Container>
                <Navbar.Brand href="/" className="nav-item rubik-400 logo-container">
                    <img src={Logo} alt="logo" className="img-fluid"/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/"><FaHouse className="me-2"/>Inicio</Nav.Link>
                        <Nav.Link href="/sale"><FaCartShopping className="me-2"/>Comprar</Nav.Link>
                        <Nav.Link href="/purchase"><FaHandHoldingDollar className="me-2"/>Mis Compras</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;