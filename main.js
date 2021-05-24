function menu() {
  const menubar = document.querySelector(".menubar");
  const sideMenu = document.querySelector(".navbar__items");

  menubar.addEventListener("click", () => {
    menubar.classList.toggle("menubar--activate");
    sideMenu.classList.toggle("navbar__items--activate");
  });
}

menu();

const statesUrl = "states.json";
const statesList = document.querySelector("#statesList");
const stateBtn = document.querySelector(".states_btn");
const districtsList = document.querySelector("#districtsList");
const stateInput = document.querySelector("#states_input");

fetch(statesUrl)
  .then((res) => res.json())
  .then((data) => {
    for (let state of data["states"]) {
      let stateNode = document.createElement(`option`);
      stateNode.setAttribute("value", `${state.state}`);
      statesList.appendChild(stateNode);
    }

    stateBtn.addEventListener("click", () => {
      removeAllNodes(districtsList);

      if (!stateInput.value) return;

      const stateIndex = data["states"].findIndex(
        (element) => element.state === stateInput.value
      );

      for (let district of data["states"][stateIndex].districts) {
        let districtNode = document.createElement("option");
        districtNode.setAttribute("value", `${district}`);
        districtsList.appendChild(districtNode);
      }
    });
  });

function removeAllNodes(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
