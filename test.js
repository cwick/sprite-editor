"use strict";
YUI({
  groups: {
    game: {
      patterns: {
        'game-': {
          configFn: function(me) {
            me.fullpath = me.name.substr('game-'.length) + '.js'
          }
        }
      }
    }
  }
}).use(['game-sprite-editor'], function (Y) {
  var editor = new Y.Game.SpriteEditor({
    width: 1024,
    height: 768
  });
  // var editor2 = new Y.Game.SpriteEditor({
  //   canvas: editor.canvas
  // });
  editor.render();
  // editor2.render();
});
