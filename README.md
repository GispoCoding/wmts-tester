# WMTS-tester

Simple WMTS test site.

## Setup

Create a .env file at the root of the repository:

```
WMTS_URL=<your-wmts-service-url-here>
```

For GWC WMTS, the url should be http://gs-base-url/geoserver/gwc/service/wmts

Next, start the site with:

```
npm install
npm start
```

Finally, open localhost:1234 in your browser.
