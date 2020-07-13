import React, {Component} from 'react';
//import {contents} from './BarGraphScriptContents.js'
import {FileDropZone} from './FileDropZone.js'
import './App.css'
import * as d3module from 'd3'
import d3tip from 'd3-tip'
const d3 = {
  ...d3module,
  tip: d3tip
}


export class BarGraph extends Component {
	constructor(props) {
		super(props);
        this.state = {graphDrawn: false}
	}

	componentDidMount() {
        this.drawGraph();
	}
    
    drawGraph() {
        var margin = {top: 40, right: 20, bottom: 30, left: 40};
        var width = 960 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;

        var formatPercent = d3.format(".0%");

        var x = d3.scaleBand()
            .rangeRound([0, width], .1);

        var y = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom(x);
  

        var yAxis = d3.axisLeft(y)
            .tickFormat(formatPercent);

        var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span><br/><br/>"
                + "<strong>Earnings:</strong> <span style='color:red'>" + d.earnings + "</span><br/><br/>"
                + "<strong>Name:</strong> <span style='color:red'>" + d.name + "</span>";
        })

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);

        var data = d3.csvParse(`letter,frequency,earnings,name
                A,.08167,18,"Microsoft"
                B,.01492,256,"Google"
                C,.02780,562,"Mathworks"
                D,.04253,5665,"Hello"`);
        
            console.log("data is");
            console.log(data);
            x.domain(data.map(function(d) { return d.letter; }));
            y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Frequency");

            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.letter); })
                .attr("width", x.bandwidth())
                .attr("y", function(d) { console.log("y is"); console.log(d); return y(d.frequency); })
                .attr("height", function(d) { return height - y(d.frequency); })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)


        function type(d) {
            d.frequency = +d.frequency;
            return d;
        }
    }

	render() {
        return (
                <>
                    
                </>
        );
	}
}