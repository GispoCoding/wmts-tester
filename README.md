# WMST-tester

Simple WMTS test site for GeoServer/GeoWebCache.

## Setup

Create a .env file at the root of the repository. Example configuration:

```
WMS_URL=<your-wms-service-url-here>
LAYER="layer-name"
```

For locally hosted GS GWC WMS(T), the url is something like http://localhost:8080/geoserver/gwc/service/wms

Next, start the site with:

```
npm install
npm start
```

Finally, open localhost:1234 in your browser.
