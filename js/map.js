export const map = (parent, props) => {
    const {
        data,
        margin,
        chosen_map,
        selectedArea,
        setSelectedArea,
        tooltip
    } = props;

    const width = +parent.attr('width');
    const height = +parent.attr('height');
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Tooltip Constants
    const toolTipObject = new tooltip(false)
    const mapToolTip = toolTipObject.Tooltip
    const toolTipText = (d) => {
        return `
        <div class="tooltipTitle">${d.properties.geography}</div>
        % Non-White British: <br> 
        ${data.filter(x => x['geography code'] == d.properties.gcode)[0]['Percent Non-WB']}%
        `
    }

    // Define Projection Constants
    const projection = d3.geoNaturalEarth1()
        .center([-2, 53])
        .scale(5000)
    const pathGenerator = d3.geoPath().projection(projection);

    // SVG container for map - used to create a viewbox for the map when zoomed/panned
    const map = parent.selectAll('.mapSVG').data([null])
    const mapEnter = map
        .enter().append('svg')
        .attr('class', 'mapSVG')
        .attr("viewBox", [margin.left, margin.top, margin.left+innerWidth, margin.top+innerHeight])
        .attr("width", innerWidth)
        .attr("height", innerHeight)

    // Bounding Box defined by margins
    mapEnter.append('rect')
        .attr('class', 'mapBackground')
        .attr('x', margin.left)
        .attr('y', margin.top)
        .attr('width', innerWidth)
        .attr('height', innerHeight)

    // Subgroup that contains zoom-effected elements (ensures panning works correctly while zoomed in)
    const mapchild = mapEnter.merge(map).selectAll('.mapchild').data([null])
    const mapchildEnter = mapchild
        .enter().append('g')
        .attr('transform', `translate(${margin.left-150},${margin.top+50})`)
            .attr('class', 'mapchild');

    // d3-zoom 
    mapEnter.call(d3.zoom()
        .scaleExtent([1, 15])
        .extent([[margin.left-150, margin.top],[margin.left+innerWidth, margin.top+innerHeight]])
        .translateExtent([[0, 0], [width, height]])
        .on('zoom', event => mapchildEnter.attr('transform', event.transform)));

    // Initialise scales and Legend
    const nonWBScale = d3.scaleLinear()
        .domain([0, 90])
        .range(["white","green"])
        
    const legendLinear = d3.legendColor()
        .shapeWidth(30)
        .cells(10)
        .orient('horizontal')
        .scale(nonWBScale);

    // Below contains all code that relies on the map data in some way OR needs to be drawn on top of the map!
    d3.json(chosen_map)
        .then(mapdata => {

            // Map generation itself
            const mapShape = mapchildEnter.merge(mapchild).selectAll('.country').data(mapdata.features)
            const mapShapeEnter = mapShape
                .enter().append('path')
                    .attr('class','country')
            mapShapeEnter.merge(mapShape)
                .attr('d', pathGenerator)
                .attr('fill', d => nonWBScale(data.filter(x => x['geography code'] == d.properties.gcode)[0]['Percent Non-WB']))
                .attr('stroke-width', d => (selectedArea.properties.gcode==d.properties.gcode) ? '1px' : '0.1px')
                .on('click', (e,d) => {
                    toolTipObject.mouseleave(e,d,mapToolTip)
                    setSelectedArea(e,d)
                })
                .on("mouseover", (e,d) => toolTipObject.mouseover(e,d,mapToolTip))
                .on("mousemove", (e,d) => toolTipObject.mousemove(e,d,toolTipText,mapToolTip))
                .on("mouseleave", (e,d) => toolTipObject.mouseleave(e,d,mapToolTip))
            mapShape.exit().remove();

            // Elements relating to the map selection dropdown
            const mapSelect = mapEnter.merge(map).selectAll('.mapSelect').data([null])
            const mapSelectEnter = mapSelect
                .enter().append('g')
                .attr('class', 'mapSelect')
                .attr('x', margin.left)
                .attr('y', margin.top)
            mapSelectEnter.append('rect')
                .attr('class', 'mapSelectBackground')
                .attr('width', innerWidth)
            mapSelectEnter.append('text')
                .attr('class', 'mapSelectText')
                .text("Select map type:")

            // Elements relating to the map legend
            const mapLegend = mapEnter.merge(map).selectAll('.mapLegend').data([null])
            const mapLegendEnter = mapLegend
                .enter().append('g')
                    .attr('class', 'mapLegend')
                    .attr("transform", `translate(${margin.right-380},${margin.bottom+560})`)
            mapLegendEnter.append('rect')
                .attr('class', 'mapLegendBackground')
                .attr('width', innerWidth+10)
            mapLegendEnter.append('text')
                .attr('class', 'mapLegendText')
                .text("% of population who are not White British:")
            mapLegendEnter.call(legendLinear)
        });
};