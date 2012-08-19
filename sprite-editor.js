YUI.add('game-sprite-editor', function(Y) {
var MOUSE_LEFT = 1;

var SpriteEditor = Y.Base.create("SpriteEditor", Y.Widget,
  [Y.WidgetPosition, Y.WidgetPositionAlign], {

  initializer: function() {
    this._initClasses();
    this._initStyle();
    this._initImage();

    this.set('align', {
      points: [Y.WidgetPositionAlign.TC, Y.WidgetPositionAlign.TC]
    });

    this.set('alignOn', [{
      node: Y.one('win'),
      eventName: 'resize'
    }]);

    this._isPainting = false;
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
    contentBox.on("gesturemovestart", function(e) {
      if (e.button == MOUSE_LEFT) {
        this._isPainting = true;
      }
    }, null, this);

    contentBox.on("gesturemove", function(e) {
      if (this._isPainting &&
          e.target.hasClass(this.CSS_GRID_CELL)) {
        this._activateGridCell(e.target);
      }
    }, null, this);

    contentBox.on("gesturemoveend", function(e) {
      this._isPainting = false;
    }, null, this);

    contentBox.on("click", function(e) {
      this._activateGridCell(e.target);
    }, this);
  },

  _initClasses: function() {
    this.CSS_GRID_CELL = this.getClassName("grid-cell");
    this.CSS_GRID_CELL_BOTOM = this.getClassName("grid-cell-bottom");
    this.CSS_GRID_CELL_RIGHT = this.getClassName("grid-cell-right");
  },

  // Sets up styles that must be computed dynamically
  _initStyle: function() {
    var cellWidth = this.get("width") / SpriteEditor.GRID_COLUMNS;
    var cellHeight = this.get("height") / SpriteEditor.GRID_ROWS;
    var stylesheet = Y.one("#test_stylesheet").getDOMNode().sheet;

    // Modify the main stylesheet to size the cells, rather than
    // setting the same style on each one individually
    var gridDimensions = "." + this.CSS_GRID_CELL +
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
    var color = this.get('paintColor');

    cell.addClass(this.getClassName('active-cell'));
    this._image.setPixel(
        cell.getData('column'),
        cell.getData('row'),
        [color[0], color[1], color[2], 255]);
    this._fireImageChange();
  },

  _fireImageChange: function() {
    this._set('image', this._image);
  },

  _createGridCell: function(row, column) {
    var cell = Y.Node.create('<div></div>'),
        contentBox = this.get("contentBox");

    cell.addClass(this.CSS_GRID_CELL);
    cell.setData('row', row);
    cell.setData('column', column);

    if (row == SpriteEditor.GRID_ROWS-1) {
      cell.addClass(this.CSS_GRID_CELL_BOTOM);
    }
    if (column == SpriteEditor.GRID_COLUMNS-1) {
      cell.addClass(this.CSS_GRID_CELL_RIGHT);
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
    image: { readOnly: true },
    paintColor: { value: [255, 0, 0] }
  }
});

Y.namespace("Game").SpriteEditor = SpriteEditor;
}, "", { requires: ['event-move', 'overlay', 'game-image'] });

