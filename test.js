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
  var editor = new Y.Game.SpriteEditor();
  var editor2 = new Y.Game.SpriteEditor({
    imageData: editor.imageData
  });

  editor.render();
  editor2.render();
});
