// GAME CLASS
class conway {
    constructor(data) {
        this.data = data;
        this.height = data.length;
        this.width = data[0].length;

        this.prevBoard = [];
        this.board = cloneArray(data);
    }

  // RUN THE GAME
    next() {
        this.prevBoard = cloneArray(this.board);

        for (let y=0; y<this.height; y++) {
            for(let x=0; x<this.width; x++) {
							let neigbours = this.aliveNeigbours(this.prevBoard, x, y);

							let aliveCells = this.board[y][x];

              // GAME RULES
							if(aliveCells) {
								if(neigbours < 2 ||neigbours > 3) {
									this.board[y][x] = 0;
								}
							} else {
								if(neigbours === 3) {
									this.board[y][x] = 1;
								}
							}
            }
        }
		}
		
    // CHECK FOR ALIVE NEIGBOURS
		aliveNeigbours(array, x, y) {
			let preRow = array[y-1] || [];
			let nextRow = array[y+1] || [];
			let curRow = array[y];

			return [
				preRow[x-1], preRow[x], preRow[x+1],
				curRow[x-1], curRow[x+1],
				nextRow[x-1], nextRow[x], nextRow[x+1]
			].reduce((prev, cur) => {
				return prev + +!!cur;
			}, 0)
		}

    // CONVERT ARRAY TO STRING
    toString() {
        return this.board.map(function (row) {
            return row.join(' ');
        }).join('\n');
    }
    
};

// CLONE 2D ARRAY
function cloneArray(array) {
    return array.slice().map(function (row) {
        return row.slice();
    })
};

// CLASS TO CREATE GRID TABLE ON THE UI
class gameGrid {
  constructor(table, size) {
    this.grid = table;
    this.size = size;
    this.started = false;
    this.autoplay = false;

    this.createGrid();
  }

  // CREATES THE GRID
  createGrid() {
    let me = this;
    let fragement = document.createDocumentFragment();
    this.grid.innerHTML = '';
    this.checkboxes = [];

    for (let y=0; y<this.size; y++) {
      let row = document.createElement('tr');
      this.checkboxes[y] = [];

      for (let x=0; x<this.size; x++) {
        let cell = document.createElement('td');
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        this.checkboxes[y][x] = checkbox;

        cell.appendChild(checkbox);
        row.appendChild(cell);
        
      }
      fragement.appendChild(row);
    }
    this.grid.addEventListener('change', function (e) {
      if (e.target.nodeName.toLowerCase() == 'input') {
        me.started = false;
      }
    });

    this.grid.appendChild(fragement);
  }

  // CONVERT THE CHECKBOXES TO ARRAY
  get boardArray() {
    return this.checkboxes.map((row) => {
      return row.map((checkbox) => {
        return +checkbox.checked;
      })
    });
  }

  // START GAME
  play() {
    this.game = new conway(this.boardArray);
    this.started = true;
  }

  // CHECK FOR NEIGBOURS ON THE UI
  next() {
    var me = this;
    if (!this.started || this.game){
      this.play();
    }
    this.game.next();

    let board = this.game.board;

    for(let y=0; y<this.size; y++) {
      for(let x=0; x<this.size; x++) {
        this.checkboxes[y][x].checked = !!board[y][x];
    
      }
    }

    // AUTO CHECK FOR NEIGBOURS EVERY 1SEC
    if (this.autoplay) {
      this.timer = setTimeout(() => {
        me.next();
      }, 1000);
    }
  }

};
let table = new gameGrid(document.getElementById('grid'), 12);

// EVENT: NEXT BUTTON
let nextBtn = document.querySelector('.next');

nextBtn.addEventListener('click', next);
function next() {
  table.next();
}

// EVENT: AUTOPLAY

let autoplay = document.querySelector('#autoplay');

autoplay.addEventListener('change', auto);

function auto() {
  nextBtn.textContent = this.checked? 'Start' : 'Next';

  table.autoplay = this.checked;

  if(!this.checked) {
    clearTimeout(life.timer);
  }
}

