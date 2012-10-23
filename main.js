"use strict";
YUI().use(['game-sprite-editor'], function (Y) {
  var editor = new Y.Game.SpriteEditor({
    width: 1024,
    height: 768
  });
  editor.render();
});
