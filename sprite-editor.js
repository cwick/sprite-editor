YUI.add('game-sprite-editor', function(Y) {
var SpriteEditor = Y.Base.create("SpriteEditor", Y.Overlay, [], {
  initializer: function() {
    this._initStylesheet();
    this._initData();
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

  _initData: function() {
    var numCells = SpriteEditor.GRID_ROWS * SpriteEditor.GRID_COLUMNS;
    var data = new Array(numCells);
    for (var i=0 ; i<numCells ; i++) {
      data[i] = 0;
    }

    this._set('data', data);
    this._data = data;
  },

  _activateGridCell: function(cell) {
    cell.addClass(this.getClassName('active-cell'));
    this._data[cell.getData('row')*SpriteEditor.GRID_COLUMNS + cell.getData('column')] = 1;
    this._fireDataChange();
  },

  _fireDataChange: function() {
    this._set('data', this._data);
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
    data: { readOnly: true, value: [] }
  }
});

Y.namespace("Game").SpriteEditor = SpriteEditor;
}, "", { requires: ['overlay'] });

