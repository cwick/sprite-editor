// Create a new YUI instance and populate it with the required modules.
YUI({
  modules: {
    "sprite-editor": {
      fullpath: 'sprite_editor.js'
    }
  }
}).use(['sprite-editor'], function (Y) {
  var scratchCanvas = Y.one("#scratch-canvas").getDOMNode(),
      finalCanvas = Y.one("#final-canvas").getDOMNode(),
      scratchContext = scratchCanvas.getContext("2d"),
      finalContext = finalCanvas.getContext("2d");

  var imageWidth = Y.Game.SpriteEditor.GRID_COLUMNS,
      imageHeight = Y.Game.SpriteEditor.GRID_ROWS;

  // This doesn't work in any browser I've tried
  // finalContext.imageSmoothingEnabled = false;
  // finalContext.webkitImageSmoothingEnabled = false;
  // finalContext.mozImageSmoothingEnabled = false;

  scratchCanvas.width = imageWidth;
  scratchCanvas.height = imageHeight;

  var scale = 10;
  finalCanvas.width = scratchCanvas.width * scale;
  finalCanvas.height = scratchCanvas.height * scale;

  var convertImageData = function(inData, outData) {
    for (var i=0 ; i<inData.length ; i++) {
      outData[i*4] = inData[i]*255; // red
      outData[i*4+1] = 0; // green
      outData[i*4+2] = 0; // blue
      outData[i*4+3] = 255; // alpha
    }

    return outData;
  };

  var createImageData = function(inData) {
    var canvasImage = finalContext.createImageData(imageWidth, imageHeight);
    var outData = canvasImage.data;

    convertImageData(inData, outData);
    return canvasImage;
  }

  var editor = new Y.Game.SpriteEditor();
  editor.after('dataChange', function(e) {
    // Render the image data
    var imageData = createImageData(e.newVal);

    scratchContext.putImageData(imageData, 0, 0);
    finalContext.drawImage(scratchCanvas, 0, 0, finalCanvas.width, finalCanvas.height);
  });
  editor.render();
});

