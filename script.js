$(function() { // Makes sure that your function is called once all the DOM elements of the page are ready to be used.

        // Called function to update the name, happiness, and weight of our pet in our HTML
    checkAndUpdatePetInfoInHtml();

    // When each button is clicked, it will "call" function for that button (functions are below)
    $('.treat-button').click(clickedTreatButton);
    $('.play-button').click(clickedPlayButton);
    $('.exercise-button').click(clickedExerciseButton);
    $('.name-edit-button').click(clickedNameEditButton);
    $('.name-form').submit(submittedNameForm);
    $('#add-pet-button').click(clickedAddButton);



})


const MIN_WEIGHT = 0;
const MIN_HAPPINESS = 0;
const INIT_NAME = "My Pet Name"

const WEIGHT_INC = 1;
const HAPPINESS_INC = 1;

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
}


function addPet() {
    
}


function displayAction(action, actionButton) {
    const actionIndicatorEl = actionButton
        .parent()
        .parent()
        .siblings('.pet-image-container')
        .find('.action-indicator');
    
    switch(action) {
        case actions.treat:
            actionIndicatorEl.text('Yum!');
            break;
        case actions.play:
            actionIndicatorEl.text('Fun!');
            break;
        case actions.exercise:
            actionIndicatorEl.text("I'm tired!");
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


function clickedTreatButton() {
    // Increase pet happiness
    // Increase pet weight
    displayAction(actions.treat, $(this));
    checkAndUpdatePetInfoInHtml(WEIGHT_INC, HAPPINESS_INC);
}

function clickedPlayButton() {
    // Increase pet happiness
    // Decrease pet weight
    displayAction(actions.play, $(this));
    checkAndUpdatePetInfoInHtml( -WEIGHT_INC, HAPPINESS_INC);
}

function clickedExerciseButton() {
    // Decrease pet happiness
    // Decrease pet weight
    displayAction(actions.exercise, $(this));
    checkAndUpdatePetInfoInHtml(-WEIGHT_INC, -HAPPINESS_INC);
}

function clickedNameEditButton() {
    let clickedButton = $(this);

    const formEl = $(clickedButton.parent().siblings('.name-form')[0]);
    formEl.toggleClass('no-display');

    formEl.find('.name-input').focus();
}

function submittedNameForm(event) {
    event.preventDefault();

    const formEl = $(this);
    formEl.toggleClass('no-display', true); // disable form after submit
    const inputEl = formEl.find(".name-input");
    // update pet name
    pet_info.name = inputEl.val();

    inputEl.val(""); // reset input value
    
    updatePetInfoInHtml();
}

function clickedAddButton() {
    const newPetTemplate = $('#pet-template').clone();
    const newPetEl = $(newPetTemplate).find('.pet-container');

    $('.pets-container').append(newPetEl);
}


function checkAndUpdatePetInfoInHtml(weight_diff, happiness_diff) {
    checkWeightAndHappinessBeforeUpdating(weight_diff, happiness_diff);
    updatePetInfoInHtml();
}


// updates pet_info obj
function checkWeightAndHappinessBeforeUpdating(weight_diff, happiness_diff) {
    // Add conditional so if weight is lower than zero.
    const new_weight = pet_info.weight + weight_diff;
    const new_happiness = pet_info.happiness + happiness_diff;

    pet_info.weight = new_weight > MIN_WEIGHT ? new_weight : MIN_WEIGHT;
    pet_info.happiness = new_happiness > MIN_HAPPINESS ? new_happiness : MIN_HAPPINESS;
}

// Updates your HTML with the current values in your pet_info object
function updatePetInfoInHtml() {
    $('.name').text(pet_info['name']);
    $('.weight').text(pet_info['weight']);
    $('.happiness').text(pet_info['happiness']);
}

