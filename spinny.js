function $(id) {
	return document.getElementById(id);
}

let spinny = $("spinny"); 
let picgrid = document.createElement("img");
picgrid.id = "grid";
picgrid.src = "Resources/grid.png";
spinny.appendChild(picgrid); 

for (var i = 1; i < 10; i++) {
	let pict = document.createElement("img");
	pict.id = "p" + i;
	pict.classList.add("spinnyImage");
	pict.src = "Resources/" + i + ".png";
	pict.style.animationDelay = "0s, " + i * 0.1 + "s";
	spinny.appendChild(pict);
}