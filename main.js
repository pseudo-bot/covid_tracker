const country = document.querySelector("#country");
const states = document.querySelector("#states");
const inputCountry = document.querySelector(".input--country");
const inputState = document.querySelector(".input--states");
const labelStates = document.querySelector(".label--states");
const loader = document.querySelector(".load");

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
	).innerHTML = `<span class="info__title">Confirmed</span><span class="info__data">${global_today.TotalConfirmed}</span><span class="new_cases info__subtitle"><i class='fa fas fa-angle-double-up'></i> ${global_today.NewConfirmed}</span>`;
	document.querySelector(
		".total_recovered"
	).innerHTML = `<span class="info__title">Recovered</span><span class="info__data">${global_today.TotalRecovered}</span><span class="new_recovered info__subtitle"><i class='fa fas fa-angle-double-up'></i> ${global_today.NewRecovered}</span>`;

	if (global_today.NewConfirmed - global_today.NewRecovered < 0) {
		document.querySelector(
			".total_active"
		).innerHTML = `<span class="info__title">Active</span><span class="info__data">${
			global_today.TotalConfirmed - global_today.TotalRecovered
		}</span><span class="new_active info--decrease info__subtitle"><i class='fa fas fa-angle-double-down'></i> ${
			-global_today.NewConfirmed + global_today.NewRecovered
		}</span>`;
	} else {
		document.querySelector(
			".total_active"
		).innerHTML = `<span class="info__title">Active</span><span class="info__data">${
			global_today.TotalConfirmed - global_today.TotalRecovered
		}</span><span class="new_active info__subtitle"><i class='fa fas fa-angle-double-up'></i> ${
			-global_today.NewConfirmed + global_today.NewRecovered
		}</span>`;
	}

	document.querySelector(
		".total_deaths"
	).innerHTML = `<span class="info__title">Deaths</span><span class="info__data">${global_today.TotalDeaths}</span><span class="new_deaths info__subtitle"><i class='fa fas fa-angle-double-up'></i> ${global_today.NewDeaths}</span>`;

	// loader.classList.remove('loading-screen')
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


// Plotting Graphs

async function plotGlobalData(dataToGraph = "TotalConfirmed") {
	loader.classList.add('loading-screen');

	let date = [];
	let ylable = [];
	let label;
	let color;

	const globalResponse = await fetch(`https://api.covid19api.com/world`);
	const globalData = await globalResponse.json();

	globalData.sort((a, b) => (a.TotalConfirmed > b.TotalConfirmed ? 1 : -1));

	for (let values of globalData) {
		let dateToPush = values.Date.substr(0, 10);
		date.push(dateToPush);

		if (dataToGraph === "active") {
			ylable.push(values.TotalConfirmed - values.TotalRecovered);
		} else ylable.push(values[dataToGraph]);
	}

	if (dataToGraph === "TotalConfirmed") {
		label = "Confirmed Cases";
		color = "#64b9f5";
	}

	if (dataToGraph === "TotalRecovered") {
		label = "Total Recovered";
		color = "#86f093";
	}
	if (dataToGraph === "TotalDeaths") {
		label = "Deaths";
		color = "#ff8a8a";
	}
	if (dataToGraph === "active") {
		label = "Active Cases";
		color = "#f7b879";
	}

	plot(date, ylable, label, color);

	loader.classList.remove('loading-screen');
}

function plot(xdata, ydata, label, color) {
    document.querySelector(".chart-container").innerHTML = `<canvas id="global-chart"></canvas>`;
	let chart = document.getElementById("global-chart").getContext("2d");
	let chartDetails = new Chart(chart, {
		type: "bar",
		data: {
			labels: xdata,
			datasets: [
				{
					label: label,
					data: ydata,
					backgroundColor: color,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
		},
	});
}

// Graph Call functions

document.querySelector(".graph-confirm").addEventListener('click', () => {
    
    plotGlobalData('TotalConfirmed');
})

document.querySelector(".graph-recover").addEventListener("click", () => {
    plotGlobalData('TotalRecovered');
})

document.querySelector(".graph-deaths").addEventListener('click', () => {
    plotGlobalData('TotalDeaths');
})

document.querySelector(".graph-active").addEventListener('click', () => {
    plotGlobalData('active');
})

const execute = () => {
	populateCountry();
	populateGlobal();
    plotGlobalData();
};

this.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector(".load").classList.remove('loading-screen');
    document.querySelector(".load").classList.remove('load-start-bg');
    }, 2000);
})

execute();

