Array.prototype.in = function(item) { 	//adds a functions which checks if an items is in an array
	return this.indexOf(item) != -1; 	//returns true if function finds the item, false if not
}

function findPossibleRow(row) { //this looks for possible values for a row in a grid
								//by eliminating the possibilities one by one by linear searching a row and removing items
	let currentPossible = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	for (var item = row.length - 1; item >= 0; item--) {
		let elem = row[item];
		if(elem == 0) continue; //ignores 0 as it is an empty space

		let index = currentPossible.indexOf(elem);
		if(index != -1) currentPossible.splice(index,1);
		else return [];	//two of the same kind of element in a row
	}
	return currentPossible; //returns the an array of possibilities that have not been eliminated
}

function findPossibleCol(grid, col) {	//this looks for possible values for a column in a grid. it
										//flips a column on its side, and then uses findPossibleRow function to locate
	let rows = [];						//the possibilities. Uses its output. have a look at the return of findPossibleRow
	for (var row = grid.length - 1; row >= 0; row--) rows.push(grid[row][col]); //as it is literally that.

	return findPossibleRow(rows); //returns the an array of possibilities that have not been eliminated
}

function findPossibleQua(grid, row, col) {//this looks for possible values in a 3x3 quadrant in a grid.
	//the 9x9 grid is split into 3x3 even quadrants. use row and col to select them respectively. 
	let elem = [];
	for (var x = row * 3; x < row * 3 + 3; x++) {
		for (var y = col * 3; y < col * 3 + 3; y++) {
			elem.push(grid[x][y]);	//it collects the items from the 3x3 quadrant and adds them to the list
		}
	}
	return findPossibleRow(elem); //returns the an array of possibilities that have not been eliminated
}

function findPossibleSummary(grid, row, col) {	//combines the possible numbers to get the possible numbers
	let rowVals = findPossibleRow(grid[row]);	//from the row, column, and quadrant. 
	let colVals = findPossibleCol(grid, col);	
	let quaVals = findPossibleQua(grid, Math.floor(row / 3), Math.floor(col / 3));
	let currentPossible = [];

	//if a number is in all of the list, it's added to the possible list for the specific square
	for (var i = 1; i < 10; i++) if(rowVals.in(i) && colVals.in(i) && quaVals.in(i)) currentPossible.push(i); 

	return currentPossible; //returns a possible number for a specific square
}

function findAllPossibleLocal(grid) { 	//returns a 3d array (n x 9 x 9) that contains the possible numbers for that 
										//specific square in respect to the grid array.
										//it's called local because it does not interfere with the global `possible` array.
	possibleLocal = []
	var possible = new Array(9); //populate arrays
	for (var i = 0; i < 9; i++) {
		possibleLocal[i] = new Array(9); //populate arrays
	}

	for (var row = 0; row < grid.length; row++) {
		for (var col = 0; col < grid[row].length; col++) {
			if (grid[row][col] != 0) possibleLocal[row][col] = findPossibleSummary(grid, row, col); //only check 0s
			else possibleLocal[row][col] = [];
		}
	}
	return possibleLocal;
}

function checkSolved(grid) { //checks if a grid is solved
	for (var row = grid.length - 1; row >= 0; row--) {
		for (var col = grid[row].length - 1; col >= 0; col--) {
			if(grid[row][col] == 0) return false;
			let tmp = grid[row][col];
			grid[row][col] = 0; 	//temporarily sets the grid value to 0
			let tmpResults = findPossibleSummary(grid, row, col);
			grid[row][col] = tmp; 	//returns the grid value to 0
			if(tmpResults.length != 1) return false;//checks if there is no other result possible (or no result).
													//This works because if there is 1 result, it must be the tmp value, thus correct.
													//if you do this for every value, and all of them are correct, then the whole grid
													//is correct. 
		}
	}
	return true;
}

function backtracking(grid, iteration) {//by using the backtracking algorithm recursively, the grid slowly is filled up with more items.
										//it starts at [0][0] on the grid, then increases in the column, then the row, until the grid is solved.
	let row = Math.floor(iteration/9);
	let col = iteration % 9;
	
	if(checkSolved(grid)) return grid; //checks if the grid is solved.

	if(grid[row][col] != 0) return backtracking(grid, iteration+1); //the algo should only check contents with 0. This skips that.


	let possibleLocal = findPossibleSummary(grid, row, col);//finds the possible numbers for this specific grid element. 
															//This is done again because the grid was changed over time.

	let tmp = grid[row][col]; 	//Sets a temporary variable that stores the value
								//This is because arrays are pass by reference. If, for example, this function advanced 3 iterations
								//and found that there are no possible values, it would not return the 0 back to where it was.
								//have a look at this:
								//```js
								//let a = ["cat", "dog", "hog"];
								//let b = a;
								//a[0] = "bog";
								//console.log(b); //["bog", "dog", "hog"]
								//```
								//This kind of js behavior is what I'm trying to not have here as grid would get changed and not changed back
								//It was one of the bugs with the program.

	for (var i = 0; i < possibleLocal.length; i++) {
		grid[row][col] = possibleLocal[i];
		if(checkSolved(grid)) return grid; 	//if the backtracking algo solves the grid, it will return the result.

		let result = backtracking(grid, iteration+1);
		if(result !== false) return result; //If the backtracking algo succeeds, it will return the result.
	}

	grid[row][col] = tmp; //returns temp back to what it was

	return false; //failed to solve or out of options
}

function reduce(grid) { //quickly tries solving the grid by reduction.
						//reduction is where an element in the grid has only got one possible number.
						//the function loops until the grid is solved or when it can no longer find single possible number elements.
						//it is good to do this at the start as it is cheap, it could solve the grid and if not, it could possibly
						//reduce the guesses that the backtracking algorithm has to solve. 

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

function containsDuplicates(row) { //returns false if there are duplicate items, if not returns true
	let current = [];
	for (var item = row.length - 1; item >= 0; item--) {
		if(row[item] == 0) continue; //skip 0s
		if(current.in(row[item])) return true;
		current.push(row[item]);
	}

	return false;
}

function checkDuplicateCol(grid, col) {	
	let rows = [];
	for (var row = grid.length - 1; row >= 0; row--) rows.push(grid[row][col]); 

	return containsDuplicates(rows); 
}

function checkDuplicateQua(grid, row, col) {
	let elem = [];
	for (var x = row * 3; x < row * 3 + 3; x++) {
		for (var y = col * 3; y < col * 3 + 3; y++) {
			elem.push(grid[x][y]);	
		}
	}
	return containsDuplicates(elem); 
}

function checkPossible(grid) { //this function checks for duplicate values in the grid
	for (var row = grid.length - 1; row >= 0; row--) {
		if(containsDuplicates(grid[row])) return false;
		if(checkDuplicateCol(grid, row)) return false;
	}

	for (var row = 0; row < 3; row++) {
		for (var col = 0; col < 3; col++) {
			if(checkDuplicateQua(grid, row, col)) return false;
		}
	}

	return true;
}

function solve(e) { //where the worker receives instructions. 
	let grid = e.data;
	if(checkPossible(grid)) {
		grid = reduce(grid);
		if(!checkSolved(grid)) grid = backtracking(grid, 0);
	} 

	else grid = false;

	self.postMessage(grid);
}

self.addEventListener('message', solve, false); //adds a listener to receive instructions