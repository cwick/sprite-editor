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

// TODO: Should separate the tool's interaction from its function, so
// we can support undo easily.
// For example, the basic function of a line tool is to draw
// a line from point A to B. Before the line is actually drawn,
// there might be a complex user interaction, where a
// preview of the line is continually drawn while the user
// moves the mouse. In other words, there should be a core
// 'drawLine' function that can be called when
// we just want to draw the line non-interactively.

// A basic pencil-like tool will only implement the above interface
// For tools that don't follow the pen down/move/up model, like
// a zoom tool, you can implement custom actions. See ZoomTool for
// example

// Note: tools should probably be implemented so they
// can work without first being selected.
// For example, you might use a zoom tool by pressing a keyboard
// shortcut, or by first selecting it from a toolbar and using the
// mouse. Such a tool should support both modes of operation

var ZoomTool = {
  name: 'zoom',
  DEFAULT_ZOOM_AMOUNT: 2,

  scale: function(amount) {
    var viewport = this.editor.get('viewport'),
        amount = amount || this.DEFAULT_ZOOM_AMOUNT;

    this.editor.set('viewport.zoom', viewport.zoom * amount);
  }
};

var PencilTool = {
  name: 'pencil',

  select: function() {
    var contentBox = this.editor.get('contentBox');
    contentBox.setStyle('cursor', '');
  },

  penDown: function(e) {
    this._paint(e);
  },

  penMove: function(e) {
    this._paint(e);
  },

  _paint: function(e) {
    this.paint(e.x, e.y, this.editor.get('brushColor'));
  },

  paint: function(x, y, color) {
    var point = this.editor.toCanvasCoords({x:x, y:y});

    if (this.editor.isPointInCanvas(point)) {
      this.editor.get('canvas').setPixel(point.x, point.y, color);
    }
  }
};

var HandTool = {
  name: 'hand',

  select: function() {
    this._setCursor('grab');
  },

  penDown: function(e) {
    e = this.editor.toCanvasCoords(e);

    this._start = e;
    this._oldViewport = this.editor.get('viewport');
    this._setCursor('grabbing');
  },

  penMove: function(e) {
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

var TOOLS = [PencilTool, HandTool, ZoomTool];

var SpriteEditorTools = function() {
  this._tools = {};

  TOOLS.forEach(function(tool){
    this.registerTool(Y.Object(tool));
  }, this);

  // Send pen motion events to the current tool
  ['penDown', 'penMove', 'penUp'].forEach(function(motion) {
    this.after(motion, function(e) {
      if (this._currentTool) {
        var motionResponse = this._currentTool[motion];

        if (e.type.indexOf('penDown') != -1) {
          this._currentTool.isActive = true;
        }
        else if (e.type.indexOf('penUp') != -1) {
          this._currentTool.isActive = false;
        }

        if (this._currentTool.isActive && motionResponse) {
          motionResponse.call(this._currentTool, e);
        }
      }
    });
  }, this);
};

SpriteEditorTools.prototype = {
  registerTool: function(tool) {
    tool.isActive = false;
    tool.editor = this;
    this._tools[tool.name] = tool;
  },

  applyTool: function(tool, action, args) {
    tool = this._getTool(tool);
    if (tool) {
      if (Y.Lang.isFunction(tool[action])) {
        tool[action](args);
      }
      else if (Y.Lang.isFunction(tool.action)) {
        tool.action(action, args);
      }
    }
  },

  _getTool: function(name) {
    return this._tools[name];
  },

  _toolRegistered: function(name) {
    return name in this._tools;
  },

  // value: name of the tool to set
  _setTool: function(value) {
    // Unknown tool
    if (!this._toolRegistered(value)) {
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

      if (Y.Lang.isFunction(this._currentTool.select)) {
        this._currentTool.select();
      }
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
