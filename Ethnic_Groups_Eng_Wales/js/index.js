import { sunburst }  from './sunburst.js';
import { map }  from './map.js';
const svg = d3.select('svg');

// Global/state variables
let data;
let mapFile= './maps/ew_eer.geojson';
let selectedArea = {properties: {gcode: "UnsetArea"}};
let mapType = "Region";
let regionCodes = [
    'E12000001',
    'E12000002',
    'E12000003',
    'E12000004',
    'E12000005',
    'E12000006',
    'E12000007',
    'E12000008',
    'E12000009',
    'W92000004',
];


// Helper Functions
function isInteger(value) {
    return /^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?$/.test(value);
}

function toFloatOptional(x) {
    if (isInteger(x)) {
        return parseFloat(x)
    } else {
        return x
    }
}

function mapDataFilter(display_type, year, data) {
    let temp;
    if (display_type == "Region") {
        mapFile = './maps/ew_eer.geojson'
        temp = data.filter(d => (regionCodes.includes(d['geography code'])))
    } else if (display_type == "Constituency") {
        mapFile = './maps/ew_wpc.geojson'
        temp = data.filter(d => (!regionCodes.includes(d['geography code'])))
    } else {
        alert("Invalid Map Type Specified")
        temp = []
    }
    return temp.filter(d => (d.date == year))
}

// Interactivity Functions
const setMapType = (event, d) => {}

const setSelectedArea = (event, d) => {
    selectedArea = d
    console.log(selectedArea)
    console.log("---------------------")
    updateVis()
}

// Refreshes Visualisation
const updateVis = () => {
    // Refresh Map
    svg.call(map, {
        data: mapDataFilter(mapType, 2021, data),
        margin: { top: 0, bottom: 0, left: 0, right: 575 },
        chosen_map: mapFile,
        selectedArea: selectedArea,
        setSelectedArea: setSelectedArea,
    });

    // Refresh Sunburst
    svg.call(sunburst, {
        data: data,
        margin: { top: 40, bottom: 50, left: 700, right: 30 },
    });
};

// Data loading, preprocessing, and init visualisation
d3.csv('./data/Merged_Ethnic_Data_Percent.csv')
  .then(loadedData => {
    data = loadedData;

    data.forEach(d => {
        Object.keys(d).forEach(function(key){d[key] = toFloatOptional(d[key])});
    });

    updateVis();
    });