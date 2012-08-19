YUI.add('game-sprite-preview', function(Y) {

var SpritePreview = Y.Base.create("SpritePreview", Y.Widget, [Y.WidgetPosition], {
  renderUI: function() {
    this._canvas = Y.Node.create("<canvas/>");
    this._canvas.setStyle('position', 'absolute');
    this._setCanvasSize({
      width: 0,
      height: 0});

    this.get('contentBox').append(this._canvas);
  },

  _setCanvasSize: function(size) {
    this._canvas.setAttrs(size);
  },

  _setImage: function(image) {
    var context, scaledData;

    this._setCanvasSize({
      width: image.get('width') * this.get('previewSize'),
      height: image.get('height') * this.get('previewSize')});

    context = this._canvas.getDOMNode().getContext("2d");

    scaledData = context.createImageData(
      this._canvas.get('width'),
      this._canvas.get('height'));

    image.scale({
      factor: this.get('previewSize'),
      outData: scaledData.data
    });
    context.putImageData(scaledData, 0, 0);
  }
}, {
  ATTRS: {
    image: { setter: "_setImage" },
    previewSize: { value: 10 }
  }
});

Y.namespace("Game").SpritePreview = SpritePreview;
}, "", { requires: ['widget-position'] });
