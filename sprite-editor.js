"use strict";
YUI.add('game-sprite-editor', function(Y) {

var SpriteEditor = Y.Base.create("SpriteEditor", Y.Widget,
  [Y.Game.SpriteEditorController], {

  initializer: function() {
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
}, "", { requires: ['game-sprite-editor-controller', 'game-canvas', 'event-move', 'node', 'base', 'widget'] });

