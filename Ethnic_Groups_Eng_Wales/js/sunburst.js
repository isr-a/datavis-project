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
    const labelSize = 9;
    const colour = d3.scaleOrdinal(d3.schemeAccent.slice(0,5))
        .domain(["White","Asian","Black","Mixed","Other"]);

    const data_2021 = data.filter(d => (d.date == 2021))[0]
    const data_2011 = data.filter(d => (d.date == 2011))[0]

    const sburst = parent.selectAll('.sunburst').data([null])
    const sburstEnter = sburst
        .enter().append('g')
            .attr('class', 'sunburst')
            .attr('transform', `translate(${margin.left+20},${margin.top+50})`)

    const chartTitle = sburstEnter.merge(sburst).selectAll('.chartTitle').data([null])
    const chartTitleEnter = chartTitle
        .enter().append('text')
        .attr('class', console.log(`${data_2021.geography}:`))
        .attr('class', 'chartTitle')
        .attr('transform', `translate(0,20)`)
    chartTitleEnter.merge(chartTitle)
        .text(`${data_2021.geography}:`)
    chartTitle.exit().remove()

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

    const chartLeftGroup = chartEnter.merge(chart).selectAll('.chartLeftGroup').data([null])
    const chartLeftGroupEnter = chartLeftGroup
        .enter().append('g')
        .attr('transform', `translate(-5,0)`)
        .attr('class', 'chartLeftGroup')
    
    const chartLeft = chartLeftGroupEnter.merge(chartLeftGroup).selectAll('path')
        .data(root_2011.descendants())
    const chartLeftEnter = chartLeft    
        .enter().append('path')
    chartLeftEnter.merge(chartLeft)
        .attr("display", d => d.depth ? null : "none")
        .attr("d", arc_2011)
        .style('stroke', '#fff')
        .style("fill", d => colour((d.children ? d : d.parent).data.name));

    const labelLeft = chartLeftGroupEnter.merge(chartLeftGroup).selectAll('.leftLabel')
        .data(root_2011.descendants().filter(d => (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > labelSize))
    const labelLeftEnter = labelLeft
        .join('text')
        .attr('class', 'leftLabel')
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .attr("font-size", labelSize)
    labelLeftEnter.merge(labelLeft)
        .attr("transform", function(d) {
            const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
            const y = (d.y0 + d.y1) / 2;
            return `rotate(${x + 90}) translate(${y},0) rotate(${x > 180 ? 0 : 180})`;
        })
        .attr("dy", "0.30em")
        .text(d => d.data.name);

    chartLeftGroupEnter.append('text')
        .attr('class', 'yearText')
        .attr('dx', '-220')
        .attr('dy', '170')
        .text("2011")
    chartLeftGroup.exit().remove

    const chartRightGroup = chartEnter.merge(chart).selectAll('.chartRightGroup').data([null])
    const chartRightGroupEnter = chartRightGroup
        .enter().append('g')
        .attr('transform', `translate(5,0)`)
        .attr('class', 'chartRightGroup')

    const chartRight = chartRightGroupEnter.merge(chartRightGroup).selectAll('path')
            .data(root_2021.descendants())
    const chartRightEnter = chartRight    
        .enter().append('path')
    chartRightEnter.merge(chartRight)
        .attr("display", d => d.depth ? null : "none")
        .attr("d", arc_2021)
        .style('stroke', '#fff')
        .style("fill", d => colour((d.children ? d : d.parent).data.name));

    const labelRight = chartRightGroupEnter.merge(chartRightGroup).selectAll('.rightLabel')
        .data(root_2021.descendants().filter(d => (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > labelSize))
    const labelRightEnter = labelRight
        .join('text')
        .attr('class', 'rightLabel')
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .attr("font-size", labelSize)
    labelRightEnter.merge(labelRight)
        .attr("transform", function(d) {
            const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
            const y = (d.y0 + d.y1) / 2;
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        })
        .attr("dy", "0.30em")
        .text(d => d.data.name);

    chartRightGroupEnter.append('text')
        .attr('class', 'yearText')
        .attr('dx', '170')
        .attr('dy', '170')
        .text("2021")
    chartRightGroup.exit().remove()
};