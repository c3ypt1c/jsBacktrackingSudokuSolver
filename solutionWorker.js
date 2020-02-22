possible = []
var possible = new Array(9);

for (var i = 0; i < 9; i++) {
	possible[i] = new Array(9); //populate arrays
}

Array.prototype.in = function(item) {
	return this.indexOf(item) != -1;
}

function findPossibleRow(row) {
	let currentPossible = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	for (var item = row.length - 1; item >= 0; item--) {
		let elem = row[item];
		if(elem == 0) continue;

		let index = currentPossible.indexOf(elem);
		if(index != -1) currentPossible.splice(index,1);
		else return [];
	}
	return currentPossible;
}

function findPossibleCol(grid, col) {
	let rows = [];
	for (var row = grid.length - 1; row >= 0; row--) rows.push(grid[row][col]);

	return findPossibleRow(rows);
}

function findPossibleQua(grid, row, col) {
	let elem = [];
	for (var x = row * 3; x < row * 3 + 3; x++) {
		for (var y = col * 3; y < col * 3 + 3; y++) {
			elem.push(grid[x][y]);
		}
	}
	return findPossibleRow(elem);
}

function findPossibleSummary(grid, row, col) {
	let rowVals = findPossibleRow(grid[row]);
	//console.log(rowVals);
	let colVals = findPossibleCol(grid, col);
	//console.log(colVals);
	let quaVals = findPossibleQua(grid, Math.floor(row / 3), Math.floor(col / 3));
	//console.log(quaVals);
	let currentPossible = [];

	for (var i = 1; i < 10; i++) {
		if(rowVals.in(i) && colVals.in(i) && quaVals.in(i)) currentPossible.push(i);
	}

	return currentPossible;
}

function findAllPossible(grid) {
	for (var row = 0; row < grid.length; row++) {
		for (var col = 0; col < grid[row].length; col++) {
			possible[row][col] = findPossibleSummary(grid, row, col);
			//grid[row][col]
		}
	}
}

function solve(e) {
	let grid = e.data;
	findAllPossible(grid);

	do { //fist, reduce
		//console.log(grid);
		changed = false;
		for (var row = 0; row < possible.length; row++) {
			for (var col = 0; col < possible[row].length; col++) {
				if(grid[row][col] == 0 && possible[row][col].length == 1) {
					grid[row][col] = possible[row][col][0];
					changed = true;
				}
			}
		}

		findAllPossible(grid);
	} while (changed);

	self.postMessage(grid);
}

self.addEventListener('message', solve, false);