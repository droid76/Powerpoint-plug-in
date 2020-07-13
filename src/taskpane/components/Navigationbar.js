import React, { Component, Fragment } from 'react';
import ReactDOM from "react-dom";
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"
import Form from "react-bootstrap/Form"
import FormControl from "react-bootstrap/FormControl"
import Button from "react-bootstrap/Button"
import './App.css';
import Select from 'react-select';
import AsyncSelect from 'react-select/async'
import { Link, NavLink } from 'react-router-dom'
 
class Navigationbar extends React.Component
{
    constructor()
    {
        super()
        this.state={}
    } 
    
    render()
    {
        return(
                <Navbar expand="lg" className="blueGradient">
                <Navbar aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link as={NavLink} exact to="/" activeClassName="active" className="inactive left-nav link" >Home</Nav.Link>
                <Nav.Link as={NavLink} exact to="/Bargraph" activeClassName="active" className="inactive left-nav link" >Bargraph</Nav.Link>
                <Nav.Link as={NavLink} exact to="/Linegraph" activeClassName="active" className="inactive left-nav link" >Linegraph</Nav.Link>
                <Nav.Link as={NavLink} exact to="/Scattergraph" activeClassName="active" className="inactive left-nav link"> Scattergraph</Nav.Link>
                <Nav.Link as={NavLink} exact to="/Piechart" activeClassName="active" className="inactive left-nav link" >Piechart</Nav.Link> 
                </Nav>
                </Navbar.Collapse>
                </Navbar>
            );
    }
}
 
export default Navigationbar;