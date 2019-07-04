function $(selector, container) {
  return (container || document).querySelector(selector);
}

(function() {
 
var _ = self.Life = function(seed) {
    this.seed = seed;
    this.height = seed.length;
    this.width= seed[0].length;

    this.prevBoard = [];
    this.board = cloneArray(seed);
};

_.prototype = {
    next: function() {
        this.prevBoard = cloneArray(this.board);

        for (var y=0; y<this.height; y++) {
            for (var x=0; x<this.width; x++) {
                var neighbours = this.aliveNeigbours(this.prevBoard, x, y);

                var alive = !!this.board[y][x];

                if (alive) {
                    if (neighbours < 2 || neighbours > 3) {
                        this.board[y][x] = 0;
                    }
                } else {
                    if (neighbours === 3) {
                        this.board[y][x] = 1;
                    }
                }
            }
        }
    },

    aliveNeigbours: function (array, x, y) {
        var preRow = array[y-1] || [];
        var nextRow = array[y+1] || [];

        return [
            preRow[x-1], preRow[x], preRow[x+1],
            array[y][x-1], array[y][x+1],
            nextRow[x-1], nextRow[x], nextRow[x+1]
        ].reduce(function (prev, cur) {
            return prev + +!!cur;
        }, 0);
    },

    toString: function() {
        return this.board.map(function (row) {
            return row.join(' ');
        }).join('\n');
    }
};

// Helpers
// Warning: Only clone 2D arrays
function cloneArray(array) {
    return array.slice().map(function (row) {
        return row.slice(); 
    });
}

})();

// var game = new Life([
//     [0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0],
//     [0, 0, 1, 1, 1, 0],
//     [0, 1, 1, 1, 0, 0],
//     [0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0]
// ]);

// console.log(game + '');

// game.next();

// console.log(game + '');

// game.next();

// console.log(game + '');

(function(){

var _ = self.LifeView = function (table, size) {
  this.grid = table;
  this.size = size;
  this.started = false;
  this.autoplay = false;

  this.createGrid();

}

_.prototype = {
  createGrid: function() {
    var me = this;
    var fragment = document.createDocumentFragment();
    this.grid.innerHTML = '';
    this.checkboxes = [];

    for (var y=0; y<this.size; y++){
      var row = document.createElement('tr');
      this.checkboxes[y] = [];

      for (var x=0; x<this.size; x++) {
        var cell = document.createElement('td');
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        this.checkboxes[y][x] = checkbox;

        cell.appendChild(checkbox);
        row.appendChild(cell);
      }
      fragment.appendChild(row)
    }
    this.grid.addEventListener('change', function (e) {
      if (e.target.nodeName.toLowerCase() == 'input') {
        me.started = false;
      }
    });

    this.grid.appendChild(fragment);
  },

  get boardArray() {
    return this.checkboxes.map(function (row) {
      return row.map(function (checkbox) {
        return +checkbox.checked;
      });
    });
  },

  play: function() {
    this.game = new Life(this.boardArray);
    this.started = true;
  },

  next: function () {
    var me = this;
    if (!this.started || this.game) {
      this.play();
    }
    this.game.next();

    var board = this.game.board

    for (var y=0; y<this.size; y++) {
      for (var x=0; x<this.size; x++) {
        this.checkboxes[y][x].checked = !!board[y][x];
      }
    }

    if (this.autoplay) {
      this.timer = setTimeout(function() {
        me.next();
      }, 1000);
    }
  }
}
}())

var life = new LifeView(document.getElementById('grid'), 12);

(function() {

  var buttons = {
    next: $('.next')
  }

  buttons.next.addEventListener('click', function() {
    life.next()
  })

  $('#autoplay').addEventListener('change', function() {
    buttons.next.textContent = this.checked? 'Start' : 'Next';

    life.autoplay = this.checked;

    if(!this.checked) {
      clearTimeout(life.timer);
    }
  })

}());
