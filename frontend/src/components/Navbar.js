import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import './Navbar.css';

const SimpleNavbar = () => {
  return (
    <Navbar bg="light" expand="lg" className="sticky-top">
      <Container>
        <Navbar.Brand href="#">Transaction Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <a href="/" className="nav-link">Home</a>
            <a href="/about" className="nav-link">Transaction</a>
            <a href="/contact" className="nav-link">About Transaction</a>
            {/* Add more links as needed */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default SimpleNavbar;
