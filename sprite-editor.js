"use strict";
YUI.add('game-sprite-editor', function(Y) {
var MOUSE_LEFT = 1;
var KEY_SPACE = 32;

var SpriteEditor = Y.Base.create("SpriteEditor", Y.Widget, [], {
  initializer: function() {
    this._isPainting = false;

    this.get('canvas').after('imageDataChange', this.syncUI, this);

    ['width', 'height', 'workspaceColor', 'viewport'].forEach(
      function(attributeChange) {
        this.after(attributeChange + 'Change', this.syncUI, this);
      }, this);
  },

  renderUI: function() {
    var displayCanvasNode = this.get('displayCanvas').get('node');
    this.get('contentBox').append(displayCanvasNode);
  },

  syncUI: function() {
    this.get('displayCanvas').clear(this.get('workspaceColor'));
    this.get('canvas').copyTo(
        this.get('displayCanvas'),
        -this.get('viewport.x'),
        -this.get('viewport.y'));
  },

 // TODO: split into separate module sprite-editor-controller
  bindUI: function() {
    var contentBox = this.get("contentBox");
    var document = Y.one('document');
    var shit = false;

    document.on('keydown', function(e) {
      if (e.keyCode == KEY_SPACE) {
        shit = true;
        contentBox.setStyle('cursor', '-webkit-grab');
        contentBox.setStyle('cursor', '-moz-grab');
        e.preventDefault();
      }
    });

    document.on('keyup', function(e) {
      if (e.keyCode == KEY_SPACE) {
        shit = false;
        contentBox.setStyle('cursor', '');
        e.preventDefault();
      }
    });

    contentBox.on("gesturemovestart", function(e) {
      if (e.button == MOUSE_LEFT) {
        this._isPainting = true;
      }
    }, null, this);

    contentBox.on("gesturemove", function(e) {
      var target = this.get('displayCanvas');
      if (shit) {
        this.shitInHitlersMouth(e);
      } else
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

  shitInHitlersMouth: function(e) {
    this.set('viewport.x', 10);
    this.set('viewport.y', 10);
  },
  _paint: function(evt) {
    var x = Y.Lang.isValue(evt._event.offsetX) ? evt._event.offsetX : evt._event.layerX;
    var y = Y.Lang.isValue(evt._event.offsetY) ? evt._event.offsetY : evt._event.layerY;

    this.get('canvas').setPixel(x, y, this.get('brushColor'));
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
    workspaceColor: { value: "grey" },
    brushColor: { value: [0,255,0,255] },
    canvas: {
      valueFn: function() {
        var canvas = new Y.Game.Canvas();
        canvas.clear('black');
        return canvas;
      }
    },
    displayCanvas: { value: new Y.Game.Canvas() },
  }
});

Y.namespace("Game").SpriteEditor = SpriteEditor;
}, "", { requires: ['game-canvas', 'event-move', 'node', 'base', 'widget'] });

