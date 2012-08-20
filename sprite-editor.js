"use strict";
YUI.add('game-sprite-editor', function(Y) {
var MOUSE_LEFT = 1;

var SpriteEditor = Y.Base.create("SpriteEditor", Y.Widget, [], {
  initializer: function() {
    this._isPainting = false;

    this.get('displayCanvas').set('imageSmoothingEnabled', false);
    this.get('canvas').after('imageDataChange', this.syncUI, this);

    ['widthChange', 'heightChange', 'backgroundColorChange'].forEach(
      function(attributeChange) {
        this.after(attributeChange, this.syncUI, this);
      }, this);
  },

  renderUI: function() {
    var displayCanvasNode = this.get('displayCanvas').get('node');
    this.get('contentBox').append(displayCanvasNode);
  },

  syncUI: function() {
    this.get('displayCanvas').clear(this.get('backgroundColor'));
    this.get('canvas').copyTo(this.get('displayCanvas'));
  },

  bindUI: function() {
    var contentBox = this.get("contentBox");

    contentBox.on("gesturemovestart", function(e) {
      if (e.button == MOUSE_LEFT) {
        this._isPainting = true;
      }
    }, null, this);

    contentBox.on("gesturemove", function(e) {
      var target = this.get('displayCanvas');
      if (this._isPainting && e.target._node === target.get('node')) {
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
    this.get('canvas').setPixel(evt._event.offsetX, evt._event.offsetY, this.get('brushColor'));
  },

  CONTENT_TEMPLATE: null,
}, {
  ATTRS: {
    width: {
      value: 500,
      setter: function(value) { this.get('displayCanvas').set('width', value); }
    },
    height: {
      value: 500,
      setter: function(value) { this.get('displayCanvas').set('height', value); }
    },
    viewport: {
      valueFn: function() {
        return {
          x: 0,
          y: 0,
          width: this.get('canvas').get('width'),
          height: this.get('canvas').get('height')
        };
      }
    },
    backgroundColor: { value: "black" },
    brushColor: { value: [0,255,0,255] },
    canvas: { value: new Y.Game.Canvas() },
    displayCanvas: { value: new Y.Game.Canvas() },
  }
});

Y.namespace("Game").SpriteEditor = SpriteEditor;
}, "", { requires: ['game-canvas', 'event-move', 'node', 'base', 'widget'] });

