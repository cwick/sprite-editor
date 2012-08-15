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
}).use(['game-image', 'game-sprite-editor'], function (Y) {
  /* Proof of concept. We capture data change events
   * from the sprite editor and render the final
   * image at various scales.
   *
   * Need to create a separate widget that displays
   * the image using the scaling algorithm.
   *
   * Browsers are supposed to have nearest-neighbor
   * interpolation, but sadly nobody supports it.
   *
   * This doesn't work in any browser I've tried
   * context.imageSmoothingEnabled = false;
   * context.webkitImageSmoothingEnabled = false;
   * context.mozImageSmoothingEnabled = false;
   *
   * Implementing the image scaling ourself could be slower.
   * We could pre-render the images at the desired scale.
   * However, dynamically scaling an image at runtime
   * (think explosions and special effects) could be a
   * challenge.
   *
   */
  var canvas = Y.one("canvas#preview").getDOMNode(),
      context = canvas.getContext("2d"),
      previewSize = 10,
      editor = new Y.Game.SpriteEditor();

  canvas.width = Y.Game.SpriteEditor.GRID_COLUMNS * previewSize;
  canvas.height = Y.Game.SpriteEditor.GRID_ROWS * previewSize;

  editor.after('imageChange', function(e) {
    var scaledData = context.createImageData(canvas.width, canvas.height);
    e.newVal.scale(previewSize, scaledData.data);

    context.putImageData(scaledData, 0, 0);
  });

  editor.render();
});

