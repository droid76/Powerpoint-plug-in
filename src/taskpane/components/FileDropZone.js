import React, {useCallback, useState, Component} from 'react';
import Dropzone, {useDropzone} from 'react-dropzone';
import { readString } from 'react-papaparse'
import { Dropdown, Container, Row, Col, Button } from 'react-bootstrap'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import './App.css'

// For Graph Only
import * as d3module from 'd3'
import d3tip from 'd3-tip'
const d3 = {
  ...d3module,
  tip: d3tip
}

// Animation for multi-select menu
const animatedComponents = makeAnimated();

// To store parsed rows of uploaded csv file
var fileContents = undefined;
var fileRows = undefined;
var headers = [];
var headerTypes = [];
var possibleYAxisValues = [];
var possibleXAxisValues = [];

const getUploadParams = () => {
    return { url: 'https://httpbin.org/post' }
}

const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta)
}

const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
}

const dropzoneStyle = {
    width  : "100%",
    height : "20%",
    border : "1px solid black"
};

export var FileDropZone = function() {
    // Declare a new state variable
    const [uploaded, setUploaded] = useState(false);
    const [xAxisValue, setXAxisValue] = useState("");
    const [yAxisValue, setYAxisValue] = useState("");
    const [tooltipValues, setTooltipValues] = useState([]);
    const [dropZoneText, setDropZoneText] = useState("Drag & drop CSV file, or click to select file");
    
    // To upload and read. file on drop
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
          const reader = new FileReader()
          reader.onabort = () => console.log('file reading was aborted')
          reader.onerror = () => console.log('file reading has failed')
          reader.onload = () => {
              // Store the uploaded file contents as a string
              fileContents = reader.result;
              
              // Parse the rows in the file and store it in fileRows
              fileRows = readString(reader.result, {
                          dynamicTyping: true,
                          header: true
                        });
              
              console.log("fileRows is");
              console.log(fileRows);
              
              // Set uploaded to true
              setUploaded(false);
              setUploaded(true);
              
              // Clear the existing menu options
              possibleYAxisValues = [];
              possibleXAxisValues = [];
              
              // Set dropZoneText
              setDropZoneText("Uploaded:" + file.name);
              localStorage.setItem('fileName', file.name);
          }
          reader.readAsText(file);
        })

    }, [])
    const {getRootProps, getInputProps} = useDropzone({onDrop})
    
    // Read the headers of the uploaded file
    var variables = <></>;
    if(uploaded == true) {
        headers = Object.keys(fileRows.data[0]);
        headerTypes = [];
        variables = <h1> Variables are {headers}</h1>;
        for(var i=0;i<headers.length;i++)
           headerTypes.push(typeof(fileRows.data[0][headers[i]]))
        
        // Get menu options for x and y axes
        possibleYAxisValues = [];
        possibleXAxisValues = [];
        for(var i=0;i<headers.length;i++) {
            if(headerTypes[i] == "number")
                possibleYAxisValues.push({ value: headers[i], label: headers[i] });
            possibleXAxisValues.push({ value: headers[i], label: headers[i] });
        }
        
        
    }
    
    // Function to handle x axis value change
    const changeXAxisValue = (selectedOption) => {
        setXAxisValue(selectedOption.label);
    }
    
    // Function to handle y axis value change
    const changeYAxisValue = (selectedOption) => {
        setYAxisValue(selectedOption.label);
    }
    
    // Function to handle tooltip values
    const changeTooltipValues = (selectedOptions) => {
        var labels = [];
        for(var i=0;i<selectedOptions.length;i++)
            labels.push(selectedOptions[i].label);
        setTooltipValues(labels);
        console.log("labels is ");
        console.log(labels);
    }
    
    // Function to plot graph on click
    const plotGraph = () => {
        // First delete the existing SVG elements
        d3.selectAll("svg").remove();
        
        var margin = {top: 40, right: 20, bottom: 30, left: 40};
        var width = window.innerWidth - margin.left - margin.right;
        var height = window.innerHeight - margin.top - margin.bottom;

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
            var tooltipContent = "";
            for(var j=0;j<tooltipValues.length;j++){
                tooltipContent += "<strong>"+tooltipValues[j]+":</strong> <span style='color:red'>" + d[tooltipValues[j]] + "</span>";
                if(j!=tooltipValues.length - 1)
                    tooltipContent += "<br/><br/>";
            }
            return tooltipContent;
        })

        var svg = d3.select("div.barGraph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);

        var data = d3.csvParse(fileContents);
        
            console.log("data is");
            console.log(data);
            x.domain(data.map(function(d) { return d[xAxisValue]; }));
            y.domain([0, d3.max(data, function(d) { return d[yAxisValue]; })]);

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
                .text(yAxisValue);

            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d[xAxisValue]); })
                .attr("width", x.bandwidth())
                .attr("y", function(d) { console.log("yaxis value is"); console.log(yAxisValue); console.log(d); return y(d[yAxisValue]); })
                .attr("height", function(d) {console.log("height is"); console.log(height - y(d[yAxisValue])); return height - y(d[yAxisValue]); })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)


        function type(d) {
            d[yAxisValue] = +d[yAxisValue];
            return d;
        }

        // Save state locally (persistent)
        localStorage.setItem('fileContents', fileContents);
        localStorage.setItem('fileRows', fileRows);
        localStorage.setItem('headers', headers);
        localStorage.setItem('headerTypes', headerTypes);
        localStorage.setItem('possibleYAxisValues', possibleYAxisValues);
        localStorage.setItem('possibleXAxisValues', possibleXAxisValues);
        localStorage.setItem('uploaded', uploaded);
        localStorage.setItem('xAxisValue', xAxisValue);
        localStorage.setItem('yAxisValue', yAxisValue);
        localStorage.setItem('tooltipValues', tooltipValues);
        localStorage.setItem('dropZoneText', dropZoneText);
    }
    
    // Create menu items
    var menus = <>
                        <Row>
                            <Col>Choose Variable to be shown on X Axis</Col>
                            <Col><Select options={possibleXAxisValues} onChange={changeXAxisValue}/></Col>
                        </Row>
                        <Row>
                            <Col>Choose Variable to be shown on Y Axis</Col>
                            <Col><Select options={possibleYAxisValues} onChange={changeYAxisValue}/></Col>
                        </Row>
                        <Row>
                            <Col>Choose Variable to be shown in Tooltip</Col>
                            <Col>
                                <Select options={possibleXAxisValues}
                                onChange={changeTooltipValues}
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti/>
                            </Col>
                        </Row>
                        <Row>
                            <Button variant="primary" onClick={plotGraph}>Plot</Button>{' '}
                        </Row>
                        <Row>
                            <div className="barGraph"/>
                        </Row>
                </>;
    
    // Return the Dropzone element
    const func= () => {
        readFromStorage();
    }
        return (
        <>
            <Container fluid="md">
                <Row>
                    <Col>
                        <Dropzone getUploadParams={getUploadParams}
                        onDrop={onDrop}
                        className="dropzone"
                        onChangeStatus={handleChangeStatus}
                        onSubmit={handleSubmit}
                        style={dropzoneStyle}>
                        {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject}) => {
                            return (
                                <div {...getRootProps()}>
                                  <input {...getInputProps()} />
                                  <span width="500" height="500">{isDragActive ? "📂" : "📁"}</span>
                                  <h5>{dropZoneText}</h5>
                                </div>
                            );
                        }}
                        </Dropzone>
                    </Col>
                </Row>
                {menus}
                {func()}
            </Container>
        </>
    )
}

// Read previously saved items if any
function readFromStorage()
{
    var fileName = localStorage.getItem('fileName');

    var uploaded, xAxisValue,  yAxisValue, tooltipValues, dropZoneText;
    if(fileName != null) {
        fileContents = localStorage.getItem('fileContents');
        fileRows = localStorage.getItem('fileRows');
        headers = localStorage.getItem('headers');
        headerTypes = localStorage.getItem('headerTypes');
        possibleYAxisValues = localStorage.getItem('possibleYAxisValues');
        possibleXAxisValues = localStorage.getItem('possibleXAxisValues');
        uploaded = localStorage.getItem('uploaded');
        xAxisValue = localStorage.getItem('xAxisValue');
        yAxisValue = localStorage.getItem('yAxisValue');
        tooltipValues = localStorage.getItem('tooltipValues');
        dropZoneText = localStorage.getItem('dropZoneText');
        // var h1 = document.createElement("h1");
        // h1.innerHTML = headers;
        // document.body.appendChild(h1);

        // Plot saved graph
        plotSavedGraph(fileName,uploaded, xAxisValue,  yAxisValue, tooltipValues, dropZoneText,fileContents,fileRows,headers,
            headerTypes,possibleXAxisValues,possibleYAxisValues);
    }
}

// Function to plot graph (using local storage if already saved)
const plotSavedGraph = (fileName,uploaded, xAxisValue,  yAxisValue, tooltipValues, dropZoneText,fileContents,fileRows,headers,
    headerTypes,possibleXAxisValues,possibleYAxisValues) => {
    // First delete the existing SVG elements
    d3.selectAll("svg").remove();
    // var h1 = document.createElement("h1");
    //     h1.innerHTML = xAxisValue;
    //     document.body.appendChild(h1);
    var margin = {top: 40, right: 20, bottom: 30, left: 40};
    var width = window.innerWidth - margin.left - margin.right;
    var height = window.innerHeight - margin.top - margin.bottom;

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
        var tooltipContent = "";
        for(var j=0;j<tooltipValues.length;j++){
            tooltipContent += "<strong>"+tooltipValues[j]+":</strong> <span style='color:red'>" + d[tooltipValues[j]] + "</span>";
            if(j!=tooltipValues.length - 1)
                tooltipContent += "<br/><br/>";
        }
        return tooltipContent;
    })

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var h1 = document.createElement("h1");
        h1.innerHTML = xAxisValue;
        document.body.appendChild(h1);

    svg.call(tip);

    var data = d3.csvParse(fileContents);
    
        console.log("data is");
        console.log(data);
        x.domain(data.map(function(d) { return d[xAxisValue]; }));
        y.domain([0, d3.max(data, function(d) { return d[yAxisValue]; })]);

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
            .text(yAxisValue);

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d[xAxisValue]); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { console.log("yaxis value is"); console.log(yAxisValue); console.log(d); return y(d[yAxisValue]); })
            .attr("height", function(d) {console.log("height is"); console.log(height - y(d[yAxisValue])); return height - y(d[yAxisValue]); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)


    function type(d) {
        d[yAxisValue] = +d[yAxisValue];
        return d;
    }
}