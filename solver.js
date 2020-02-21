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

function init() {
	
	let table = $("table");
	for (var row = 0; row < 9; row++) {
		let tr = document.createElement("div");
		tr.classList.add("tableTr");

		for (var col = 0; col < 9; col++) {
			let tc = document.createElement("div");
			tc.classList.add("tableTc");
			let select = genSelect();
			select.id = "table" + row + "" + col;
			tc.appendChild(select);
			tr.appendChild(tc);
		}

		table.appendChild(tr);
	}

	$("reset").addEventListener("click", reset);

}

function reset() {
	$("table").textContent = "";
	init();
}