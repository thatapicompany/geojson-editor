import { Loader } from '@googlemaps/js-api-loader';
require('qs-hash');
// const geojsonRewind = require('@mapbox/geojson-rewind');
// const DrawLineString = require('../../draw/linestring');
// const DrawRectangle = require('../../draw/rectangle');
// const DrawCircle = require('../../draw/circle');
// const SimpleSelect = require('../../draw/simple_select');
// const ExtendDrawBar = require('../../draw/extend_draw_bar');
// const { geojsonToLayer, bindPopup } = require('../util');
// const styles = require('../styles');
// const {
//   DEFAULT_STYLE,
//   DEFAULT_PROJECTION,
//   DEFAULT_DARK_FEATURE_COLOR,
//   DEFAULT_LIGHT_FEATURE_COLOR,
//   DEFAULT_SATELLITE_FEATURE_COLOR
// } = require('../../../constants');
// const drawStyles = require('../../draw/styles');

const qs = require('qs-hash');

let writable = false;
// let drawing = false;
// let editing = false;

// const dummyGeojson = {
//   type: 'FeatureCollection',
//   features: [
//     {
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: [0, 0]
//       }
//     }
//   ]
// };

//module.exports = function (context, readonly) {

window.map = undefined; // global variable

function map(context, readonly) {
  console.log('google map');

  writable = !readonly;

  const query = qs.stringQs(location.hash.split('#')[1] || '');
  writable = query.editable === 'false' ? false : writable;
  // keyboard shortcuts
  console.log('map', query);
  // context, readonly
  const loader = new Loader({
    apiKey: 'AIzaSyD9e_mLudjwIPnqGRBpY1a4XecBV5bo3_I',
    version: 'weekly',
    libraries: ['places']
  });
  const mapOptions = {
    zoom: 6,
    center: { lat: 0, lng: -180 }
  };

  loader
    .importLibrary('maps', 'google')
    .then(({ Map }) => {
      window.map = new Map(document.getElementById('map'), mapOptions);

      const features = {
        type: 'Feature',
        properties: {
          stroke: '#f00fb4',
          'stroke-width': 1,
          'stroke-opacity': 1,
          fill: '#f00fb4',
          'fill-opacity': 0.3
        },
        geometry: {
          coordinates: [
            [
              { lng: 150.84794430403764, lat: -33.922958124893455 },
              { lng: 150.8482889389538, lat: -33.9230025001842 },
              { lng: 150.8482660623257, lat: -33.92312132723781 },
              { lng: 150.84813801262843, lat: -33.92310604243936 },
              { lng: 150.848136230034, lat: -33.923116889715956 },
              { lng: 150.8480886941835, lat: -33.92311023343277 },
              { lng: 150.84809047677794, lat: -33.92309913962627 },
              { lng: 150.84804710031432, lat: -33.92309346945795 },
              { lng: 150.84805125970126, lat: -33.923073500601305 },
              { lng: 150.8480170933087, lat: -33.923069556135225 },
              { lng: 150.84800402094982, lat: -33.923142282198945 },
              { lng: 150.8479089492488, lat: -33.923128476578086 },
              { lng: 150.84794430403764, lat: -33.92295812489345 }
            ]
          ],
          type: 'Polygon'
        }
      };
      // using global variable:
      window.map.setCenter(features.geometry.coordinates[0][0]);
      window.map.setZoom(17);

      // Construct the polygon.
      const bermudaTriangle = new google.maps.Polygon({
        paths: features.geometry.coordinates,
        strokeWeight: features.properties['stroke-width'],
        stroke: features.properties['stroke'],
        strokeOpacity: features.properties['stroke-opacity'],
        strokeColor: '#FF0000',
        fillColor: features.properties['fill'],
        fillOpacity: features.properties['fill-opacity']
      });

      bermudaTriangle.setMap(window.map);
    })
    .catch((e) => {
      console.log(e);
      // do something
    });
}

//   return map;
// };

export default map;
