var possible = new Array(9);
var worker = new Worker("solutionWorker.js");

worker.onmessage = function(e) {
	console.table(e.data);
	setGrid(e.data);
	loading = false;
	$("loading").classList.add("hidden");
};

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
		else return false;
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

function findAllPossible() {
	let grid = getGrid();

	for (var row = 0; row < grid.length; row++) {
		for (var col = 0; col < grid[row].length; col++) {
			possible[row][col] = findPossibleSummary(grid, row, col);
			//grid[row][col]
		}
	}
}

function $(id) {
	return document.getElementById(id);
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

function test() {
	setGrid(getTestGrid());
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
	$("tableWrapper").classList.add("loadedTable");
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