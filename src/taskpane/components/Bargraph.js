import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Link,NavLink } from 'react-router-dom'
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"
import {contents} from './BargraphScriptContents.js'


class Bargraph extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            
      };
    }
    
    componentDidMount() {
        const s = document.createElement('script'); 
        s.type = 'text/javascript';
        s.async = true;
        s.innerHTML = contents;
        console.log(s);
        this.instance.appendChild(s);
    }
  
    render(){
        return(
            <div>
                <h1>Bargraph Page</h1>
                <div ref={el => (this.instance = el)} />
            </div>
        );      
    }
  }
  
  export default Bargraph;