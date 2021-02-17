import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {transformExtent} from 'ol/proj';
import {getCenter} from 'ol/extent';
import TileWMS from "ol/source/TileWMS";
import {set} from "ol/transform";


const url = process.env.WMS_URL
const capabilities_url = `${url}?request=GetCapabilities&service=WMS&version=1.3.0`


function threeHoursAgo() {
    return new Date(Math.round(Date.now() / 3600000) * 3600000 - 3600000 * 3);
}


console.log(threeHoursAgo().toISOString());
let date = new Date('2020-09-25T14:05:00Z');
console.log(date.toISOString());


const addMap = async () => {
    const dates = await fetch(capabilities_url)
        .then(response => response.text())
        .then(txt => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(txt, "text/xml");

            return xmlDoc.getElementsByTagName('Dimension')[0].childNodes[0].nodeValue
                .split('/')
                .filter(dim => dim.length > 4)
                .map(dim => new Date(dim));
        });


    var extent = transformExtent([26.51500222, 9.61734492, 28.42005830, 11.14981886], 'EPSG:4326', 'EPSG:3857');
    var startDate = dates[0];

    const layers = [
        new TileLayer({
            source: new OSM(),
        }),
        new TileLayer({
            extent: extent,
            source: new TileWMS({
                attributions: ['Sentinel 2'],
                url: capabilities_url,
                params: {'LAYERS': process.env.LAYER, 'TIME': startDate.toISOString()},
            }),
        })];
    let map = new Map({
        layers: layers,
        target: 'map',
        view: new View({
            center: getCenter(extent),
            zoom: 10,
        }),
    });

    const updateInfo = () => {
        var el = document.getElementById('info');
        el.innerHTML = startDate.toISOString();
    }

    const setTime = (next) => {
        const val = next ? 1 : -1;
        startDate = dates[(dates.indexOf(startDate) + val) % dates.length];
        layers[1].getSource().updateParams({'TIME': startDate.toISOString()});
        updateInfo();
    }


    var previousBtn = document.getElementById('previous');
    previousBtn.addEventListener('click', () => setTime(false), false);

    var nextBtn = document.getElementById('next');
    nextBtn.addEventListener('click', () => setTime(true), false);

    updateInfo();
}

addMap();


