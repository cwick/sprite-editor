// Create a new YUI instance and populate it with the required modules.
YUI().use('overlay', function (Y) {
  var Test = Y.Base.create("Test", Y.Overlay, [], {
    renderUI: function() {
      for (var row=0; row<Test.GRID_ROWS; row++) {
        for (var column=0; column<Test.GRID_COLUMNS; column++) {
          console.log(row, column);
          this._createGridCell(row, column);
        }
      }
    },

    _createGridCell: function(row, column) {
      var cell = Y.Node.create('<div></div>'),
          contentBox = this.get("contentBox");

      cell.addClass(this.getClassName('grid-cell'));

      if (row == Test.GRID_ROWS-1) {
        cell.addClass(this.getClassName('grid-cell-bottom'));
      }
      if (column == Test.GRID_COLUMNS-1) {
        cell.addClass(this.getClassName('grid-cell-right'));
      }

      cell.setStyles({
        width: (this.get("width") / Test.GRID_COLUMNS) - 2,
        height: (this.get("height") / Test.GRID_ROWS) - 2
      });

      contentBox.append(cell);
    }
  });
  Test.GRID_ROWS=10;
  Test.GRID_COLUMNS=10;

  var overlay = new Test({
    width: 500,
    height: 500,
    centered: true
  });
  overlay.render();
});


// middle
// top
// bottom
// left
// top-left
// top-right
// bottom-left
// bottom-right
