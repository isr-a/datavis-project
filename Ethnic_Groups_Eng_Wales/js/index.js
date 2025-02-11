import { sunburst }  from './sunburst.js';
import { map }  from './map.js';
import { convertDataToHierarchy } from './dataToHierarchy.js'
import { tooltip } from './tooltip.js'

// Global/state variables
const svg = d3.select('svg');
let data;
let mapFile= './maps/ew_eer.geojson';
let selectedArea = {properties: {gcode: "UnsetArea"}};
let mapType = "Region";
let mapYear = 2021
let excludeWB = false
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

// HTML Elements
var mapSelector = d3.select("#mapSelectDropdown").on("input", setSelectedMap)
var wbSelector = d3.select("#excludeWB").on("input", setExcludeWB)


// Helper/Filter Functions
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

function mapDataFilter(mapType, year, data) {
    let temp;
    if (mapType == "Region") {
        mapFile = './maps/ew_eer.geojson'
        temp = data.filter(d => (regionCodes.includes(d['geography code'])))
    } else if (mapType == "Constituency") {
        mapFile = './maps/ew_wpc.geojson'
        temp = data.filter(d => (!regionCodes.includes(d['geography code'])))
    } else {
        alert("Invalid Map Type Specified")
        temp = []
    }
    return temp.filter(d => (d.date == year))
}

function sunburstDataFilter(data) {
    console.log(selectedArea)
    if (selectedArea.properties.gcode == "UnsetArea") {
        return data.filter(d => (d.geography == "England and Wales"))
    } else {
        return data.filter(d => (d['geography code'] == selectedArea.properties.gcode))
    }
}

// Interactivity Functions
function setSelectedMap() {
    var selectedOption = d3.select(this).property("value")
    if (selectedOption == "Region21" || selectedOption == "Region11") {
        mapType = "Region"
    } else {
        mapType = "Constituency"
    }
    if (selectedOption == "Region21" || selectedOption == "Constituency21") {
        mapYear = 2021
    } else {
        mapYear = 2011
    }
    updateVis()
}

function setExcludeWB() {
    var selectedOption = d3.select(this).property("checked")
    excludeWB = selectedOption
    updateVis()
}

function setSelectedArea(event, d) {
    selectedArea.properties.gcode == d.properties.gcode
        ? selectedArea = {properties: {gcode: "UnsetArea"}}
        : selectedArea = d
    updateVis()
}

// Refreshes Visualisation
const updateVis = () => {
    // Refresh Map
    svg.call(map, {
        data: mapDataFilter(mapType, mapYear, data),
        margin: { top: 0, bottom: 0, left: 0, right: 675 },
        chosen_map: mapFile,
        selectedArea: selectedArea,
        setSelectedArea: setSelectedArea,
        tooltip: tooltip
    });

    // Refresh Sunburst
    svg.call(sunburst, {
        data: sunburstDataFilter(data),
        margin: { top: 0, bottom: 0, left: 650, right: 30 },
        convertDataToHierarchy: convertDataToHierarchy,
        excludeWB: excludeWB,
        tooltip: tooltip
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
