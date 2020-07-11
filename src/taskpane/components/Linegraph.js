import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Link,NavLink } from 'react-router-dom'
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"


class Linegraph extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            
      };
    }
    
    componentDidMount() {
      
    }
  
    render(){
            console.log("bargraph")
             return(
               <div>
                  <h1>Linegraph Page</h1>
               </div>
             )
             
                
    }
  }
  
  export default Linegraph;