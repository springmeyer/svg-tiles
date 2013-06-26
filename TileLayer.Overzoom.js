// modified version of 
// https://github.com/nrenner/leaflet-tilelayer-vector/blob/dev/TileLayer.Overzoom.js

L.TileLayer.mergeOptions({
    // List of available server zoom levels in ascending order. Empty means all  
    // client zooms are available (default). Allows to only request tiles at certain
    // zooms and resizes tiles on the other zooms.
    serverZooms: []
});

L.TileLayer.addInitHook(function () {
    this.options.tileSizeOrig = this.options.tileSize;
    this.options.zoomOffsetOrig = this.options.zoomOffset;
});

L.TileLayer.include({
    // on zoom change get the appropriate server zoom for the current zoom and 
    // adjust tileSize and zoomOffset if no server zoom at this level 
    _updateZoom: function() {
        var zoomChanged = (this._zoom !== this._map.getZoom());
        this._zoom = this._map.getZoom();

        if (zoomChanged) {
            var serverZoom = this._getServerZoom(),
                zoom = this._zoom,
                tileSizeOrig = this.options.tileSizeOrig,
                zoomOffsetOrig = this.options.zoomOffsetOrig;
                
            this.options.tileSize = Math.floor(tileSizeOrig * Math.pow(2, (zoom + zoomOffsetOrig) - serverZoom));
            this.options.zoomOffset = serverZoom - (zoom + zoomOffsetOrig);
            //console.log('tileSize = ' + this.options.tileSize + ', zoomOffset = ' + this.options.zoomOffset + ', serverZoom = ' + serverZoom + ', zoom = ' + this._zoom);
            
            this._createTileProto();
        }
    },

    // Returns the appropriate server zoom to request tiles for the current zoom level.
    // Next lower or equal server zoom to current zoom, or minimum server zoom if no lower 
    // (should be restricted by setting minZoom to avoid loading too many tiles).
    _getServerZoom: function() {
        var zoom = this._zoom,
            serverZooms = this.options.serverZooms,
            result = zoom;
        // expects serverZooms to be sorted ascending
        for (var i = 0, len = serverZooms.length; i < len; i++) {
            if (serverZooms[i] <= zoom) {
                result = serverZooms[i];
            } else {
                if (i === 0) {
                    // zoom < smallest serverZoom
                    result = serverZooms[0];
                }
                break;
            }
        }
        return result;
    }
});

L.TileLayer.Overzoom = L.TileLayer.extend({
    onAdd: function (map) {
        L.TileLayer.prototype.onAdd.call(this, map);
        this._updateZoom();
        map.on('viewreset', this._updateZoom, this);
    },
    onRemove: function (map) {
        L.TileLayer.prototype.onRemove.call(this, map);
        map.off('viewreset', this._updateZoom, this);
    },
});

L.tileLayer.overzoom = function (url, options) {
	return new L.TileLayer.Overzoom(url, options);
};
