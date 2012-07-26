// Create a new YUI instance and populate it with the required modules.
YUI().use(['overlay', 'event'], function (Y) {
  var SpriteEditor = Y.Base.create("SpriteEditor", Y.Overlay, [], {
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

    _activateGridCell: function(cell) {
      cell.addClass(this.getClassName('active-cell'));
    },

    _createGridCell: function(row, column) {
      var width = this.get("width") / SpriteEditor.GRID_COLUMNS;
      var height = this.get("height") / SpriteEditor.GRID_ROWS;
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
        width: width,
        height: height,
        left: column*width,
        top: row*height
      });

      contentBox.append(cell);
    }
  }, {
    GRID_ROWS: 10,
    GRID_COLUMNS: 10,
    ATTRS: {
      width: { value: 501 },
      height: { value: 501 },
      centered: { value: true }
    }
  });

  var editor = new SpriteEditor();
  editor.render();
});

