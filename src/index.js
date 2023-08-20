//require turf centroid
const turf = require('@turf/turf');

// import d3 plus 3custom plugins
require('./d3-global.js');
require('./lib/d3-compat');
require('./lib/d3-keybinding');
require('./lib/d3-trigger');

// codemirror css
require('../node_modules/codemirror/lib/codemirror.css');
require('../node_modules/codemirror/addon/fold/foldgutter.css');

// fontawesome css
require('../node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css');
require('../node_modules/@fortawesome/fontawesome-free/css/solid.min.css');

// tailwind css
require('../dist/css/tailwind_dist.css');

// mapboxgl, mapboxgl-draw, mapbox-gl-geocoder css
require('../node_modules/mapbox-gl/dist/mapbox-gl.css');
require('../node_modules/@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css');
require('../node_modules/@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css');

// import css
require('./css/base.css');
require('./css/marker.css');
require('./css/theme.css');
require('./css/site.css');

const Sentry = require('@sentry/browser');
const { BrowserTracing } = require('@sentry/tracing');

const ui = require('./ui'),
  map = require('./ui/map'),
  data = require('./core/data'),
  loader = require('./core/loader'),
  router = require('./core/router'),
  recovery = require('./core/recovery'),
  repo = require('./core/repo'),
  user = require('./core/user'),
  api = require('./core/api'),
  store = require('store');

let gjIO = geojsonIO(),
  gjUI = ui(gjIO).write;

d3.select('.geojsonio').call(gjUI);

gjIO.recovery = recovery(gjIO);
gjIO.router.on();

api(gjIO);

function geojsonIO() {
  const context = {};
  context.dispatch = d3.dispatch('change', 'route');
  context.storage = store;
  context.map = map(context);
  context.data = data(context);
  context.dispatch.on('route', loader(context));
  context.repo = repo(context);
  context.router = router(context);
  context.user = user(context);
  return context;
}

//receive data from parent window via postmessage
window.addEventListener('message', receiver, false);
function receiver(e) {
  const data = JSON.parse(e.data);
  console.log('Received data from parent window', data);
  //alert(data.geometry.coordinates[0]);
  window.api.data.set({map:{
    "type": "FeatureCollection",
    "features": [data]
  }} )
  

  //get the centroid of the polygon
  let center = turf.centroid(data).geometry.coordinates;
  console.log('center',center);

  window.api.map.setCenter({lng: center[0], lat: center[1]}) 
  //window.api.map.flyTo({ center: center, zoom: 10 });
}

Sentry.init({
  dsn: 'https://c2d096c944dd4150ab7e44b0881b4a46@o5937.ingest.sentry.io/11480',
  release: 'geojson.thelocationapi.com@latest',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.1
});
