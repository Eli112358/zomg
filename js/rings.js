import { truStorage } from '/javascripts/modules/TruStorage.es6.min.js';
import { data } from '../data/rings.js';

const ringsDefault = [0,0,0,0,0];
const padding = new Array(8).fill(false);
let checkboxes = [];

function decode(byte) {
	let bits = new Array(...parseInt(byte).toString(2)).map(b => b == '1');
	return padding.concat(bits).slice(bits.length);
}

function encode(row) {
	return parseInt(row.map(b => b+0+'').join(''), 2)+'';
}

function save(event) {
	truStorage.setItem('rings', checkboxes.map(boxes => Array.from(boxes).map(b => b.checked)).map(encode));
}

function loadRings() {
	truStorage.setDefault('rings', ringsDefault);
	let rings = truStorage.getItem('rings').map(decode);
	checkboxes.forEach((boxes, i) => boxes.forEach((box, j) => {
		box.addEventListener('change', save);
		box.checked = rings[i][j];
	}));
}

function reset() {
	truStorage.setItem('rings', ringsDefault);
	loadRings();
}

function renderRing(element) {
	if (element.innerHTML) {
		return;
	}
	let id = element.getAttribute('ring');
	let ring = data.rings[id];
	let name = ring.hasOwnProperty('full_name') ? ring.full_name : id.replace(/_/g, ' ');
	let tooltip = document.createElement('a');
	tooltip.href = `https://zomg.fandom.com/wiki/Ring:_${id}`;
	tooltip.innerHTML = `${name}<br/>${ring.stats}`;
	tooltip.target = '_blank';
	let checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.id = id;
	let lock = document.createElement('img');
	lock.classList.add('lock');
	lock.src = 'images/lock.png';
	let img = document.createElement('img');
	let src = encodeURIComponent(name.replace(/ /g, '_'));
	img.src = `https://vignette.wikia.nocookie.net/zomg/images/${ring.img}/Ring_${src}_Alt.png/revision/latest`;
	let label = document.createElement('label');
	label.setAttribute('for', id);
	label.append(img);
	element.append(tooltip);
	element.append(checkbox);
	element.append(lock);
	element.append(label);
}

function renderRingSet(element) {
	if (element.innerHTML) {
		return;
	}
	let id = element.getAttribute('ring-set');
	let set = data.sets[id];
	let name = set.hasOwnProperty('full_name') ? set.full_name : id;
	let tooltip = document.createElement('span');
	tooltip.innerHTML = `${name}<br/>${set.stats}`;
	let img = document.createElement('img');
	img.src = `https://vignette.wikia.nocookie.net/zomg/images/${set.img}/${id}_%28large%29.png/revision/latest`;
	element.append(tooltip);
	element.append(img);
}

function render() {
	Array.from(document.querySelectorAll('.ring')).forEach(renderRing);
	Array.from(document.querySelectorAll('.ring-set')).forEach(renderRingSet);
	checkboxes = Array.from(document.querySelectorAll('.rings tr')).map(tr => Array.from(tr.querySelectorAll('input')));
	loadRings();
}

window.reset = reset;

render();
