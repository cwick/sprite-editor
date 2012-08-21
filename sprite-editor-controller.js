"use strict";
YUI.add('game-sprite-editor-controller', function(Y) {

var MOUSE_LEFT = 1;
var KEY_SPACE = 32;

var SpriteEditorController = function() { };

SpriteEditorController.prototype = {
  bindUI: function() {
    var contentBox = this.get("contentBox");
    var document = Y.one('document');
    var shit = false;

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
        this.applyCurrentTool(e);
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

    // contentBox.on("click", function(e) {
    //   if (e.button == MOUSE_LEFT) {
    //     this.applyCurrentTool(e);
    //   }
    // }, this);
  },

  shitInHitlersMouth: function(e) {
    this.set('viewport.x', -10);
    this.set('viewport.y', -10);
  },
};

Y.namespace("Game").SpriteEditorController = SpriteEditorController;
}, "", { requires: [] });

