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
	return `${date.getFullYear()}-${
		date.getMonth() + 1
	}-${date.getDate()}`
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

async function sortGlobalResponse(start_date, end_date) {
	const globalResponse = await fetch(
		`https://api.covid19api.com/world?from=${start_date}T00:00:00Z&to=${end_date}T00:00:00Z`
	);
	const globalData = await globalResponse.json();
	globalData.sort((a, b) => (a.TotalConfirmed > b.TotalConfirmed) ? 1 : -1);
	
	return globalData;
}


async function populateGlobal() {
	// Populating global data
	let start_date = new Date();
	let end_date = new Date();

	const global_today_response = await dataSummary();
	const global_today = global_today_response.Global;

	const totalCases = document.createTextNode(global_today.TotalConfirmed);
	const activeCases = document.createTextNode(global_today.TotalConfirmed - global_today.TotalRecovered);
	const recoveredCases = document.createTextNode(global_today.TotalRecovered);
	const totalDeaths = document.createTextNode(global_today.TotalDeaths);
	const newCases = document.createTextNode(global_today.NewConfirmed);
	const newDeaths = document.createTextNode(global_today.NewDeaths)
	const newRecovered = document.createTextNode(global_today.NewRecovered)
    const newActive = document.createTextNode()

	document.querySelector(".total_cases").appendChild(totalCases);
	document.querySelector(".total_recovered").appendChild(recoveredCases);
	document.querySelector(".total_active").appendChild(activeCases);
	document.querySelector(".total_deaths").appendChild(totalDeaths);
    document.querySelector(".new_cases").appendChild(newCases);
    document.querySelector(".new_deaths").appendChild(newDeaths);
    document.querySelector(".new_recovered").appendChild(newRecovered);
    document.querySelector(".new_active").appendChild(newActive);


	// document.querySelector(".new_cases").appendChild()

	let globalData;

	while (1) {
		start_date.setDate(end_date.getDate() - 30)
		let search_date_start = convertDate(start_date);
		let search_date_end =  convertDate(end_date);
		
		globalData = await sortGlobalResponse(search_date_start, search_date_end);

		if (globalData.length > 30) { // If today's response is not updated API gives data by country and not the global data
			end_date.setDate(end_date.getDate() - 1);
			continue;
		}
		
		break;
	}

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
