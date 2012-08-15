// Create a new YUI instance and populate it with the required modules.
YUI({
  modules: {
    "sprite-editor": {
      fullpath: 'sprite_editor.js'
    }
  }
}).use(['sprite-editor'], function (Y) {
  var editor = new Y.Game.SpriteEditor();
  editor.after('dataChange', function(e) {
    // Render the image data
  });
  editor.render();
});

