"use strict";
YUI.add('game-sprite-editor-controller', function(Y) {

var MOUSE_LEFT = 1;
var KEY_SPACE = 32;

var SpriteEditorController = function() {
  this._tool = 'pencil';
};

SpriteEditorController.prototype = {
  _tools: {
    hand: {
      init: function(editor) {
        var contentBox = editor.get('contentBox');
        contentBox.setStyle('cursor', '-webkit-grab');
        contentBox.setStyle('cursor', '-moz-grab');
      },
      apply: function() {
      }
    },
    pencil: {
      init: function() {
        var contentBox = this.get('contentBox');
        contentBox.setStyle('cursor', '');
      },
      apply: function(e) {
      }
    }
  },

  _setTool: function(tool) {
    this._tool = tool;
    this._tools[tool].init.apply(this);

    if (!this._tools[tool]._state) {
      this._tools[tool]._state = {}
    }
  },

  _applyTool: function(e) {
    this._tools[tool].apply.apply(this
  },

  bindUI: function() {
    var contentBox = this.get("contentBox");
    var document = Y.one('document');
    var shit = false;

    document.on('keydown', function(e) {
      if (e.keyCode == KEY_SPACE) {
        this._setTool('hand');
        e.preventDefault();
      }
    }, this);

    document.on('keyup', function(e) {
      if (e.keyCode == KEY_SPACE) {
        this._setTool('pencil');
        e.preventDefault();
      }
    }, this);

    contentBox.on("gesturemovestart", function(e) {
      if (e.button == MOUSE_LEFT) {
        this._applyTool(e);
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
    this.set('viewport.x', -10);
    this.set('viewport.y', -10);
  },
};

Y.namespace("Game").SpriteEditorController = SpriteEditorController;
});

