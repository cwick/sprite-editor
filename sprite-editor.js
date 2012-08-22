"use strict";
YUI.add('game-sprite-editor', function(Y) {

var SpriteEditor = Y.Base.create("SpriteEditor", Y.Widget,
  [Y.Game.SpriteEditorController, Y.Game.SpriteEditorTools], {

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
    if (this._settingAttrs) {
      return;
    }

    var displayCanvas = this.get('displayCanvas'),
        canvas = this.get('canvas'),
        zoom = this.get('viewport.zoom'),
        transform = new Y.Matrix();


    // TODO: get rid of this matrix stuff, just use math
    // based on what toCanvasCoords does. (do the inverse)
    // Zoom it relative to center of workspace
    transform.translate(displayCanvas.get('width')/2,
                        displayCanvas.get('height')/2);
    transform.scale(zoom, zoom);
    // transform.translate(-displayCanvas.get('width')/2,
    //                     -displayCanvas.get('height')/2);

    // Position the viewport
    transform.translate(-this.get('viewport.x'),
                        -this.get('viewport.y'));

    displayCanvas.clear(this.get('workspaceColor'));

    this.get('canvas').copyTo(displayCanvas, transform);
  },

  // Reimplemented so we don't redraw after
  // every attribute change, but rather
  // do one redraw at the end
  setAttrs: function(attrs) {
    this._settingAttrs = true;
    var retVal = SpriteEditor.superclass.setAttrs.call(this, attrs);
    this._settingAttrs = false;

    this.syncUI();

    return retVal;
  },

  // Translate a point on the workspace onto a point on the canvas
  toCanvasCoords: function(point) {
    var zoom = this.get('viewport.zoom'),
        displayCanvas = this.get('displayCanvas'),
        displayWidth = displayCanvas.get('width'),
        displayHeight = displayCanvas.get('height'),

        x = ((point.x - displayWidth/2) / zoom) + this.get('viewport.x');
        y = ((point.y - displayHeight/2) / zoom) + this.get('viewport.y');

    return {
      x: Math.floor(x),
      y: Math.floor(y)
    }
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
      value: {
        // Upper-left corner of the viewport, relative to
        // the upper-left corner of the canvas.
        x: 0,
        y: 0,
        zoom: 1
      }
    },
    workspaceColor: { value: "grey" },
    // TODO: support CSS colors
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
}, "", { requires: [
  'game-sprite-editor-tools',
  'game-sprite-editor-controller',
  'game-canvas',
  'base',
  'event-move',
  'node',
  'matrix',
  'widget'] });

