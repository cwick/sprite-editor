// Create a new YUI instance and populate it with the required modules.
YUI().use('overlay', function (Y) {
  var SpriteEditor = Y.Base.create("SpriteEditor", Y.Overlay, [], {
    renderUI: function() {
      for (var row=0; row<SpriteEditor.GRID_ROWS; row++) {
        for (var column=0; column<SpriteEditor.GRID_COLUMNS; column++) {
          console.log(row, column);
          this._createGridCell(row, column);
        }
      }
    },

    _createGridCell: function(row, column) {
      var width = (this.get("width") / SpriteEditor.GRID_COLUMNS) - 2;
      var height = (this.get("height") / SpriteEditor.GRID_ROWS) - 2;
      var cell = Y.Node.create('<div></div>'),
          contentBox = this.get("contentBox");

      cell.addClass(this.getClassName('grid-cell'));

      if (row == SpriteEditor.GRID_ROWS-1) {
        cell.addClass(this.getClassName('grid-cell-bottom'));
      }
      if (column == SpriteEditor.GRID_COLUMNS-1) {
        cell.addClass(this.getClassName('grid-cell-right'));
      }

      cell.setStyles({
        width: (this.get("width") / SpriteEditor.GRID_COLUMNS) - 2,
        height: (this.get("height") / SpriteEditor.GRID_ROWS) - 2,
        left: column*width,
        top: row*height
      });

      contentBox.append(cell);
    }
  }, {
    GRID_ROWS: 10,
    GRID_COLUMNS: 10,
    ATTRS: {
      width: { value: 500 },
      height: { value: 500 },
      centered: { value: true }
    }
  });

  var editor = new SpriteEditor();
  editor.render();
});

