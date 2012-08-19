YUI.add('game-sprite-editor', function(Y) {
var MOUSE_LEFT = 1;

var SpriteEditor = Y.Base.create("SpriteEditor", Y.Widget, [], {
  initializer: function() {
    this._isPainting = false;
    this._canvas = this.get('contentBox').getDOMNode();
    this._context = this._canvas.getContext('2d');

    this._disableImageSmoothing();

    this.after('backgroundColorChange', this.renderUI);
  },

  renderUI: function() {
    this._canvas.width = this.get('width');
    this._canvas.height = this.get('height');
    this._context.fillStyle = this.get('backgroundColor');
    this._context.fillRect(0, 0, this.get('width'), this.get('height'));
  },

  syncUI: function() {
    this.renderUI();
  },

  bindUI: function() {
    var contentBox = this.get("contentBox");
    contentBox.on("gesturemovestart", function(e) {
      if (e.button == MOUSE_LEFT) {
        this._isPainting = true;
      }
    }, null, this);

    contentBox.on("gesturemove", function(e) {
      if (this._isPainting && e.target == contentBox) {
        this._paint(e);
      }
    }, null, this);

    contentBox.on("gesturemoveend", function(e) {
      this._isPainting = false;
    }, null, this);

    contentBox.on("click", function(e) {
      this._paint(e);
    }, this);
  },

  _paint: function(evt) {
    this._setPixel(evt._event.offsetX, evt._event.offsetY, this.get('brushColor'));
  },

  _disableImageSmoothing: function() {
    this._context.webkitImageSmoothingEnabled = false;
    this._context.mozImageSmoothingEnabled = false;
    this._context.imageSmoothingEnabled = false;
  },

  _setPixel: function(x, y, value) {
    var width = this.get('width');
    var height = this.get('height');
    var imageData = this._context.getImageData(0,0,width,height);
    var idx = (y*imageData.width + x)*4;

    imageData.data[idx+0] = value[0];
    imageData.data[idx+1] = value[1];
    imageData.data[idx+2] = value[2];
    imageData.data[idx+3] = value[3];

    this._context.putImageData(imageData,0,0);
  },

  CONTENT_TEMPLATE: null,
  BOUNDING_TEMPLATE: "<canvas></canvas>"
}, {
  ATTRS: {
    width: { value: 500 },
    height: { value: 500 },
    backgroundColor: { value: "black" },
    brushColor: { value: [0,255,0,255] }
    imageData:
    // image: { readOnly: true },
    // paintColor: { value: [255, 0, 0] }
  }
});

Y.namespace("Game").SpriteEditor = SpriteEditor;
}, "", { requires: ['event-move', 'node', 'base', 'widget'] });

