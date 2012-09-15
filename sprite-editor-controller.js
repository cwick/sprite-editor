"use strict";
YUI.add('game-sprite-editor-controller', function(Y) {

var MOUSE_LEFT = 1;
var KEY_SPACE = 32;

var SpriteEditorController = function() { };

SpriteEditorController.prototype = {
  bindUI: function() {
    var contentBox = this.get("contentBox");
    var document = Y.one('document');

    contentBox.on('mousewheel', function(e) {
      var speedScale = .0005,
          baseZoomAmount = 1.05,
          // YUI gives us messed up values for e.wheelDelta, so use
          // the natively reported wheelDelta value
          speed = Math.abs(e._event.wheelDelta) * speedScale,
          zoomFactor = baseZoomAmount + speed;

      if (e.wheelDelta < 0) {
        // Zooming out
        zoomFactor = 1/zoomFactor;
      }

      this.applyTool('zoom', 'scale', zoomFactor);

      e.preventDefault();
    }, this);

    document.on('keydown', function(e) {
      if (e.keyCode == KEY_SPACE) {
        this.set('tool', 'hand');
        e.preventDefault();
      }
    }, this);

    document.on('keyup', function(e) {
      if (e.keyCode == KEY_SPACE) {
        this.set('tool', 'pencil');
        e.preventDefault();
      }
    }, this);

    contentBox.on("gesturemovestart", function(e) {
      if (e.button == MOUSE_LEFT) {
        this._pen('penDown', e);
      }
    }, null, this);

    contentBox.on("gesturemove", function(e) {
      this._pen('penMove', e);
    }, null, this);

    contentBox.on("gesturemoveend", function(e) {
      this._pen('penUp', e);
    }, null, this);
  },

  _pen: function(motion, e) {
    this.fire(motion, {x: e._event.offsetX, y: e._event.offsetY});
  },
};

Y.namespace("Game").SpriteEditorController = SpriteEditorController;
}, "", { requires: [] });

