
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

fetch("https://geolocation-db.com/json/ef6c41a0-9d3c-11eb-8f3b-e1f5536499e7/ipv6", {
	mode: 'no-cors'
}).then(res => console.log(res))
