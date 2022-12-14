// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    //compares all elements in row and returns true if there is multiple 1s in row otherwise returns false
    hasRowConflictAt: function(rowIndex) {



      var rows = this.rows(); //this.row is going to point to the row of whatever object is invoking row
      //console.log('rows', rows);
      var row = rows[rowIndex]; // row at the postion of whatever index is passed in
      //console.log('row', row);
      //console.log('board', Board);
      var pieceCount = 0; //keep track of pieces in row
      for (let i = 0; i < row.length; i++) {
        if (row[i] === 1) { // if pieces is in row
          pieceCount++; // add  1 to tracker
        }
        if (pieceCount >= 2) { //if theres more than one piece in row
          return true;
        }
      }
      return false; //returns false if no conflicts

    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {

      var rows = this.rows();
      for (let i = 0; i < rows.length; i++) {
        //var pieceCount = 0;
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;

      // return false; // fixme

    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {

      var rows = this.rows();
      var pieceCount = 0;
      //iterate over rows
      for (let i = 0; i < rows.length; i++) {
        if (rows[i][colIndex] === 1) {
          pieceCount++;
        }
        if (pieceCount >= 2) {
          return true;

        }
      }
      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {


      var rows = this.rows(); //4
      var rowLength = rows.length; //4
      //var start = 0
      for (let i = 0; i < rows.length; i++) {
        //var pieceCount = 0;
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;

    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var row = this.rows();
      var pieceCount = 0;
      var rowLength = row.length; // 4
      // console.log('getetttttttt', this.get('n'))
      rowLength = rowLength - majorDiagonalColumnIndexAtFirstRow;
      //console.log('rowLength', rowLength);
      //iterate through
      ///////////////////////////////////////////////////////
      if (majorDiagonalColumnIndexAtFirstRow < 0) {
        var PosNumber = Math.abs(majorDiagonalColumnIndexAtFirstRow);
        for (let i = PosNumber; i < row.length; i++) {
          if (i === PosNumber) {
            if (row[i][majorDiagonalColumnIndexAtFirstRow] === 1) {
              pieceCount++;
            }
          } else {
            if (row[i][majorDiagonalColumnIndexAtFirstRow++] === 1) {
              pieceCount++;
            }
          }
          if (pieceCount >= 2) {
            return true;
          }

        }
        return false;
      }
      ///////////////////////////////////////////////////////
      for (let i = 0; i < rowLength; i++) {
        // if (this.hasColConflictAt(majorDiagonalColumnIndexAtFirstRow + 1) && (this.hasRowConflictAt(i + 1))) {
        //   return true;
        // }
        if (i === 0) {
          if (row[i][majorDiagonalColumnIndexAtFirstRow] === 1) {
            pieceCount++;
          }
        } else {
          if (row[i][majorDiagonalColumnIndexAtFirstRow++] === 1) {
            pieceCount++;
          }
        }
        if (pieceCount >= 2) {
          return true;
        }

      }
      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {

      var row = this.rows();
      var inverse = -Math.abs(row.length - 1);
      for (let i = inverse; i < row.length; i++) {
        //console.log('ROW HERE,', row[0])

        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme

    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {

      var row = this.rows();
      var pieceCount = 0;
      var rowLength = minorDiagonalColumnIndexAtFirstRow + 1; // 4 if 3 index
      var storeIndex = minorDiagonalColumnIndexAtFirstRow;//3
      var rowGet = this.get('n') - 1;
      console.log('starting Index,', minorDiagonalColumnIndexAtFirstRow);
      //var minorDiagonalColumnIndexAtFirstRow = minorDiagonalColumnIndexAtFirstRow
      //rowLength = rowLength - minorDiagonalColumnIndexAtFirstRow;
      console.log('rowLength', rowLength);

      ///////////////////////////////////////////////
      if (minorDiagonalColumnIndexAtFirstRow > row.length - 1) {
        var index = minorDiagonalColumnIndexAtFirstRow - rowGet;
        for (let i = index; i < row.length; i++) {
          if (i === index) {
            if (row[i][rowGet] === 1) {
              pieceCount++;
            }
          } else {
            if (row[i][rowGet] === 1) {
              pieceCount++;
            }
          }
          if (pieceCount >= 2) {
            return true;
          }
          rowGet--;
        }

        return false;
      }




      ///////////////////////////////////////////////

      //iterate through
      for (var i = 0; i < rowLength; i++) {
        if (i === 0) {
          if (row[i][minorDiagonalColumnIndexAtFirstRow] === 1) {
            pieceCount++;
          }
        } else {
          var store;
          // console.log('index:', i, 'col Index', minorDiagonalColumnIndexAtFirstRow, )
          // console.log('true of false', row[i][minorDiagonalColumnIndexAtFirstRow] === 1)
          if (row[i][minorDiagonalColumnIndexAtFirstRow] === 1) {
            pieceCount++;
          }
        }
        if (pieceCount >= 2) {
          //console.log('NEW ROW INNER', row)
          return true;
        }
        minorDiagonalColumnIndexAtFirstRow--;
      }
      return false; // fixme


    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var row = this.rows();
      var addRows = (row.length - 1) * 2;
      for (let i = 0; i < addRows; i++) {
        //console.log('ROW HERE,', row[0])
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    }


    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
