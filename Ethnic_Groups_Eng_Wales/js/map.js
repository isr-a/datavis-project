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

    console.log(data);

    const projection = d3.geoNaturalEarth1()
        .center([-2, 53])
        .scale(5000)
        .translate([width / 2, height / 2]);;
    const pathGenerator = d3.geoPath().projection(projection);

    // Group to enter our map elements and facilitate zoom
    const g = parent.append('g')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('class', 'map');
    const gchild = g.append('g')

    // d3-zoom 
    g.call(d3.zoom()
        .scaleExtent([1, 10])
        .translateExtent([[0, 0], [width, height]])
        .on('zoom', event => gchild.attr('transform', event.transform)));

    d3.json(chosen_map)
        .then(mapdata => {
            gchild.selectAll('path').data(mapdata.features)
            .enter().append('path')
              .attr('class','country')
              .attr('d', pathGenerator)
            .append('title')
              .text(d => d.properties.name);
          });
};