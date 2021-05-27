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

document.querySelector('.heading').addEventListener('click', () => {
	document.querySelector('.heading').classList.add('.animateOnLoad')
})

const country = document.querySelector("#country");
const inputCountry = document.querySelector(".input--country");
const inputState = document.querySelector(".input--states");
const totalCases = document.querySelector(".total_cases");

async function data_() {
	const response = await fetch("https://api.covid19api.com/summary");
	const values = await response.json();
	return values;
}

// Search functions

async function populateCountry() {
	const data = await data_();

	for (let countryVar of data.Countries) {
		const countryNode = document.createElement("OPTION");
		countryNode.setAttribute("value", countryVar.Country);
		country.appendChild(countryNode);
	}
}

inputState.addEventListener("click", () => {
	if (inputCountry.value.toLowerCase() === "india") {
		inputState.removeAttribute("readonly");
	} else {
		inputState.value = "";
		inputState.setAttribute("readonly", "");
	}
});

async function populateGlobal() {
	const data = await data_();

	
}

const execute = () => {
	populateCountry();
	populateGlobal();
};

execute();
