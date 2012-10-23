"use strict";
YUI().use(['node-event-simulate', 'game-sprite-editor'], function(Y) {

describe("tools", function() {
  var editor;

  beforeEach(function() {
    editor = new Y.Game.SpriteEditor();
    editor.set('tool', 'pencil');
  });

  it("should not allow another tool to be selected when the current one is active", function() {
    editor.toCanvasCoords = jasmine.createSpy();
    editor.isPointInCanvas = jasmine.createSpy();

    // Activate a tool
    editor.set('tool', 'pencil');
    editor.fire('penDown');

    // Try to switch to another tool
    editor.set('tool', 'hand');
    expect(editor.get('tool')).toBe('pencil');
  });

  // keydown, mousedown, keyup
  // keydown, mousedown, keyup, mouseup

  // mousedown, keydown
  // mousedown, keydown, mouseup
  // mousedown, keydown, mouseup, keyup
  // mousedown, keydown, keyup
  // mousedown, keydown, keyup, mouseup


  describe("quick tool", function() {
    var fireKey = function(direction) {
      Y.Event.simulate(document, 'key' + direction, { keyCode: Y.Game.KEY_SPACE });
    };

    var fireKeyDown = function() {
      fireKey('down');
    };

    var fireKeyUp = function() {
      fireKey('up');
    };

    var fireMouse = function(direction) {
      // Need to subtract one because the button numbers the
      // YUI event library uses internally are off by one compared to the DOM
      editor.get('contentBox').simulate('mouse' + direction, { button: Y.Game.MOUSE_LEFT - 1 });
    };

    var fireMouseDown = function() {
      fireMouse('down');
    };

    var fireMouseUp = function() {
      fireMouse('up');
    };

    beforeEach(function() {
      editor.bindUI();
    });

    it("keydown", function() {
      fireKeyDown();

      expect(editor.get('tool')).toBe('hand');
    });

    it("keydown, mousedown", function() {
      fireKeyDown();
      fireMouseDown();

      expect(editor.get('tool')).toBe('hand');
      expect(editor._currentTool.isActive).toBe(true);
    });

    it("keydown, mousedown, mouseup", function() {
      fireKeyDown();
      fireMouseDown();
      fireMouseUp();

      expect(editor.get('tool')).toBe('hand');
      expect(editor._currentTool.isActive).toBe(false);
    });

    it("keydown, mousedown, mouseup, keyup", function() {
      fireKeyDown();
      fireMouseDown();
      fireMouseUp();
      fireKeyUp();

      expect(editor.get('tool')).toBe('pencil');
      expect(editor._currentTool.isActive).toBe(false);
    });
  });
});

}); // YUI

