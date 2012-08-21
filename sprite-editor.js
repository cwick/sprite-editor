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

    this.get('displayCanvas').clear(this.get('workspaceColor'));
    this.get('canvas').copyTo(
        this.get('displayCanvas'),
        -this.get('viewport.x'),
        -this.get('viewport.y'));
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

  toCanvasCoords: function(point) {
    return {
      x: this.get('viewport.x') + point.x,
      y: this.get('viewport.y') + point.y
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
    // TODO: Use this for pan / zoom
    viewport: {
      valueFn: function() {
        return {
          // Upper-left corner of the viewport, relative to
          // the upper-left corner of the canvas.
          x: 0,
          y: 0,
          zoom: 1
        };
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
  'event-move',
  'node',
  'base',
  'widget'] });

