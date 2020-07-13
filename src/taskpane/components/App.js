import * as React from "react";
import './App.css';
import Home from "./Home.js"
import Bargraph from "./Bargraph.js"
import Linegraph from "./Linegraph.js"
import Scattergraph from "./Scattergraph.js"
import Piechart from "./Piechart.js"
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Progress from "./Progress";
import Navigationbar from './Navigationbar';
/* global Button, console, Header, HeroList, HeroListItem, Office, Progress */

export default class App extends React.Component {
  
  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    return (
     <div className="App">
       <Navigationbar/>
          <h1>Graph Plot</h1>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/Bargraph" component={Bargraph}/>
            <Route path="/Linegraph" component={Linegraph}/>
            <Route path="/Scattergraph" component={Scattergraph}/>
            <Route path="/Piechart" component={Piechart}/>
          </Switch>
      </div>
    );
  }
}
