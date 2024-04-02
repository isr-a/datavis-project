export const map = (parent, props) => {
    const {
        data,
        margin,
        chosen_map,
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
        .enter().append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .attr('class', 'map');
    const gchild = mapEnter.append('g')

    console.log([d3.min(data.map(d => d['Percent Non-WB'])), d3.max(data.map(d => d['Percent Non-WB']))])

    // Initialise scales
    const nonWBScale = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => d['Percent Non-WB']))])
        .range(["white","blue"])

    // d3-zoom 
    mapEnter.call(d3.zoom()
        .scaleExtent([1, 10])
        .translateExtent([[0, 0], [width, height]])
        .on('zoom', event => gchild.attr('transform', event.transform)));

    // Below contains all code that relies on the map data in some way
    d3.json(chosen_map)
        .then(mapdata => {
            console.log(mapdata)

            const mapShape = gchild.selectAll('path').data(mapdata.features)
            const mapShapeEnter = mapShape
                .enter().append('path')
                    .attr('class','country')
                    .attr('d', pathGenerator)
                    .attr('fill', d => nonWBScale(data.filter(x => x['geography code'] == d.properties.EER13CD)[0]['Percent Non-WB']))
            mapShape.exit().remove();
        });
};