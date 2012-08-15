YUI.add('game-sprite-editor', function(Y) {
var SpriteEditor = Y.Base.create("SpriteEditor", Y.Overlay, [], {
  initializer: function() {
    this._initStylesheet();
    this._initImage();
  },

  renderUI: function() {
    for (var row=0; row<SpriteEditor.GRID_ROWS; row++) {
      for (var column=0; column<SpriteEditor.GRID_COLUMNS; column++) {
        this._createGridCell(row, column);
      }
    }
  },

  bindUI: function() {
    var contentBox = this.get("contentBox");
    contentBox.on("mouseover", function(e) {
      this._activateGridCell(e.target);
    }, this);
    contentBox.on("click", function(e) {
      this._activateGridCell(e.target);
    }, this);
  },

  _initStylesheet: function() {
    var cellWidth = this.get("width") / SpriteEditor.GRID_COLUMNS;
    var cellHeight = this.get("height") / SpriteEditor.GRID_ROWS;
    var stylesheet = Y.one("#test_stylesheet").getDOMNode().sheet;

    var gridDimensions = "." + this.getClassName("grid-cell") +
      "{ width: " + cellWidth + ";" +
      "  height: " + cellHeight + ";" +
      "}";

    this.set("cellWidth", cellWidth);
    this.set("cellHeight", cellHeight);
    stylesheet.insertRule(gridDimensions, 0);
  },

  _initImage: function() {
    this._image = new Y.Game.Image({
      width: SpriteEditor.GRID_COLUMNS,
      height: SpriteEditor.GRID_ROWS
    });
    this._image.clear([0,0,0,255]);
    this._set('image', this._image);
  },

  _activateGridCell: function(cell) {
    cell.addClass(this.getClassName('active-cell'));
    this._image.setPixel(cell.getData('column'), cell.getData('row'), [255, 0, 0, 255]);
    this._fireImageChange();
  },

  _fireImageChange: function() {
    this._set('image', this._image);
  },

  _createGridCell: function(row, column) {
    var cell = Y.Node.create('<div></div>'),
        contentBox = this.get("contentBox");

    cell.addClass(this.getClassName('grid-cell'));
    cell.setData('row', row);
    cell.setData('column', column);

    if (row == SpriteEditor.GRID_ROWS-1) {
      cell.addClass(this.getClassName('grid-cell-bottom'));
    }
    if (column == SpriteEditor.GRID_COLUMNS-1) {
      cell.addClass(this.getClassName('grid-cell-right'));
    }

    cell.setStyles({
      left: column*this.get("cellWidth"),
      top: row*this.get("cellHeight")
    });

    contentBox.append(cell);
  }
}, {
  // TODO: don't hard code dimensions, let user set them dynamically
  GRID_ROWS: 10,
  GRID_COLUMNS: 10,
  ATTRS: {
    width: { value: 501 },
    height: { value: 501 },
    centered: { value: true },
    image: { readOnly: true }
  }
});

Y.namespace("Game").SpriteEditor = SpriteEditor;
}, "", { requires: ['overlay', 'game-image'] });

