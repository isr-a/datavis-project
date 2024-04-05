export const map = (parent, props) => {
    const {
        data,
        margin,
        chosen_map,
        selectedArea,
        setSelectedArea
    } = props;

    const width = +parent.attr('width');
    const height = +parent.attr('height');
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Define Projection Constants
    const projection = d3.geoNaturalEarth1()
        .center([-2, 53])
        .scale(5000)
    const pathGenerator = d3.geoPath().projection(projection);

    // Group to enter our map elements and facilitate zoom
    const map = parent.selectAll('.map').data([null])
    const mapEnter = map
        .enter().append('svg')
        .attr("viewBox", [margin.left, margin.top, margin.left+innerWidth, margin.top+innerHeight])
        .attr("width", innerWidth)
        .attr("height", innerHeight)
        .attr("style", "max-width: 100%; height: auto;")
        .attr('class', 'map');

    // Bounding Box defined by margins
    mapEnter.append('rect')
        .attr('x', margin.left)
        .attr('y', margin.top)
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('fill', '#69a3b2');

    const mapchild = mapEnter.merge(map).selectAll('.mapchild').data([null])
    const mapchildEnter = mapchild
        .enter().append('g')
        .attr('transform', `translate(${margin.left-150},${margin.top+50})`)
            .attr('class', 'mapchild');

    // Initialise scales
    const nonWBScale = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => d['Percent Non-WB']))])
        .range(["white","green"])

    // d3-zoom 
    mapEnter.call(d3.zoom()
        .scaleExtent([1, 15])
        .extent([[margin.left-150, margin.top],[margin.left+innerWidth, margin.top+innerHeight]])
        .translateExtent([[0, 0], [width, height]])
        .on('zoom', event => mapchildEnter.attr('transform', event.transform)));

    // Below contains all code that relies on the map data in some way
    d3.json(chosen_map)
        .then(mapdata => {
            const mapShape = mapchildEnter.merge(mapchild).selectAll('.country').data(mapdata.features)
            const mapShapeEnter = mapShape
                .enter().append('path')
                    .attr('stroke', 'black')
                    .attr('class','country')
            mapShapeEnter.merge(mapShape)
                .attr('d', pathGenerator)
                .attr('fill', d => nonWBScale(data.filter(x => x['geography code'] == d.properties.gcode)[0]['Percent Non-WB']))
                .attr('stroke-width', d => (selectedArea.properties.gcode==d.properties.gcode) ? '1px' : '0.1px')
                .on('click', setSelectedArea);
            mapShape.exit().remove();


            const mapSelect = mapEnter.merge(map).selectAll('.mapSelect').data([null])
            const mapSelectEnter = mapSelect
                .enter().append('g')
                .attr('class', 'mapSelect')
                .attr('x', margin.left)
                .attr('y', margin.top)
            mapSelectEnter.append('rect')
                .attr('width', innerWidth)
                .attr('height', 50)
                .attr('fill', 'white');
            mapSelectEnter.append('text')
                .attr('dx', '100')
                .attr('dy', '35')
                .text("Select map type:")
        });
};