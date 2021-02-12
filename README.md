# WMTS-tester

Simple WMTS test site for GeoServer/GeoWebCache.

## Setup

Create a .env file at the root of the repository. Example configuration:

```
WMTS_URL=<your-wmts-service-url-here>
CRS=EPSG:3042
CRS_DEF="+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
CRS_EXTENT="-729785.76, 3715125.82, 945351.10, 9522561.39"
```

For locally hosted GS GWC WMTS, the url is something like http://localhost:8080/geoserver/gwc/service/wmts

Next, start the site with:

```
npm install
npm start
```

Finally, open localhost:1234 in your browser.
