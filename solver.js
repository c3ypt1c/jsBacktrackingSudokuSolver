var possible = new Array(9);
var worker = new Worker("solutionWorker.js");

worker.onmessage = function(e) {
	console.table(e.data);
	
	$("loading").classList.add("hidden");
	loading = false;

	if(e.data == false) {
		showError(); //show a dialog saying that the puzzle cannot be solved.
	}
	else {
		setGrid(e.data);
		showSolved();
	}
};

function $(id) {
	return document.getElementById(id);
}

function showError() {
	$("failed").classList.remove("hidden");
	setTimeout(hideError, 1500);
}

function hideError() {
	$("failed").classList.add("hidden");
}

function showSolved() {
	$("solved").classList.remove("hidden");
	setTimeout(hideSolved, 1500);
}

function hideSolved() {
	$("solved").classList.add("hidden");
}

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
	let colVals = findPossibleCol(grid, col);
	let quaVals = findPossibleQua(grid, Math.floor(row / 3), Math.floor(col / 3));
	let currentPossible = [];

	for (var i = 1; i < 10; i++) {
		if(rowVals.in(i) && colVals.in(i) && quaVals.in(i)) currentPossible.push(i);
	}

	return currentPossible;
}

function findAllPossible() {
	let grid = getGrid();

	for (var row = 0; row < grid.length; row++) {
		for (var col = 0; col < grid[row].length; col++) {
			possible[row][col] = findPossibleSummary(grid, row, col);
		}
	}
}

function selectUpdate(event) {
	findAllPossible();

	console.log(event);
	let sender = event.target;
	let id = sender.offsetParent.id;
	id = id.substring(6);
	let row = id[0];
	let col = id[1];

	for (var i = 0; i < sender.children.length; i++) {
		if (possible[row][col].in(i)) sender.children[i].classList.add("possible");
		else sender.children[i].classList.remove("possible");
	}

}

function genSelect() {
	let select = document.createElement("select");
	select.addEventListener("click", selectUpdate);

	for (var i = 0; i < 10; i++) {
		let opt = document.createElement("option");
		if(i != 0) 	opt.text = opt.value = i;
		else 		opt.defaultSelected = opt.text = opt.value = " "; 
		select.appendChild(opt);
	}

	let wrapper = document.createElement("div");
	wrapper.classList.add("wrapper");
	wrapper.appendChild(select);
	return wrapper;
}

function getTestGrid() {
	return [[0, 8, 0,  1, 0, 0,  0, 2, 0], 
			[0, 0, 0,  9, 0, 0,  0, 5, 0], 
			[9, 7, 2,  0, 0, 0,  0, 6, 0],

			[4, 0, 0,  0, 2, 6,  0, 0, 0], 
			[0, 0, 0,  0, 5, 0,  7, 0, 0], 
			[8, 0, 1,  0, 0, 0,  0, 0, 0],

			[0, 0, 0,  6, 9, 5,  0, 0, 0], 
			[0, 2, 5,  0, 0, 0,  0, 0, 9], 
			[0, 0, 0,  0, 4, 0,  0, 0, 1]];
}

function genTestGridEasy() {
	return [[2, 3, 0,  4, 1, 5,  0, 6, 8], 
			[0, 8, 0,  2, 3, 6,  5, 1, 9], 
			[1, 6, 0,  9, 8, 7,  2, 3, 4],

			[3, 1, 7,  0, 9, 4,  0, 2, 5], 
			[4, 5, 8,  1, 2, 0,  6, 9, 7], 
			[9, 2, 6,  0, 5, 8,  3, 0, 1], 

			[0, 0, 0,  5, 0, 0,  1, 0, 2], 
			[0, 0, 0,  8, 4, 2,  9, 0, 3], 
			[5, 9, 2,  3, 7, 1,  4, 8, 6]];
}

function test() {
	setGrid(getTestGrid());
}

function testEasy() {
	setGrid(genTestGridEasy());
}

function reset() {
	$("table").textContent = "";
	init();
}

var loading = false;

function startSolver() {
	//show loading page
	if (loading) return false;
	loading = true;
	$("loading").classList.remove("hidden");
	console.log("Sent grid to worker");
	console.table(getGrid());
	worker.postMessage(getGrid());

	return true;
}

function init() {
	
	let table = $("table");
	for (var row = 0; row < 9; row++) {
		let tr = document.createElement("div");
		tr.classList.add("tableTr");

		for (var col = 0; col < 9; col++) {
			let tc = document.createElement("div");
			tc.classList.add("tableTc");
			let select = genSelect();
			select.id = "select" + row + "" + col;
			tc.appendChild(select);
			tr.appendChild(tc);
		}

		table.appendChild(tr);
	}

	$("solve").addEventListener("click", startSolver);
	$("reset").addEventListener("click", reset);
	$("test").addEventListener("click", test);
	$("testEasy").addEventListener("click", testEasy);
	$("tableWrapper").classList.add("loadedTable");
	setTimeout(smoothLoad, 1500);
}

function smoothLoad() {
	$("loadingScreen").classList.add("hidden");
}

function getGrid() {
	let grid = [];
	for (var row = 0; row < 9; row++) {
		grid[row] = [];
		for (var col = 0; col < 9; col++) {
			let select = $("select" + row + "" + col).children[0];
			grid[row][col] = select.selectedIndex;
		}
	}
	return grid;
}

function setGrid(grid) {
	for (var row = 0; row < 9; row++) {
		for (var col = 0; col < 9; col++) {
			let select = $("select" + row + "" + col).children[0];
			select.selectedIndex = grid[row][col];
		}
	}
}