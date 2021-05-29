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

async function checkAPI(url) {
	const response = await fetch(url);
	const data = await response.json();
	console.log(data);
}

async function dataSummary() {
	// API for fetching world data
	const response = await fetch("https://api.covid19api.com/summary");
	const values = await response.json();
	return values;
}

async function obtainSlug(country) {
	const response = await dataSummary();
	countryArr = response.Countries;
	let slugIndex = countryArr.findIndex(
		(element) => element.Country.toLowerCase() === country.toLowerCase()
	);
	return countryArr[slugIndex].Slug;
}

async function dataDayOneCountry() {
	const response = await fetch(`https://api.covid19api.com/dayone/country/india
	`);

	const countryData = await response.json();
	console.log(countryData);
}

async function dataLiveStates() {
	// API for fetching live data of a country from specified date
	let date = new Date();

	let values, response;

	while (1) {
		let searchDate = convertDate(date);
		let statusUrl = `https://api.covid19api.com/live/country/india`;

		response = await fetch(statusUrl);
		values = await response.json();

		if (values.length == 0) {
			date.setDate(date.getDate() - 1);
			continue;
		}

		break;
	}

	let state = values.filter((element) => element.Province === "Karnataka");
	// console.log(values);

	return values;
}

// dataLive();

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
	for (let stateVar of data) {
		const stateNode = document.createElement("OPTION");
		stateNode.setAttribute("value", stateVar.Province);
		states.appendChild(stateNode);
	}
}

function populateRetrievedData(data, mod) {
	document.querySelector(
		`.total_cases${mod}`
	).innerHTML = `<span class="info__title">Confirmed</span><span class="info__data">${data.TotalConfirmed}</span><span class="new_cases info__subtitle"><i class='fa fas fa-angle-double-up'></i> ${data.NewConfirmed}</span>`;
	document.querySelector(
		`.total_recovered${mod}`
	).innerHTML = `<span class="info__title">Recovered</span><span class="info__data">${data.TotalRecovered}</span><span class="new_recovered info__subtitle"><i class='fa fas fa-angle-double-up'></i> ${data.NewRecovered}</span>`;

	let sign;

	if (data.NewConfirmed - data.NewRecovered < 0) sign = "down";
	else sign = "up";

	document.querySelector(
		`.total_active${mod}`
	).innerHTML = `<span class="info__title">Active</span><span class="info__data">${
		data.TotalConfirmed - data.TotalRecovered
	}</span><span class="new_active info__subtitle"><i class='fa fas fa-angle-double-${sign}'></i> ${
		-data.NewConfirmed + data.NewRecovered
	}</span>`;

	document.querySelector(
		`.total_deaths${mod}`
	).innerHTML = `<span class="info__title">Deaths</span><span class="info__data">${data.TotalDeaths}</span><span class="new_deaths info__subtitle"><i class='fa fas fa-angle-double-up'></i> ${data.NewDeaths}</span>`;
}

async function populateGlobal() {
	// Populating global data

	const global_today_response = await dataSummary();
	const global_today = global_today_response.Global;

	populateRetrievedData(global_today, "G");
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
	loader.classList.add("loading-screen");

	let date = [];
	let ylable = [];
	let label;
	let color, bgcolor;

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
		bgcolor = "#bce3ff";
	}

	if (dataToGraph === "TotalRecovered") {
		label = "Total Recovered";
		color = "#86f093";
		bgcolor = "#cef1d1";
	}
	if (dataToGraph === "TotalDeaths") {
		label = "Deaths";
		color = "#ff8a8a";
		bgcolor = "#f7dddd";
	}
	if (dataToGraph === "active") {
		label = "Active Cases";
		color = "#f7b879";
		bgcolor = "#f9fab7";
	}

	plot(date, ylable, label, color, bgcolor, "global-chart");

	loader.classList.remove("loading-screen");
}

function plot(xdata, ydata, label, color, bgcolor, chartContainer) {
	document.querySelector(
		`.${chartContainer}-container`
	).innerHTML = `<canvas id="global-chart"></canvas>`;
	let chart = document.getElementById(chartContainer).getContext("2d");
	let chartDetails = new Chart(chart, {
		type: "line",
		data: {
			labels: xdata,
			datasets: [
				{
					label: label,
					data: ydata,
					backgroundColor: bgcolor,
					pointRadius: 0,
					borderColor: color,
					borderWidth: 2.502,
					pointHoverRadius: 6,
					fill: true,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
		},
	});
}

// Graph Call functions

const graphConfirm = document.querySelector(".graph-confirm");
const graphRecover = document.querySelector(".graph-recover");
const graphDeaths = document.querySelector(".graph-deaths");
const graphActive = document.querySelector(".graph-active");

graphConfirm.addEventListener("click", () => {
	plotGlobalData("TotalConfirmed");
});

graphRecover.addEventListener("click", () => {
	plotGlobalData("TotalRecovered");
});

graphDeaths.addEventListener("click", () => {
	plotGlobalData("TotalDeaths");
});

graphActive.addEventListener("click", () => {
	plotGlobalData("active");
});

// Geolocation

async function reverseGeolocate(lat, long) {
	const response = await fetch(
		`http://api.positionstack.com/v1/reverse
		?access_key=6a287bd91465208084c6888f04161e81&query=${lat},${long}
		`
	);
	const data = await response.json();
	console.log(data);
}

navigator.geolocation.getCurrentPosition((position) => {
	console.log(position.coords.latitude, position.coords.latitude);
	reverseGeolocate(position.coords.latitude, position.coords.latitude);
});

//  Execute at startup

const execute = () => {
	populateCountry();
	populateGlobal();
	plotGlobalData();
};

this.addEventListener("load", () => {
	setTimeout(() => {
		document.querySelector(".load").classList.remove("loading-screen");
		document.querySelector(".load").classList.remove("load-start-bg");
	}, 2000);
});

execute();
