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
   * finalContext.imageSmoothingEnabled = false;
   * finalContext.webkitImageSmoothingEnabled = false;
   * finalContext.mozImageSmoothingEnabled = false;
   *
   * Implementing the image scaling ourself could be slower.
   * We could pre-render the images at the desired scale.
   * However, dynamically scaling an image at runtime
   * (think explosions and special effects) could be a
   * challenge.
   *
   */
  var scratchCanvas = Y.one("#scratch-canvas").getDOMNode(),
      finalCanvas = Y.one("#final-canvas").getDOMNode(),
      scratchContext = scratchCanvas.getContext("2d"),
      finalContext = finalCanvas.getContext("2d");

  var imageWidth = Y.Game.SpriteEditor.GRID_COLUMNS,
      imageHeight = Y.Game.SpriteEditor.GRID_ROWS;

  scratchCanvas.width = imageWidth;
  scratchCanvas.height = imageHeight;

  var scale = 10;
  finalCanvas.width = scratchCanvas.width * scale;
  finalCanvas.height = scratchCanvas.height * scale;

  var createImageData = function(inData) {
    var canvasImage = finalContext.createImageData(imageWidth, imageHeight);
    var outData = canvasImage.data;

    convertImageData(inData, outData);
    return canvasImage;
  }

  var editor = new Y.Game.SpriteEditor();
  editor.after('imageChange', function(e) {
    var scaledData = finalContext.createImageData(finalCanvas.width, finalCanvas.height);
    e.newVal.scale(scale, scaledData.data);

    finalContext.putImageData(scaledData, 0, 0);
  });
  editor.render();
});

