$(function() { // Makes sure that your function is called once all the DOM elements of the page are ready to be used.

    // Called function to update the name, happiness, and weight of our pet in our HTML

    // When each button is clicked, it will "call" function for that button (functions are below)
    addPet();
    $('#add-pet-button').click(clickedAddButton);



})


const MIN_WEIGHT = 0;
const MIN_HAPPINESS = 0;
const INIT_NAME = "My Pet Name"

const WEIGHT_INC = 1;
const HAPPINESS_INC = 1;


const pets = [];

// Add a variable "pet_info" equal to a object with the name (string), weight (number), and happiness (number) of your pet
const pet_info = {
    name: INIT_NAME,
    weight: MIN_WEIGHT,
    happiness: MIN_HAPPINESS,
};

const actions = { // meant to be like an enum
    treat: 0,
    play: 1,
    exercise: 2,
    changeName: 3,
    changeImage: 4,
}



// EVENT HANDLERS

function clickedTreatButton(event) {
    // Increase pet happiness
    // Increase pet weight
    const petEl = event.data.petEl;
    displayAction(actions.treat, petEl);
    checkAndUpdatePetInfoInHtml(null, WEIGHT_INC, HAPPINESS_INC, petEl);
}

function clickedPlayButton(event) {
    // Increase pet happiness
    // Decrease pet weight
    const petEl = event.data.petEl;
    displayAction(actions.play, petEl);
    checkAndUpdatePetInfoInHtml(null, -WEIGHT_INC, HAPPINESS_INC, petEl);
}

function clickedExerciseButton(event) {
    // Decrease pet happiness
    // Decrease pet weight
    const petEl = event.data.petEl;
    displayAction(actions.exercise, petEl);
    checkAndUpdatePetInfoInHtml(null, -WEIGHT_INC, -HAPPINESS_INC, petEl);
}

function clickedNameEditButton(event) {
    const petEl = event.data.petEl;

    const clickedButton = $(this);

    const formEl = $(clickedButton.parent().siblings('.name-form')[0]);
    formEl.toggleClass('no-display');

    updateEditButtonState(petEl);

    formEl.find('.name-input').focus();
}

function submittedNameForm(event) {
    event.preventDefault();

    const petEl = event.data.petEl;

    const formEl = $(this);
    formEl.toggleClass('no-display', true); // disable form after submit
    updateEditButtonState(petEl);

    const inputEl = formEl.find(".name-input");
    const newName = inputEl.val();
    // update pet name
    inputEl.val(""); // reset input value
    
    checkAndUpdatePetInfoInHtml(newName, 0, 0, petEl);

    displayAction(actions.changeName, petEl);
}

function clickedAddButton() {
    addPet();
}

function mouseEnteredImageContainer(event) {
    const petEl = event.data.petEl;
    const editLabel = petEl.find('.img-edit-label');

    editLabel.toggleClass('no-display', false); // show label
}

function mouseLeftImageContainer(event) {
    const petEl = event.data.petEl;
    const editLabel = petEl.find('.img-edit-label');

    editLabel.toggleClass('no-display', true); // show label
}

function changedImageEditValue(event) {
    const file = event.target.files[0];
    if(!file) return; // no file

    const url = URL.createObjectURL(file);

    const petEl = event.data.petEl;
    const petImage = petEl.find('.pet-image');

    petImage.attr('src', url);

    displayAction(actions.changeImage, petEl);
}



// UTIL FUNCTIONS

function updateEditButtonState(petEl) {
    const clickedButton = petEl.find('.name-edit-button');
    const formEl = petEl.find('.name-form');

    clickedButton.text(formEl.hasClass('no-display') ? "Edit name" : "Cancel");
}


function addPet() {
    const newPetTemplate = $('#pet-template').clone();
    const newPetEl = $(newPetTemplate).find('.pet-container');

    $('.pets-container').append(newPetEl);

    const newPet = {
        element: newPetEl,
        ...pet_info // copy default pet info
    };

    pets.push(newPet);

    // set event listeners for this specific pet element

    newPetEl.find('.treat-button').on('click', { petEl: newPetEl }, clickedTreatButton);
    newPetEl.find('.play-button').on('click', { petEl: newPetEl }, clickedPlayButton);
    newPetEl.find('.exercise-button').on('click', { petEl: newPetEl }, clickedExerciseButton);
    newPetEl.find('.name-edit-button').on('click', { petEl: newPetEl }, clickedNameEditButton);
    newPetEl.find('.name-form').on('submit', { petEl: newPetEl }, submittedNameForm);

    newPetEl.find('.pet-image-container').on('mouseenter', { petEl: newPetEl }, mouseEnteredImageContainer);
    newPetEl.find('.pet-image-container').on('mouseleave', { petEl: newPetEl }, mouseLeftImageContainer);

    newPetEl.find('.img-edit-input').on('change', { petEl: newPetEl }, changedImageEditValue);

    checkAndUpdatePetInfoInHtml(newPet.name, 0, 0, newPet.element);
}


function displayAction(action, petEl) {
    const actionIndicatorEl = petEl.find('.action-indicator');
    
    switch(action) {
        case actions.treat:
            actionIndicatorEl.text('Yum!');
            break;
        case actions.play:
            actionIndicatorEl.text('Fun!');
            break;
        case actions.exercise:
            actionIndicatorEl.text("That's tiring!");
            break;
        case actions.changeName:
            actionIndicatorEl.text("Wow, a new name!");
            break;
        case actions.changeImage:
            actionIndicatorEl.text("Wow, a new look!");
            break;
    }

    actionIndicatorEl.toggleClass('no-display', false);
    actionIndicatorEl.css('opacity', '100%');
    actionIndicatorEl.stop(true, false);

    actionIndicatorEl.fadeTo(1200, 0, () => {
        actionIndicatorEl.toggleClass('no-display', true);
        actionIndicatorEl.css('opacity', '100%');
    })
}


function checkAndUpdatePetInfoInHtml(name, weight_diff, happiness_diff, petEl) {
    // get correct object in pets array
    const petObj = pets.find((p) => p.element.is(petEl)); // compares dom elements
    
    checkWeightAndHappinessBeforeUpdating(name, weight_diff, happiness_diff, petObj);
    updatePetInfoInHtml(petObj);
}


// updates pet_info obj
function checkWeightAndHappinessBeforeUpdating(name, weight_diff, happiness_diff, petObj) {
    // Add conditional so if weight is lower than zero.
    const new_weight = petObj.weight + weight_diff;
    const new_happiness = petObj.happiness + happiness_diff;

    petObj.weight = new_weight > MIN_WEIGHT ? new_weight : MIN_WEIGHT;
    petObj.happiness = new_happiness > MIN_HAPPINESS ? new_happiness : MIN_HAPPINESS;

    if(name) petObj.name = name; // set name if given name is not null
    
}

// Updates your HTML with the current values in your pet_info object
function updatePetInfoInHtml(petObj) {
    petObj.element.find('.name').text(petObj['name']);
    petObj.element.find('.weight').text(petObj['weight']);
    petObj.element.find('.happiness').text(petObj['happiness']);
}

