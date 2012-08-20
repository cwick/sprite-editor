"use strict";
YUI.add('game-canvas', function(Y) {

var Canvas = Y.Base.create("Canvas", Y.Base, [], {

  initializer: function() {
    this._canvas = document.createElement('canvas');
    this._context = this._canvas.getContext('2d');
  },

  setPixel: function(x, y, value) {
    var width = this.get('width');
    var height = this.get('height');
    var imageData = this._context.getImageData(0,0,width,height);
    var idx = (y*imageData.width + x)*4;

    imageData.data[idx+0] = value[0];
    imageData.data[idx+1] = value[1];
    imageData.data[idx+2] = value[2];
    imageData.data[idx+3] = value[3];

    this._context.putImageData(imageData,0,0);
    this.fire("imageDataChange");
  },

  clear: function(color) {
    this._context.fillStyle = color;
    this._context.fillRect(0, 0, this.get('width'), this.get('height'));
  },

  copyTo: function(other) {
    var width = this._canvas.width;
    var height = this._canvas.height;
    other._context.drawImage(this._canvas, 0, 0, width, height);
  },

  _setImageSmoothingEnabled: function(value) {
    this._context.webkitImageSmoothingEnabled = value;
    this._context.mozImageSmoothingEnabled = value;
    this._context.imageSmoothingEnabled = value;
  }
},{
  ATTRS: {
    node: {
      getter: function() { return this._canvas },
      readOnly: true
    },

    width: {
      getter: function() { return this.get('node.width'); },
      setter: function(value) { this.get('node').width = value; }
    },

    height: {
      getter: function() { return this.get('node.height'); },
      setter: function(value) { this.get('node').height = value; }
    },

    imageSmoothingEnabled: {
      value: true,
      setter: "_setImageSmoothingEnabled"
    }
  }
});

Y.namespace("Game").Canvas = Canvas;
}, "", { requires: ['base'] });
