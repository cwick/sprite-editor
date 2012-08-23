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

  select: function() {
    var contentBox = this.editor.get('contentBox');
    contentBox.setStyle('cursor', '');
  },

  penDown: function(e) {
    this._paint(e.x, e.y);
  },

  penMove: function(e) {
    this._paint(e.x, e.y);
  },

  _paint: function(x,y) {
    var color = this.editor.get('brushColor');
    var point = this.editor.toCanvasCoords({x:x, y:y});

    this.editor.get('canvas').setPixel(point.x, point.y, color);
  }
};

var HandTool = {
  name: 'hand',

  select: function() {
    console.log('hand select');
    this._setCursor('grab');
  },

  penDown: function(e) {
    console.log('hand down');
    e = this.editor.toCanvasCoords(e);

    this._start = e;
    this._oldViewport = this.editor.get('viewport');
    this._setCursor('grabbing');
  },

  penMove: function(e) {
    console.log('hand move');
    e = this.editor.toCanvasCoords(e, this._oldViewport);

    this.editor.setAttrs({
      'viewport.x': this._oldViewport.x + (this._start.x - e.x),
      'viewport.y': this._oldViewport.y + (this._start.y - e.y)
    });
  },

  penUp: function() {
    this.select();
  },

  _setCursor: function(type) {
    var contentBox = this.editor.get('contentBox');
    contentBox.setStyle('cursor', '-webkit-' + type);
    contentBox.setStyle('cursor', '-moz-' + type);
  }
};

var TOOLS = [PencilTool, HandTool];

var SpriteEditorTools = function() {
  this._tools = {};

  TOOLS.forEach(function(toolFn){
    var tool = Y.Object(toolFn);
    tool.isActive = false;

    this.registerTool(tool);
  }, this);

  // Send pen motion events to the current tool
  ['penDown', 'penMove', 'penUp'].forEach(function(motion) {
    this.after(motion, function(e) {
      if (this._currentTool) {
        var motionResponse = this._currentTool[motion];

        if (e.type.indexOf('penDown') != -1) {
          console.log('active');
          this._currentTool.isActive = true;
        }
        else if (e.type.indexOf('penUp') != -1) {
          console.log('inactive');
          this._currentTool.isActive = false;
        }

        if (motionResponse) {
          motionResponse.call(this._currentTool, e);
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
    // Unknown tool
    if (!(value in this._tools)) {
      return Y.AttributeCore.INVALID_VALUE;
    }

    // Can't replace the current tool until this one finishes
    if (this._currentTool && this._currentTool.isActive) {
      return Y.AttributeCore.INVALID_VALUE;
    }

    var newTool = this._tools[value];

    // Selecting the same tool again does nothing
    if (newTool !== this._currentTool) {
      this._currentTool = newTool;
      this._currentTool.editor = this;
      this._currentTool.select();
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
