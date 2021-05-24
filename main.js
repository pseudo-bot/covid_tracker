function menu() {
    const menubar = document.querySelector('.menubar');
    const sideMenu = document.querySelector('.navbar__items');

    menubar.addEventListener('click', () => {
        menubar.classList.toggle('menubar--activate');
        sideMenu.classList.toggle('navbar__items--activate')
    });
}

menu();


const statesUrl = 'states.json';
const statesList = document.querySelector('#statesList');
const stateBtn = document.querySelector('.states_btn');
const districtsList = document.querySelector('#districtsList');
const stateInput = document.querySelector('#states_input');

fetch(statesUrl)
    .then(res => res.json())
    .then(data => {
            for (let state of data['states']) {
                let stateNode = document.createElement(`option`);
                stateNode.setAttribute('value', `${state.state}`);
                statesList.appendChild(stateNode);
            }

            stateBtn.addEventListener('click', () => {
                enterValue();
                console.log(stateInput.value);
                // for (let state of data['states']) {
                //     for (let district of state.districts) {
                //         let districtsNode = document.createElement(`option`);
                //         districtsNode.setAttribute('value', `${district}`);
                //         districtsList.appendChild(districtsNode);
                //     }
                // }
            })
        }
    )

