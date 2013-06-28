# SVG Tiles in Leaflet

# Quickstart

    git clone git@github.com:springmeyer/svg-tiles.git
    cd svg-tiles
    npm install
    ./server.js & open http://localhost:4000

Or just view the live demo at http://springmeyer.github.io/svg-tiles.

# Details

This demo shows the loading of a few pre-styled tiles in SVGZ format at z12 into
Leaflet. This works in Chrome and Safari (at least) because the SVGZ tiles
can be treated like images and loaded into a `<img>` element.

See the code comments in `index.html` for customizations to the demo like loading
tiles into `<svg>` elements instead of `<img>` by @jfirebaugh and using overzooming via @nrenner.

See the code comments in `server.js` for enabling code by @ZJONSSON to optimize and re-style the SVG before
sending to the browser.

To view the underlying svg uncompressed you can do (with the server running - see below):

    wget http://localhost:4000/tiles/12/1171/1566.svgz
    mv 1566.svgz 1566.svg.gz
    gzip -d 1566.svg.gz

Then open `1566.svg` in your editor.

The tiles in the `tiles-cairo` folder are produced by Mapnik using Mapnik's Cairo backend.

The tiles in the `tiles-mapnik` folder are produced by Mapnik's experimental `svg_renderer`.

# Depends

- Node.js v0.8.x or v0.10.x

# Setup

After installing Node.js inside this directory run:

    npm install

Which will install `express` and `expat`.

# Using

Start the server:

    node server.js

Then in a web browser go to `http://localhost:4000` and you
should be greeted with a few tiles of Washington DC at z12.
Zooming or panning will not work since this demo only provides
the tiles in the extent of the initial viewport.
