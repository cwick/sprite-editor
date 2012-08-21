"use strict";
YUI.add('game-sprite-editor-tools', function(Y) {

// Tool API
// interface Tool {
//   property name: string
//   function select(SpriteEditor)
// }

var PencilTool = {
  name: 'pencil',

  select: function(editor) {
    var contentBox = editor.get('contentBox');
    contentBox.setStyle('cursor', '');
  },

  apply: function(evt) {
    console.log('pencil!');
  }
};

var HandTool = {
  name: 'hand',

  select: function(editor) {
    var contentBox = editor.get('contentBox');
    contentBox.setStyle('cursor', '-webkit-grab');
    contentBox.setStyle('cursor', '-moz-grab');
  },

  apply: function(evt) {
    console.log('hand!');
  }
};

var TOOLS = [PencilTool, HandTool];

var SpriteEditorTools = function() {
  this._tools = {};

  TOOLS.forEach(function(tool){
    this.registerTool(Y.Object(tool));
  }, this);
};

SpriteEditorTools.prototype = {
  registerTool: function(tool) {
    this._tools[tool.name] = tool;
  },

  applyCurrentTool: function(evt) {
    if (!this._currentTool) {
      return;
    }
    this._currentTool.apply(evt);
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
