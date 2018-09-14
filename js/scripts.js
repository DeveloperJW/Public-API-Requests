const gallery=document.querySelector('#gallery');
const NUMBER_OF_EMPLOYEES=12;// set the number of employees that would be shown on each page
const search=document.querySelector('div.search-container');
search.innerHTML=` <form action="#" method="get">
                        <input type="search" id="search-input" class="search-input" placeholder="Search...">
                        <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
                    </form>`;


//---
//Fetch Functions
//---
fetch('https://randomuser.me/api/?results=12&nat=us')
    .then(checkStatus)
    .then(response => response.json())
    .then(data => generateEmployee(data))
    .catch(function (err) {
        console.log(err);
    });

// ---
// HELPER FUNCTIONS
// ---
function checkStatus(response){
    if (response.ok) {
        return Promise.resolve(response)
    } else{
        return Promise.reject(new Error(response.statusText));
    }
}

/**
 * getIndex takes parameter of <div class='card'> and loops through AJAX data
 * return the index of the item and the index is been used to pass to showEmployeeModal function
 * and generate corresponding Modal window
 * @param item
 * @returns {number}
 */
function getIndex(item){
    for (let i=0; i<NUMBER_OF_EMPLOYEES; i++){
        if (item===gallery.children[i]){
            return i;
        }
    }
}

function closeModal(){
    const currentDiv=document.body.lastElementChild;
    document.body.removeChild(currentDiv);
}

function hideCard(index){
    let allCards=document.querySelectorAll('.card');
    allCards[index].style.display='none';
}

function showCard(index){
    let allCards=document.querySelectorAll('.card');
    allCards[index].style.display='';
}

function resetCard() {
    let allCards=document.querySelectorAll('.card');
    for (let i=0; i<NUMBER_OF_EMPLOYEES; i++){
        allCards[i].style.display='';
    }
}

/**
 * showEmployee takes index number and Ajax data as parameter
 * this method is used to generate modal window
 * @param index
 * @param data
 */
function showEmployeeModal(index, data){
    const current = data.results[index];
    const cLocation = data.results[index].location;
    let modalHtml = `<div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${current.picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${current.name.first} ${current.name.last}</h3>
                        <p class="modal-text">${current.email}</p>
                        <p class="modal-text cap">${current.location.city}</p>
                        <hr>
                        <p class="modal-text">${current.cell}</p>
                        <p class="modal-text">${cLocation.street}., ${cLocation.city}, ${cLocation.state} ${cLocation.postcode} </p>
                        <p class="modal-text">Birthday: ${current.dob.date}</p>
                    </div>
                </div>
            <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>`;
    //create div with class modal-container and append to body
    let modalDiv=document.createElement("div");
    modalDiv.className='modal-container';
    document.body.appendChild(modalDiv);
    modalDiv.innerHTML=modalHtml;
    // add event listener for button which close the modal window
    const closeButton=modalDiv.querySelector('#modal-close-btn');
    closeButton.addEventListener("click", ()=>{
        closeModal();//call the function to close the modal window
    });
    //event listener for previous and next button
    let previousButton=document.getElementById('modal-prev');
    let nextButton=document.getElementById('modal-next');
    //if the modal show the head of the employee list, the previous button is disabled
    if (index <=0){
        previousButton.disabled=true;
    }
    //if the modal shows the tail of the employee list, the next button is disabled
    if (index>=NUMBER_OF_EMPLOYEES-1){
        nextButton.disabled=true;
    }
    previousButton.addEventListener('click', function () {
        closeModal();
        previousButton.disabled=false;
        nextButton.disabled=false;
        showEmployeeModal(index-1, data);
    });

    nextButton.addEventListener('click', function () {
        closeModal();
        previousButton.disabled=false;
        nextButton.disabled=false;
        showEmployeeModal(index+1, data);
    });

}

/**
 * generateEmployee loops through AJAX data and show all employees to the page
 * @param data
 */
function generateEmployee(data){
    let cardHtml=``;
    for (let i=0; i<NUMBER_OF_EMPLOYEES; i++){
        let current=data.results[i];
        cardHtml+=`<div class="card"><div class="card-img-container">`;
        cardHtml+=`<img class="card-img" src="${current.picture.large}" alt="profile picture">`;
        cardHtml+=`</div>`;
        //add details
        cardHtml+=`<div class="card-info-container">
            <h3 id="name" class="card-name cap">${current.name.first} ${current.name.last}</h3>
            <p class="card-text">${current.email}</p>
            <p class="card-text cap">${current.location.city}, ${current.location.state}</p>
            </div>
            </div>`;

    }//end of for loop
    //add event listener when user click on any of the div with class='card'
    document.getElementById('gallery').innerHTML=cardHtml;
    let cardDiv=document.querySelectorAll('.card');
    cardDiv.forEach(item=>item.addEventListener('click',function () {
        showEmployeeModal(getIndex(item), data);//show the corresponding modal window
    }));
    //add event listener for search button
    const searchButton=document.getElementById('serach-submit');
    searchButton.addEventListener('click',function (event) {
        event.preventDefault();
        resetCard();//reset div.card style before search
        let searchInput=document.getElementById('search-input');
        for (let i=0; i<NUMBER_OF_EMPLOYEES;i++){
            if (data.results[i].name.first.includes(searchInput.value)
                || data.results[i].name.last.includes(searchInput.value)){
                console.log('There are matches');
                showCard(i);
            } else{
                hideCard(i);
            }
        }

    });
}

