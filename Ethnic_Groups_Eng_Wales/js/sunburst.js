export const sunburst = (parent, props) => {
    const {
        data,
        margin,
        convertDataToHierarchy,
        excludeWB,
        tooltip
    } = props;

    const width = +parent.attr('width');
    const height = +parent.attr('height');
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Chart Constants
    const radius = Math.min(width, height) / 3;
    const labelSize = 9;
    const colour = d3.scaleOrdinal(d3.schemeSet2.slice(0,5))
        .domain(["White","Asian","Black","Mixed","Other"]);

    // Helper Functions
    function getPercent(d) {
        if (d.data.year == 2011) {
            return (d.value/total_2011 * 100).toFixed(2)
        } else {
            return (d.value/total_2021 * 100).toFixed(2)
        }
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    function chooseData(excludeWB) {
        if (excludeWB) {
            return [convertDataToHierarchy(data_2021, 2021, false), convertDataToHierarchy(data_2011, 2011, false)]
        } else {
            return [convertDataToHierarchy(data_2021, 2021, true), convertDataToHierarchy(data_2011, 2011, true)]
        }
    }

    // Tooltip Constants
    const toolTipObject = new tooltip(true)
    const chartToolTip = toolTipObject.Tooltip
    const toolTipText = (d) => {
        return `
        <div class="tooltipTitle">${d.data.name}</div>
        Population: ${numberWithCommas(d.value)} <br>
        % of Total: ${getPercent(d)}%
        `
    }

    // Data Constants
    const data_2021 = data.filter(d => (d.date == 2021))[0]
    const data_2011 = data.filter(d => (d.date == 2011))[0]
    const total_2021 = data_2021.Total
    const total_2011 = data_2011.Total

    // Group for holding all Chart and Chart-related elements
    const sburst = parent.selectAll('.sunburst').data([null])
    const sburstEnter = sburst
        .enter().append('g')
            .attr('class', 'sunburst')
            .attr('transform', `translate(${margin.left+20},${margin.top+50})`)

    // Elements relating to the Chart Title
    const chartTitle = sburstEnter.merge(sburst).selectAll('.chartTitle').data([null])
    const chartTitleEnter = chartTitle
        .enter().append('text')
        .attr('class', 'chartTitle')
    chartTitleEnter.merge(chartTitle)
        .text(`${data_2021.geography}:`)
    chartTitle.exit().remove()

    // Elements relating to the Exclude Text
    const excludeText = sburstEnter.merge(sburst).selectAll('.excludeText').data([null])
    const excludeTextEnter = excludeText
        .enter().append('text')
        .attr('class', 'excludeText')
        .text("Exclude White British?")

    // Elements relating to the Chart Legend
    const legend = d3.legendColor()
        .scale(colour)
    const chartLegend = sburstEnter.merge(sburst).selectAll('.chartLegend').data([null])
    const chartLegendEnter = chartLegend
        .enter().append('g')
        .attr('class', 'chartLegend')
    chartLegendEnter.append('text')
        .attr('class', 'chartLegendText')
        .text("Legend:")
    chartLegendEnter.call(legend)

    // Group for holding Chart Elements
    const chart = sburstEnter.merge(sburst).selectAll('.chart').data([null])
    const chartEnter = chart
        .enter().append('g')
        .attr('class', 'chart')
        .attr('transform', `translate(${innerWidth/2 - 70},${innerHeight/2-50})`)
    
    // Creating constants used for chart
    const partition = d3.partition()
        .size([Math.PI, radius]);
        
    const [chosen2021, chosen2011] = chooseData(excludeWB)
    const root_2021 = d3.hierarchy(chosen2021)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value)

    partition(root_2021);

    const arc_2021 = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius / 2)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1 - 1);

    const root_2011 = d3.hierarchy(chosen2011)
        .sum(d => d.value)
        .sort((a, b) => a.value - b.value)

    partition(root_2011);

    const arc_2011 = d3.arc()
        .startAngle(d => d.x0 + Math.PI)
        .endAngle(d => d.x1 + Math.PI)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius / 2)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1 - 1);

    // Divider between two halves of chart
    chartEnter.append('rect')
        .attr('class', 'chartDivider')
        .attr('height', radius*2)

    // Group for all elements relating to 2011 data/left-hand chart
    const chartLeftGroup = chartEnter.merge(chart).selectAll('.chartLeftGroup').data([null])
    const chartLeftGroupEnter = chartLeftGroup
        .enter().append('g')
        .attr('class', 'chartLeftGroup')

    // Group for all elements relating to 2021 data/right-hand chart    
    const chartRightGroup = chartEnter.merge(chart).selectAll('.chartRightGroup').data([null])
    const chartRightGroupEnter = chartRightGroup
        .enter().append('g')
        .attr('class', 'chartRightGroup')
    
    // Left Chart Visualisation    
    const chartLeft = chartLeftGroupEnter.merge(chartLeftGroup).selectAll('path')
        .data(root_2011.descendants())
    const chartLeftEnter = chartLeft
        .enter().append('path')
        .attr('class', 'chartDiagram')
    chartLeftEnter.merge(chartLeft)
        .attr("display", d => d.depth ? null : "none")
        .attr("d", arc_2011)
        .attr("fill", d => colour((d.children ? d : d.parent).data.name))
        .on("mouseover", (e,d) => toolTipObject.mouseover(e,d,chartToolTip))
        .on("mousemove", (e,d) => toolTipObject.mousemove(e,d,toolTipText,chartToolTip))
        .on("mouseleave", (e,d) => toolTipObject.mouseleave(e,d,chartToolTip))

    // Right Chart Visualisation   
    const chartRight = chartRightGroupEnter.merge(chartRightGroup).selectAll('path')
        .data(root_2021.descendants())
    const chartRightEnter = chartRight    
        .enter().append('path')
        .attr('class', 'chartDiagram')
    chartRightEnter.merge(chartRight)
        .attr("display", d => d.depth ? null : "none")
        .attr("d", arc_2021)
        .attr("fill", d => colour((d.children ? d : d.parent).data.name))
        .on("mouseover", (e,d) => toolTipObject.mouseover(e,d,chartToolTip))
        .on("mousemove", (e,d) => toolTipObject.mousemove(e,d,toolTipText,chartToolTip))
        .on("mouseleave", (e,d) => toolTipObject.mouseleave(e,d,chartToolTip))

    // Labels for Left Chart
    const labelLeft = chartLeftGroupEnter.merge(chartLeftGroup).selectAll('.leftLabel')
        .data(root_2011.descendants().filter(d => (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > labelSize))
    const labelLeftEnter = labelLeft
        .join('text')
        .attr('class', 'leftLabel')
        .attr("font-size", labelSize)
    labelLeftEnter.merge(labelLeft)
        .attr("transform", function(d) {
            const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
            const y = (d.y0 + d.y1) / 2;
            return `rotate(${x + 90}) translate(${y},0) rotate(${x > 180 ? 0 : 180})`;
        })
        .attr("dy", "0.30em")
        .text(d => d.data.name);

    // Label for Right Chart
    const labelRight = chartRightGroupEnter.merge(chartRightGroup).selectAll('.rightLabel')
        .data(root_2021.descendants().filter(d => (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > labelSize))
    const labelRightEnter = labelRight
        .join('text')
        .attr('class', 'rightLabel')
        .attr("font-size", labelSize)
    labelRightEnter.merge(labelRight)
        .attr("transform", function(d) {
            const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
            const y = (d.y0 + d.y1) / 2;
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        })
        .attr("dy", "0.30em")
        .text(d => d.data.name);

    // Year Text Elements    
    chartLeftGroupEnter.append('text')
        .attr('class', 'yearTextLeft')
        .text("2011")
    chartLeftGroup.exit().remove

    chartRightGroupEnter.append('text')
        .attr('class', 'yearTextRight')
        .text("2021")
    chartRightGroup.exit().remove()
};
