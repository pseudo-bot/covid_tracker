const country = document.querySelector("#country");
const states = document.querySelector("#states");
const inputCountry = document.querySelector(".input--country");
const inputState = document.querySelector(".input--states");
const totalCases = document.querySelector(".total_cases");

function menu() {
	const menubar = document.querySelector(".menubar");
	const sideMenu = document.querySelector(".navbar__items");

	menubar.addEventListener("click", () => {
		menubar.classList.toggle("menubar--activate");
		sideMenu.classList.toggle("navbar__items--activate");
	});
}

menu();

// Animations

this.addEventListener("load", () => {
	document.querySelector(".heading").classList.add("animateOnLoad");
	document.querySelector(".form_section").classList.add("animateOnLoad");
});

async function dataSummary() {
	const response = await fetch("https://api.covid19api.com/summary");
	const values = await response.json();
	return values;
}

async function dataLive() {
	let today = new Date();
	date = today.getDate() - 1;
	let searchDate = `${today.getFullYear()}-${today.getMonth() + 1}-${date}`;

	let statusUrl = `https://api.covid19api.com/live/country/india/status/confirmed/date/${searchDate}T13:13:30Z`;

	const response = await fetch(statusUrl);
	const values = await response.json()

	if (values.length === 0) {
		searchDate = `${today.getFullYear()}-${today.getMonth() + 1}-${date - 1}`;

		statusUrl = `https://api.covid19api.com/live/country/india/status/confirmed/date/${searchDate}T13:13:30Z`;
	
		const responseNew = await fetch(statusUrl);
		const valuesNew = await responseNew.json();
		return valuesNew;
	}

	return values;
}

// Search functions

async function populateCountry() {
	const data = await dataSummary();

	for (let countryVar of data.Countries) {
		const countryNode = document.createElement("OPTION");
		countryNode.setAttribute("value", countryVar.Country);
		country.appendChild(countryNode);
	}
}

inputCountry.addEventListener('change', () => {
	if (inputCountry.value.toLowerCase() === 'india') {
		populateStates();
	} else {
		clearElement(states);
	}
})

async function populateStates() {
	const data = await dataLive();
	console.log(data)
	for (let stateVar of data) {
		const stateNode = document.createElement("OPTION");
		stateNode.setAttribute('value', stateVar.Province);
		states.appendChild(stateNode);
	}
}

async function populateGlobal() {
	const data = await dataSummary();
}

inputState.addEventListener("click", () => {
	if (inputCountry.value.toLowerCase() === "india") {
		inputState.removeAttribute("readonly");
	} else {
		inputState.value = "";
		inputState.setAttribute("readonly", "");
	}
});

function clearElement(element) {
	while(element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

const execute = () => {
	populateCountry();
	populateGlobal();
	dataLive();
};

execute();
