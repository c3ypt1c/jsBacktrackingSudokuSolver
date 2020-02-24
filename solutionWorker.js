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
	let colVals = findPossibleCol(grid, col);
	let quaVals = findPossibleQua(grid, Math.floor(row / 3), Math.floor(col / 3));
	let currentPossible = [];

	for (var i = 1; i < 10; i++) {
		if(rowVals.in(i) && colVals.in(i) && quaVals.in(i)) currentPossible.push(i);
	}

	return currentPossible;
}

function findAllPossibleLocal(grid) {
	possibleLocal = []
	var possible = new Array(9);
	for (var i = 0; i < 9; i++) {
		possibleLocal[i] = new Array(9); //populate arrays
	}

	for (var row = 0; row < grid.length; row++) {
		for (var col = 0; col < grid[row].length; col++) {
			if (grid[row][col] != 0) possibleLocal[row][col] = findPossibleSummary(grid, row, col);
			else possibleLocal[row][col] = [];
		}
	}
	return possibleLocal;
}

function checkSolved(grid) {
	for (var row = grid.length - 1; row >= 0; row--) {
		for (var col = grid[row].length - 1; col >= 0; col--) {
			if(grid[row][col] == 0) return false;
			let tmp = grid[row][col];
			grid[row][col] = 0;
			let tmpResults = findPossibleSummary(grid, row, col);
			grid[row][col] = tmp;
			if(tmpResults.length != 1) return false;
		}
	}
	return true;
}

function backtracking(grid, iteration) {
	//debugger;
	let row = Math.floor(iteration/9);
	let col = iteration % 9;
	
	//console.log(grid);
	//console.log(row);
	//console.log(col);
	
	if(checkSolved(grid)) return grid;

	if(grid[row][col] != 0) return backtracking(grid, iteration+1);


	let possibleLocal = findPossibleSummary(grid, row, col);

	let tmp = grid[row][col];

	for (var i = 0; i < possibleLocal.length; i++) {
		grid[row][col] = possibleLocal[i];
		if(checkSolved(grid)) return grid;

		let result = backtracking(grid, iteration+1);
		if(result !== false) return result;
	}

	grid[row][col] = tmp;

	return false; //failed to solve or out of options
}

function reduce(grid) {
	let possible = findAllPossibleLocal(grid);

	do {
		changed = false;
		for (var row = 0; row < possible.length; row++) {
			for (var col = 0; col < possible[row].length; col++) {
				if(grid[row][col] == 0 && possible[row][col].length == 1) {
					grid[row][col] = possible[row][col][0];
					changed = true;
				}
			}
		}

		possible = findAllPossibleLocal(grid);
	} while (changed);

	return grid;
}

function solve(e) {
	let grid = e.data;
	//grid = reduce(grid);
	//debugger;
	if(!checkSolved(grid)) grid = backtracking(grid, 0);
	self.postMessage(grid);
}

self.addEventListener('message', solve, false);