const padding = new Array(8).fill(false);
let checkboxes = [];
function decode(byte) {
	let bits = new Array(...parseInt(byte).toString(2)).map(b => b == "1");
	return padding.concat(bits).slice(bits.length);
}
function encode(row) {
	return parseInt(row.map(b => b+0+"").join(""), 2)+"";
}
function save(event) {
	localStorage.rings = checkboxes.map(boxes => Array.from(boxes).map(b => b.checked)).map(encode);
}
function loadRings() {
	let rings = (localStorage.rings || "0,0,0,0,0").split(",").map(decode);
	checkboxes.forEach(boxes => boxes.forEach(box => {
		box.addEventListener("change", save);
		box.checked = rings[checkboxes.indexOf(boxes)][boxes.indexOf(box)];
	}));
}
function reset() {
	localStorage.rings = "";
	loadRings();
}
function load() {
	insertCodeFromFile({'path': 'https://eli112358.github.io/snippets/header.txt', 'id': 'header', 'func': () => {}});
	checkboxes = Array.from(document.querySelectorAll("tr")).map(tr => Array.from(tr.querySelectorAll("input")));
	loadRings()
}
