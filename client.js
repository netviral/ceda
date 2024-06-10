fetch('http://localhost:3000/api')
  .then(response => response.json())
  .then(data => {
    let margin = { top: 20, right: 30, bottom: 60, left: 60 };
    let width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select('#chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Filter out data points with y-value of 0
    data = data.filter(d => d.y !== 0);

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.x)))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y) * 1]) // Adjusted domain with a wider range
      .range([height, 0]);

    // Add x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Add y-axis
    const yAxis = svg.append('g')
      .call(d3.axisLeft(yScale));

    // Add circles for data points with tooltips
    const circles = svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(new Date(d.x)))
      .attr('cy', d => yScale(d.y))
      .attr('r', 2)
      .attr('fill', 'steelblue');

    // Append title element for tooltips
    circles.append('title')
      .text(d => d.type.Indicator); // Set the tooltip text to the value of type.Indicator
  })
  .catch(error => console.error('Error fetching data:', error));
