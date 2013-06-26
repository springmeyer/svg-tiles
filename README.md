# SVG Tiles in Leaflet

# Details

This demo shows the loading of a few pre-styled tiles in SVGZ format at z12 into
Leaflet. This works in Chrome and Safari (at least) because the SVGZ tiles
can be treated like images and loaded into a `<img>` element.

To view the underlying svg uncompressed you can do (with the server running - see below):

    wget http://localhost:4000/tiles/12/1171/1566.svgz
    mv 1566.svgz 1566.svg.gz
    gzip -d 1566.svg.gz

Then open 1566.svg in your editor.

The tiles are styled by Mapnik using Mapnik's Cairo backend.

# Depends

- Node.js v0.8.x or v0.10.x

# Setup

After installing Node.js inside this directory run:

    npm install

Which will install `express`.

# Using

Start the server:

    node server.js

Then in a web browser go to `http://localhost:4000` and you
should be greeted with a few tiles of Washington DC at z12.
Zooming or panning will not work since this demo only provides
the tiles in the extent of the initial viewport.
