const country = document.querySelector("#country");
const states = document.querySelector("#states");
const inputCountry = document.querySelector(".input--country");
const inputState = document.querySelector(".input--states");
const totalCases = document.querySelector(".total_cases");
const labelStates = document.querySelector(".label--states");

let today = new Date();

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
	let date = today.getDate();
	let searchDate = `${today.getFullYear()}-${today.getMonth() + 1}-${date}`;

	let values, response;

	while (1) {
		let searchDate = `${today.getFullYear()}-${today.getMonth() + 1}-${date}`;

		let statusUrl = `https://api.covid19api.com/live/country/india/status/confirmed/date/${searchDate}T13:13:30Z`;

		response = await fetch(statusUrl);
		values = await response.json();

		if (values.length == 0) {
			date--;
			continue;
		}

		break;
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

inputCountry.addEventListener("change", () => {
	if (inputCountry.value.toLowerCase() === "india") {
		populateStates();
	} else {
		clearElement(states);
	}
});

inputState.addEventListener("click", () => {
	if (inputCountry.value.toLowerCase() !== "india") {
		labelStates.classList.add("india-notselected");
		setTimeout(() => {
			labelStates.classList.remove("india-notselected");
		}, 2500);
	}
});

async function populateStates() {
	const data = await dataLive();
	console.log(data);
	for (let stateVar of data) {
		const stateNode = document.createElement("OPTION");
		stateNode.setAttribute("value", stateVar.Province);
		states.appendChild(stateNode);
	}
}

async function populateGlobal() {
	const global_today = await dataSummary();
	const global = global_today.Global;

	const totalCases = document.createTextNode(global.TotalConfirmed)
	const totalCases = document.createTextNode(global.TotalConfirmed)
	const totalCases = document.createTextNode(global.TotalConfirmed)
	const totalCases = document.createTextNode(global.TotalConfirmed)

	document.querySelector('.total_cases').appendChild(totalCases);
	console.log(global_today.Global)
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
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

const execute = () => {
	populateCountry();
	// populateGlobal();
};

execute();
