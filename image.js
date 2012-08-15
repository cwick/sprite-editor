YUI.add('game-image', function(Y) {
var Image = Y.Base.create("Image", Y.Base, [], {
  scale: function(factor, outData) {
    var ratio = 1/factor,
        inData = this.get('data'),
        oldWidth = this.get('width'),
        oldHeight = this.get('height'),
        newWidth = oldWidth*factor,
        newHeight = oldHeight*factor;
    var sx, sy, didx, sidx;

    if (!outData) {
      outData = new Array(
        newWidth *
        newHeight *
        Image.BYTES_PER_PIXEL);
    }

    for (var i=0 ; i<newHeight ; i++) {
      for (var j=0 ; j<newWidth; j++) {
        sx = Math.floor(j*ratio);
        sy = Math.floor(i*ratio);

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
    return new Array(
      this.get('width') *
      this.get('height') *
      Image.BYTES_PER_PIXEL);
  }
}, {
  ATTRS: {
    width: { writeOnce: true },
    height: { writeOnce: true },
    data: { writeOnce: true,
            valueFn: "_initData" }
  },
  BYTES_PER_PIXEL: 4
});

Y.namespace("Game").Image = Image;
});
