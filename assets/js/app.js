
var svgWidth = 700;
var svgHeight = 500;

var margin = {
  top: 25,
  right: 25,
  bottom: 60,
  left: 55
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("data/data.csv")
  .then(function(chartData) {


    chartData.forEach(function(data) {
      data.age = +data.age;
      data.smoke = +data.smoke;
    });


    var xLinScale = d3.scaleLinear()
      .domain([30, d3.max(chartData, d => d.age)])
      .range([0, width]);

    var yLinScale = d3.scaleLinear()
      .domain([5, d3.max(chartData, d => d.smoke)])
      .range([height, 0]);


    var bottomAxis = d3.axisBottom(xLinScale);
    var leftAxis = d3.axisLeft(yLinScale);


    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);


    var circlesGroup = chartGroup.selectAll("circle")
    .data(chartData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinScale(d.age))
    .attr("cy", d => yLinScale(d.smoke))
    .attr("r", "15")
    .attr("fill", "green")
    .attr("opacity", ".5");


  chartGroup.append("text")
  .style("text-anchor", "middle")
  .style("font-size", "10px")
  .selectAll("tspan")
  .data(chartData)
  .enter()
  .append("tspan")
      .attr("x", function(data) {
          return xLinScale(data.age - 0);
      })
      .attr("y", function(data) {
          return yLinScale(data.smoke - 0.2);
      })
      .text(function(d){
        return (`${d.abbr}`)
      });


    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`ID: ${d.id}<br>Age: ${d.age}<br>Smoke: ${d.smoke}`);
      });


    chartGroup.call(toolTip);

 
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })

      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });


    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left )
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smoke (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width/2}, ${height + margin.top +30})`)
      .attr("class", "axisText")
      .text("Age");
  });