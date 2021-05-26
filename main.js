
function menu() {
	const menubar = document.querySelector(".menubar");
	const sideMenu = document.querySelector(".navbar__items");

	menubar.addEventListener("click", () => {
		menubar.classList.toggle("menubar--activate");
		sideMenu.classList.toggle("navbar__items--activate");
	});
}

menu();

const country = document.querySelector("#country");
const inputCountry = document.querySelector('.input--country')
const inputState = document.querySelector('.input--states')


async function data() {
	const response = await fetch(
		"https://api.covid19api.com/summary"
	);
	const values = await response.json();
	return values;
}

(async function populateCountry() {
	const dataC = await data();

	for (let countryVar of dataC.Countries) {
		const countryNode = document.createElement("OPTION");
		countryNode.setAttribute("value", countryVar.Country);
		country.appendChild(countryNode);
	}
})();

inputState.addEventListener('click', () => {
	if (inputCountry.value.toLowerCase() === 'india') {
		inputState.removeAttribute('readonly');
	} else {
		inputState.value = '';
		inputState.setAttribute('readonly', '');
	}
})

