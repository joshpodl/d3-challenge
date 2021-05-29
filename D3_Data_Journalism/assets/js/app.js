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
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

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
      .domain([8.5, d3.max(newsData, d=> d.poverty*1.2)])
      .range([0, width]);

    var yScale = d3.scaleLinear()
      .domain([4.5, d3.max(newsData, d=> d.healthcare*1.2)])
      .range([height, 0]);

    // Step 3: Create axis functions
    var xAxis = d3.axisBottom(xScale).ticks(7);
    var yAxis = d3.axisLeft(yScale).ticks(11);

    // Step 4: Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // Step 5: Create circles with state abbreviation labels
    var circlesGroup = chartGroup.selectAll("circle")
        .data(newsData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "blue")
        .attr("opacity", "0.5");
    
    
    let stateTextGroup=chartGroup.selectAll(".stateText")
        .data(newsData)
        .enter()
        .append("text")
        .text(d=>d.abbr)
        .attr("x", (d=>xScale(d)))
        .attr("y", (d=>yLinearScale(d+5)))
        .attr("class","stateText")
        .attr("font-size", "10");
    
    // Step 6: Initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`<strong>${d.abbr}<strong><hr>Percent in Poverty: ${d.poverty} Percent Lacking Healthcare: ${d.healthcare}`);
    });

    // Step 7: Create tooltip in the chart
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(d, i) {
        toolTip.show(d, this);
    })
        .on("mouseout", function(d, i) {
            toolTip.hide(d);
        });
    
    // Step 9: Create axes labels
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
    
    // Step 10: Catch error function
    }).catch(function(error) {
        console.log(error);
      });