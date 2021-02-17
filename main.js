import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {transformExtent} from 'ol/proj';
import {getCenter} from 'ol/extent';
import TileWMS from "ol/source/TileWMS";


const url = process.env.WMS_URL
const capabilities_url = `${url}?request=GetCapabilities&service=WMS&version=1.3.0`

const addMap = async () => {
    const dates = await fetch(capabilities_url)
        .then(response => response.text())
        .then(txt => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(txt, "text/xml");

            return xmlDoc.getElementsByTagName('Dimension')[0].childNodes[0].nodeValue
                .split(',')
                .filter(dim => dim.length > 4)
                .map(dim => dim.trim())
                .map(dim => new Date(`${dim}T14:05:00.000Z`));
        });


    const extent = transformExtent([26.9998170118793, 8.94756456080834, 29.832916841254, 10.8554812215646],
        'EPSG:4326', 'EPSG:3857');
    let startDate = dates[0];

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
    const map = new Map({
        layers: layers,
        target: 'map',
        view: new View({
            center: getCenter(extent),
            zoom: 9,
        }),
    });

    const updateInfo = () => {
        const el = document.getElementById('info');
        el.innerHTML = startDate.toISOString();
    }

    const setTime = (next) => {
        const val = next ? 1 : -1;
        startDate = dates[(dates.indexOf(startDate) + val) % dates.length];
        layers[1].getSource().updateParams({'TIME': startDate.toISOString()});
        updateInfo();
    }


    document.getElementById('previous')
        .addEventListener('click', () => setTime(false), false);

    document.getElementById('next')
        .addEventListener('click', () => setTime(true), false);

    updateInfo();
}

addMap();


