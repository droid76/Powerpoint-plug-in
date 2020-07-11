import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Link,NavLink } from 'react-router-dom'
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"

class Home extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            imgArr : [['https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Free_PSA_bar_graph.svg/1134px-Free_PSA_bar_graph.svg.png',"Bar Graph","/Bargraph"],['https://cdn.ablebits.com/_img-blog/line-graph/line-graph-excel.png',"Line Graph","/Linegraph"],['https://www.mathworks.com/help/examples/matlabmobile/win64/Scatter3DPlotExample_01.png',"Scatter Graph","/Scattergraph"],['https://d2mvzyuse3lwjc.cloudfront.net/doc/en/UserGuide/images/2D_B_and_W_Pie_Chart/2D_B_W_Pie_Chart_1.png?v=83139',"Pie Chart","/Piechart"]]
      };
    }
    componentDidMount() {
      
    }
  
    render(){
           let imgArr = this.state.imgArr;
           const images = imgArr.map((url) => {
               return(
                   // eslint-disable-next-line react/jsx-key
                   <div className="graph-home">
                       <Nav.Link as={NavLink} exact to={url[2]} ><img className="singleimage" src ={url[0]}/>
                        <h3>{url[1]}</h3></Nav.Link>
                        
                   </div>
               )
           })
           console.log(images)
           return(
               <div className="Images">
                   {images}
               </div>
           )     
    }
  }
  
  export default Home;