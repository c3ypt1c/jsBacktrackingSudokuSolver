function $(id) {
	return document.getElementById(id);
}

function genSelect() {
	let select = document.createElement("select");
	for (var i = 0; i < 10; i++) {
		let opt = document.createElement("option");
		if(i != 0) 	opt.text = opt.value = i;
		else 		opt.defaultSelected = opt.text = opt.value = " "; 
		select.appendChild(opt);
	}

	let wrapper = document.createElement("div");
	wrapper.classList.add("wrapper");
	wrapper.appendChild(select)
	return wrapper;
}

function getTestGrid() {
	return [[2, 3, 0, 4, 1, 5, 0, 6, 8], 
			[0, 8, 0, 2, 3, 6, 5, 1, 9], 
			[1, 6, 0, 9, 8, 7, 2, 3, 4],
			[3, 1, 7, 0, 9, 4, 0, 2, 5], 
			[4, 5, 8, 1, 2, 0, 6, 9, 7], 
			[9, 2, 6, 0, 5, 8, 3, 0, 1], 
			[0, 0, 0, 5, 0, 0, 1, 0, 2], 
			[0, 0, 0, 8, 4, 2, 9, 0, 3], 
			[5, 9, 2, 3, 7, 1, 4, 8, 6]];
}

function test() {
	setGrid(getTestGrid());
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

	$("reset").addEventListener("click", reset);
	$("test").addEventListener("click", test);

}

function reset() {
	$("table").textContent = "";
	init();
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
	console.table(grid);
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