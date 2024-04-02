import { sunburst }  from './sunburst.js';
import { map }  from './map.js';
const svg = d3.select('svg');

// Global/state variables
let data;

// Helper Functions
function isInteger(value) {
    return /^\d+$/.test(value);
  }

function toIntOptional(x) {
    if (isInteger(x)) {
        return parseInt(x)
    } else {
        return x
    }
}

// Refreshes Visualisation
const updateVis = () => {
    // Refresh Map
    svg.call(map, {
        data: data,
        margin: { top: 40, bottom: 50, left: 30, right: 380 }
    });

    // Refresh Sunburst
    svg.call(sunburst, {
        data: data,
        margin: { top: 40, bottom: 50, left: 30, right: 380 }
    });
};

// Data loading, preprocessing, and init visualisation
d3.csv('./data/Merged_Ethnic_Data_Percent.csv')
  .then(loadedData => {
    data = loadedData;

    data.forEach(d => {
        Object.keys(d).forEach(function(key){d[key] = toIntOptional(d[key])});
    });


    console.log(data)

    updateVis();
    }
);