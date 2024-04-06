export const sunburst = (parent, props) => {
    const {
        data,
        margin,
        convertDataToHierarchy,
        excludeWB
    } = props;

    const width = +parent.attr('width');
    const height = +parent.attr('height');
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const radius = Math.min(width, height) / 3;
    var colour = d3.scaleOrdinal(d3.schemeAccent.slice(0,5))
        .domain(["White","Asian","Black","Mixed","Other"]);
    const data_2021 = data.filter(d => (d.date == 2021))[0]
    const data_2011 = data.filter(d => (d.date == 2011))[0]

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

    const excludeText = sburstEnter.merge(sburst).selectAll('.excludeText').data([null])
    const excludeTextEnter = excludeText
        .enter().append('text')
        .attr('class', 'excludeText')
        .attr('transform', `translate(0,500)`)
        .text("Exclude White British?")

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

    function chooseData(excludeWB) {
        if (excludeWB) {
            return [convertDataToHierarchy(data_2021, false), convertDataToHierarchy(data_2011, false)]
        } else {
            return [convertDataToHierarchy(data_2021, true), convertDataToHierarchy(data_2011, true)]
        }
    }

    const [chosen2021, chosen2011] = chooseData(excludeWB)

    const chart = sburstEnter.merge(sburst).selectAll('.chart').data([null])
    const chartEnter = chart
        .enter().append('g')
        .attr('class', 'chart')
        .attr('transform', `translate(${innerWidth/2 - 70},${innerHeight/2-50})`)
    
    var partition = d3.partition()
        .size([Math.PI, radius]);

    var root_2021 = d3.hierarchy(chosen2021)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value)
    partition(root_2021);

    var root_2011 = d3.hierarchy(chosen2011)
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

    chartEnter.append('rect')
        .attr('transform', 'translate(-5,-200)')
        .attr('width', '10')
        .attr('height', radius*2)
        .attr('fill', 'gray')

    const chartLeft = chartEnter.merge(chart).selectAll('.chartLeft').data([null])
    const chartLeftEnter = chartLeft
        .enter().append('g')
        .attr('transform', `translate(-5,0)`)
        .attr('class', 'chartLeft')
    
    chartLeftEnter.selectAll('path')
        .data(root_2011.descendants())
        .enter()
        .append('path')
        .attr("display", d => d.depth ? null : "none")
        .attr("d", arc_2011)
        .style('stroke', '#fff')
        .style("fill", d => colour((d.children ? d : d.parent).data.name));

    chartLeftEnter.append('text')
        .attr('class', 'yearText')
        .attr('dx', '-220')
        .attr('dy', '170')
        .text("2011")
    chartLeft.exit().remove

    const chartRight = chartEnter.merge(chart).selectAll('.chartRight').data([null])
    const chartRightEnter = chartRight
        .enter().append('g')
        .attr('transform', `translate(5,0)`)
        .attr('class', 'chartRight')

    chartRightEnter.selectAll('path')
        .data(root_2021.descendants())
        .enter()
        .append('path')
        .attr("display", d => d.depth ? null : "none")
        .attr("d", arc_2021)
        .style('stroke', '#fff')
        .style("fill", d => colour((d.children ? d : d.parent).data.name));

    chartRightEnter.append('text')
        .attr('class', 'yearText')
        .attr('dx', '170')
        .attr('dy', '170')
        .text("2021")
    chartRight.exit().remove()
};