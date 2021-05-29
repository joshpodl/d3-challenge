// SVG dimensions
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(newsData) {

    // Step 1: Parse Data
    newsData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare= +data.healthcare;
      data.abbr= +data.abbr;  
    });

    // Step 2: Create scale functions
    var xScale = d3.scaleLinear()
      .domain(d3.extent(newsData.map(d => d.poverty)))
      .range([0, width])
      .nice();

    var yScale = d3.scaleLinear()
      .domain(d3.extent(newsData.map(d => d.healthcare)))
      .range([height, 0])
      .nice();

    // Step 3: Create axis functions
    var xAxis = d3.axisBottom(xScale).ticks(10);
    var yAxis = d3.axisLeft(yScale).ticks(10);

    // Step 4: Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // Step 5: Create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(newsData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "blue")
        .attr("opacity", "0.5")
        .on("mouseover", function(d, i) {
            toolTip.show(d, this)
        })
        .on("mouseout", function(d, i) {
            toolTip.hide(d, this)
        });
    
    // Step 6: Initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`<strong>${d.abbr}<strong><hr>Percent in Poverty: ${d.poverty} Percent Lacking Healthcare: ${d.healthcare}`);
    });

    // Step 7: Create tooltip in the chart
    chartGroup.call(toolTip);
    
    // Step 8: Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% in Poverty");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("% Lacking Healthcare");
    
    // Step 9: Catch error function
    }).catch(function(error) {
        console.log(error);
      });