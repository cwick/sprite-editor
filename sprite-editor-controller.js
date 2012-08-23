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
      // TODO: put in tool
      var IN=1, OUT=-1,
        // How many times bigger or smaller the image gets
        // when we zoom
        FACTOR=2,
        viewport = this.get('viewport'),
        canvas = this.get('canvas'),
        direction = e.wheelDelta > 0 ? IN : OUT,
        change = direction == IN ? FACTOR : 1/FACTOR,
        translate = viewport.zoom*direction,
        translateX,
        translateY;

      this.setAttrs({
        'viewport.zoom': viewport.zoom * change,
      });

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

