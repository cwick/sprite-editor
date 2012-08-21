"use strict";
YUI.add('game-sprite-editor-tools', function(Y) {

// Tool API
// interface Tool {
//   property name: string
//   function select(SpriteEditor)
//   function penDown(MotionEvent)
//   function penMove(MotionEvent)
//   function penUp(MotionEvent)
// }

var PencilTool = {
  name: 'pencil',

  select: function(editor) {
    var contentBox = editor.get('contentBox');
    contentBox.setStyle('cursor', '');
    this._editor = editor
  },

  penDown: function(e) {
    this._paint(e.x, e.y);
  },

  penMove: function(e) {
    this._paint(e.x, e.y);
  },

  _paint: function(x,y) {
    var color = this._editor.get('brushColor');
    this._editor.get('canvas').setPixel(x, y, color);
  }
};

var HandTool = {
  name: 'hand',

  select: function(editor) {
    var contentBox = editor.get('contentBox');
    contentBox.setStyle('cursor', '-webkit-grab');
    contentBox.setStyle('cursor', '-moz-grab');
  }
};

var TOOLS = [PencilTool, HandTool];

var SpriteEditorTools = function() {
  this._tools = {};

  TOOLS.forEach(function(tool){
    this.registerTool(Y.Object(tool));
  }, this);

  // Send pen motion events to the current tool
  ['penDown', 'penMove', 'penUp'].forEach(function(motion) {
    this.after(motion, function(e) {
      if (this._currentTool) {
        var fn = this._currentTool[motion];

        if (fn) {
          console.log(this._currentTool.name, e);
          fn.apply(this._currentTool, [e]);
        }
      }
    });
  }, this);
};

SpriteEditorTools.prototype = {
  registerTool: function(tool) {
    this._tools[tool.name] = tool;
  },

  _setTool: function(value) {
    if (!(value in this._tools)) {
      return Y.AttributeCore.INVALID_VALUE;
    }

    this._currentTool = this._tools[value];
    this._currentTool.select(this);
  }
};

SpriteEditorTools.ATTRS = {
  tool: {
    value: 'pencil',
    setter: '_setTool',
    lazyAdd: false
  }
};

Y.namespace("Game").SpriteEditorTools = SpriteEditorTools;
}, "", { requires: [] });
