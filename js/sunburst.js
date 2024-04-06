export const sunburst = (parent, props) => {
    const {
        data,
        margin,
        convertDataToHierarchy,
    } = props;

    const width = +parent.attr('width');
    const height = +parent.attr('height');
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const radius = Math.min(width, height) / 3;
    var colour = d3.scaleOrdinal(d3.schemeAccent.slice(0,5))
        .domain(["White","Asian","Black","Mixed","Other"]);
    var data_2021 = data.filter(d => (d.date == 2021))[0]
    var data_2011 = data.filter(d => (d.date == 2011))[0]

    console.log(data_2021)

    const sburst = parent.selectAll('.sunburst').data([null])
    const sburstEnter = sburst
        .enter().append('g')
            .attr('class', 'sunburst')
            .attr('transform', `translate(${margin.left},${margin.top+20})`)

    const chartTitle = sburstEnter.merge(sburst).selectAll('.chartTitle').data([null])
    const chartTitleEnter = chartTitle
        .enter().append('text')
        .attr('class', 'chartTitle')
        .attr('transform', `translate(0,20)`)
        .text(`${data_2021.geography}:`)

    const legend = d3.legendColor()
        .scale(colour)
    const chartLegend = sburstEnter.merge(sburst).selectAll('.chartLegend').data([null])
    const chartLegendEnter = chartLegend
        .enter().append('g')
        .attr('class', 'chartLegend')
        .attr('transform', `scale(1.25) translate(400,100)`)
    chartLegendEnter.append('text')
        .attr('class', 'chartLegendText')
        .attr('dx', '-20')
        .attr('dy', '-15')
        .text("Legend:")
    chartLegendEnter.call(legend)

    var data_2021_no_WB = convertDataToHierarchy(data_2021, false)
    var data_2011_no_WB = convertDataToHierarchy(data_2011, false)
    data_2021 = convertDataToHierarchy(data_2021, true)
    data_2011 = convertDataToHierarchy(data_2011, true)
    //console.log(data_2021)
    //console.log(data_2021_no_WB)


    const chart = sburstEnter.merge(sburst).selectAll('.chart').data([null])
    const chartEnter = chart
        .enter().append('g')
        .attr('class', 'chart')
        .attr('transform', `translate(${innerWidth/2 - 100},${innerHeight/2})`)
    
    var partition = d3.partition()
        .size([Math.PI, radius]);

    var root_2021 = d3.hierarchy(data_2021)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value)
    partition(root_2021);

    var root_2011 = d3.hierarchy(data_2011)
        .sum(d => d.value)
        .sort((a, b) => a.value - b.value)
    partition(root_2011);

    //console.log(root_2021)

    var arc_2011 = d3.arc()
        .startAngle(d => d.x0 + Math.PI)
        .endAngle(d => d.x1 + Math.PI)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius / 2)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1 - 1);

    var arc_2021 = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius / 2)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1 - 1);

    const chartLeft = chartEnter.merge(chart).selectAll('.chartLeft').data([null])
    const chartLeftEnter = chartLeft
        .enter().append('g')
        .attr('transform', `translate(-5,0)`)
        .attr('class', 'chartLeft')

    const chartRight = chartEnter.merge(chart).selectAll('.chartRight').data([null])
    const chartRightEnter = chartRight
        .enter().append('g')
        .attr('transform', `translate(5,0)`)
        .attr('class', 'chartRight')
    
    chartLeftEnter.selectAll('path')
        .data(root_2011.descendants())
        .enter()
        .append('path')
        .attr("display", d => d.depth ? null : "none")
        .attr("d", arc_2011)
        .style('stroke', '#fff')
        .style("fill", d => colour((d.children ? d : d.parent).data.name));
    chartLeft.exit().remove

    chartRightEnter.selectAll('path')
        .data(root_2021.descendants())
        .enter()
        .append('path')
        .attr("display", d => d.depth ? null : "none")
        .attr("d", arc_2021)
        .style('stroke', '#fff')
        .style("fill", d => colour((d.children ? d : d.parent).data.name));
    chartRight.exit().remove()
};