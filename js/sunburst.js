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
    const radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    // d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))


    var data_2021 = data.filter(d => (d.date == 2021))[0]
    var data_2011 = data.filter(d => (d.date == 2011))[0]
    var data_2021_no_WB = convertDataToHierarchy(data_2021, false)
    var data_2011_no_WB = convertDataToHierarchy(data_2011, false)
    data_2021 = convertDataToHierarchy(data_2021, true)
    data_2011 = convertDataToHierarchy(data_2011, true)
    console.log(data_2021)
    console.log(data_2021_no_WB)

    const sburst = parent.selectAll('.sunburst').data([null])
    const sburstenter = sburst
        .enter().append('g')
            .attr('class', 'sunburst')
            .attr('transform', `translate(${margin.left},${margin.top})`)

    sburstenter.merge(sburst).append('rect')
        .attr('class', 'debug_rect')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('fill', 'red');


    const chart = sburstenter.merge(sburst).selectAll('chart').data([null])
    const chartEnter = chart
        .enter().append('g')
        .attr('transform', `translate(${innerWidth/2},${innerHeight/2})`)
    
    var partition = d3.partition()
        .size([2 * Math.PI, radius]);

    var root = d3.hierarchy(data_2021)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value)

    partition(root);

    console.log(root)

    var arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius / 2)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1 - 1);
    
    chartEnter.selectAll('path')
        .data(root.descendants())
        .enter()
        .append('path')
        .attr("display", d => d.depth ? null : "none")
        .attr("d", arc) //<path> attribute d: Expected number, "MNaN,NaNLNaN,NaNZ"
        .style('stroke', '#fff')
        .style("fill", d => color((d.children ? d : d.parent).data.name));
};