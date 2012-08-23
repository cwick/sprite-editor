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
    var point = this._editor.toCanvasCoords({x:x, y:y});

    this._editor.get('canvas').setPixel(point.x, point.y, color);
  }
};

var HandTool = {
  name: 'hand',

  select: function(editor) {
    console.log('hand select');
    this._editor = editor;
    this._setCursor('grab');
  },

  penDown: function(e) {
    console.log('hand down');
    e = this._editor.toCanvasCoords(e);

    this._start = e;
    this._oldViewport = this._editor.get('viewport');
    this._setCursor('grabbing');
  },

  penMove: function(e) {
    console.log('hand move');
    e = this._editor.toCanvasCoords(e, this._oldViewport);

    this._editor.setAttrs({
      'viewport.x': this._oldViewport.x + (this._start.x - e.x),
      'viewport.y': this._oldViewport.y + (this._start.y - e.y)
    });
  },

  _setCursor: function(type) {
    var contentBox = this._editor.get('contentBox');
    contentBox.setStyle('cursor', '-webkit-' + type);
    contentBox.setStyle('cursor', '-moz-' + type);
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
          fn.call(this._currentTool, e);
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

    var newTool = this._tools[value];

    // Selecting the same tool again does nothing
    if (newTool !== this._currentTool) {
      this._currentTool = newTool;
      this._currentTool.select(this);
    }
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
