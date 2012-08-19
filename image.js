YUI.add('game-image', function(Y) {
var Image = Y.Base.create("Image", Y.Base, [], {
  initializer: function() {
    if (!this.get('data')) {
      this._initData();
    }
  },

  scale: function(options) {
    var subregion = this._getSubregion(options.subregion),
        factor = options.factor,
        outData = options.outData,
        inData = this.get('data'),
        oldWidth = subregion.width,
        oldHeight = subregion.height,
        newWidth = oldWidth*factor,
        newHeight = oldHeight*factor,
        sx, sy, didx, sidx;

    if (!outData) {
      outData = new Uint8ClampedArray(
        newWidth *
        newHeight *
        Image.BYTES_PER_PIXEL);
    }

    for (var i=0 ; i<newHeight ; i++) {
      for (var j=0 ; j<newWidth; j++) {
        sx = Math.floor((j/factor) + subregion.x);
        sy = Math.floor((i/factor) + subregion.y);

        didx = Image.BYTES_PER_PIXEL*((i*newWidth)+j);
        sidx = Image.BYTES_PER_PIXEL*((sy*oldWidth)+sx);

        outData[didx+0] = inData[sidx+0];
        outData[didx+1] = inData[sidx+1];
        outData[didx+2] = inData[sidx+2];
        outData[didx+3] = inData[sidx+3];
      }
    }

    return new Image({
      data: outData,
      width: newWidth,
      height: newHeight });
  },

  clear: function(pixelData) {
    for (var x=0 ; x<this.get('width') ; x++) {
      for (var y=0 ; y<this.get('height') ; y++) {
        this.setPixel(x, y, pixelData);
      }
    }
  },

  setPixel: function(x, y, pixelData) {
    var idx = Image.BYTES_PER_PIXEL * (y*this.get('width') + x);
    var data = this.get('data');

    for (var i=0 ; i<Image.BYTES_PER_PIXEL ; i++) {
      data[idx+i] = pixelData[i];
    }
  },

  _initData: function() {
    this.set('data', new Uint8ClampedArray(
      this.get('width') *
      this.get('height') *
      Image.BYTES_PER_PIXEL));
  },

  _getSubregion: function(subregion) {
    var width = this.get('width');
    var height = this.get('height');

    subregion = subregion || {}
    if (!Y.Lang.isValue(subregion.x)) {
      subregion.x = 0;
    }
    if (!Y.Lang.isValue(subregion.y)) {
      subregion.y = 0;
    }
    if (!Y.Lang.isValue(subregion.height)) {
      subregion.height = this.get('height');
    }
    if (!Y.Lang.isValue(subregion.width)) {
      subregion.width = this.get('width');
    }

    // Clamp x and y to valid values
    if (subregion.x < 0) { subregion.x = 0; }
    else if (subregion.x >= width) { subregion.x = width-1; }
    if (subregion.y < 0) { subregion.y = 0; }
    else if (subregion.y >= height) { subregion.y = height-1; }

    // Clamp width and height to valid values
    if (subregion.x + subregion.width >= width) {
      subregion.width = width - subregion.x;
    }
    if (subregion.y + subregion.height >= height) {
      subregion.height = height - subregion.y;
    }

    return subregion;
  }
}, {
  ATTRS: {
    width: { writeOnce: true },
    height: { writeOnce: true },
    data: { writeOnce: true }
  },
  BYTES_PER_PIXEL: 4
});

Y.namespace("Game").Image = Image;
});
