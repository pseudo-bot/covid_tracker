const country = document.querySelector("#country");
const states = document.querySelector("#states");
const inputCountry = document.querySelector(".input--country");
const inputState = document.querySelector(".input--states");
const labelStates = document.querySelector(".label--states");

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

function convertDate(date) {
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

async function dataSummary() {
	// API for fetching world data
	const response = await fetch("https://api.covid19api.com/summary");
	const values = await response.json();
	return values;
}

async function dataLive() {
	// API for fetching live data of a country from specified date
	let date = new Date();

	let values, response;

	while (1) {
		let searchDate = convertDate(date);
		let statusUrl = `https://api.covid19api.com/live/country/india/status/confirmed/date/${searchDate}T13:13:30Z`;

		response = await fetch(statusUrl);
		values = await response.json();

		if (values.length == 0) {
			date.setDate(date.getDate() - 1);
			continue;
		}

		break;
	}

	return values;
}

// Search functions

async function populateCountry() {
	// Populating country names
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
	// Populating states if country == india
	const data = await dataLive();
	console.log(data);
	for (let stateVar of data) {
		const stateNode = document.createElement("OPTION");
		stateNode.setAttribute("value", stateVar.Province);
		states.appendChild(stateNode);
	}
}

async function populateGlobal() {
	// Populating global data
	const global_today_response = await dataSummary();
	const global_today = global_today_response.Global;

	document.querySelector(
		".total_cases"
	).innerHTML = `${global_today.TotalConfirmed}<span class="new_cases"> ${global_today.NewConfirmed}</span>`;
	document.querySelector(
		".total_recovered"
	).innerHTML = `${global_today.TotalRecovered}<span class="new_recovered"> ${global_today.NewRecovered}</span>`;

	if (global_today.NewConfirmed - global_today.NewRecovered < 0) {
		document.querySelector(".total_active").innerHTML = `${
			global_today.TotalConfirmed - global_today.TotalRecovered
		}<span class="new_active info--decrease"> ${
			-global_today.NewConfirmed + global_today.NewRecovered
		}</span>`;
	} else {
		document.querySelector(".total_active").innerHTML = `${
			global_today.TotalConfirmed - global_today.TotalRecovered
		}<span class="new_active"> ${
			-global_today.NewConfirmed + global_today.NewRecovered
		}</span>`;
	}

	document.querySelector(
		".total_deaths"
	).innerHTML = `${global_today.TotalDeaths}<span class="new_deaths"> ${global_today.NewDeaths}</span>`;

	console.log(global_today.TotalConfirmed - global_today.TotalRecovered);
	console.log(global_today.TotalRecovered);

	const globalResponse = await fetch(`https://api.covid19api.com/world`);
	const globalData = await globalResponse.json();

	globalData.sort((a, b) => (a.TotalConfirmed > b.TotalConfirmed ? 1 : -1));

	console.log(globalData);
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
	populateGlobal();
};

execute();
