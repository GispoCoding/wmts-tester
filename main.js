import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {get as getProjection} from 'ol/proj';
import {getTopLeft, getWidth} from 'ol/extent';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';

proj4.defs("EPSG:3042","+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
register(proj4);

var projection = getProjection('EPSG:3042');
// var projectionExtent = projection.getExtent();
var projectionExtent = [-729785.76, 3715125.82, 945351.10, 9522561.39]

// var gridExtent = [157882.23263045703, 5522588.664938651, 5522588.664938651, 5522588.664938651]
var size = getWidth(projectionExtent) / 256;
var resolutions = new Array(14);
var matrixIds = new Array(14);
for (var z = 0; z < 14; ++z) {
  // generate resolutions and matrixIds arrays for this WMTS
  resolutions[z] = size / Math.pow(2, z);
  matrixIds[z] = `EPSG:3042:${z}`;
}

var map = new Map({
  layers: [
    new TileLayer({
      opacity: 0.7,
      source: new WMTS({
        url: process.env.WMTS_URL,
        layer: 'oi-pilot:project_oi-pilot',
        matrixSet: 'EPSG:3042',
        format: 'image/png',
        projection: projection,
        tileGrid: new WMTSTileGrid({
          extent: projectionExtent,
          resolutions: resolutions,
          matrixIds: matrixIds,
        }),
        style: 'default',
        wrapX: true,
      }),
    }) ],
  target: 'map',
  view: new View({
    projection: projection,
    center: [721855, 5765740],
    zoom: 4,
  }),
});
