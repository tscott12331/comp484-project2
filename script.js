$(function() { // Makes sure that your function is called once all the DOM elements of the page are ready to be used.

    // add a pet with some initial values
    addPet({
        name: "Dog",
        weight: 5,
        happiness: 5,
        image: "images/doberman.png",
    });

    $('#add-pet-button').click(clickedAddButton);
})



// CONSTANTS

const MIN_WEIGHT = 0;
const MIN_HAPPINESS = 0;
const INIT_NAME = "My Pet Name"

const WEIGHT_INC = 1;
const HAPPINESS_INC = 1;

const IMG_PLACEHOLDER_SRC = 'images/placeholder.svg';


// constant ref of an array holding all the pets that have been created
const pets = [];

// default values for a pet object (also shows the structure of a pet object)
const PET_INFO = {
    name: INIT_NAME,
    weight: MIN_WEIGHT,
    happiness: MIN_HAPPINESS,
    image: IMG_PLACEHOLDER_SRC,
};

// pseudo enum structure representing different actions a user can take
const actions = { // meant to be like an enum
    treat: 0,
    play: 1,
    exercise: 2,
    changeName: 3,
    changeImage: 4,
}




// OBJECT CONSTRUCTORS
function Pet(petInfo) {
    this.element = petInfo.element;
    this.name = petInfo.name;
    this.weight = petInfo.weight;
    this.happiness = petInfo.happiness;
    this.image = petInfo.image;
}




// EVENT HANDLERS

function clickedTreatButton(event) {
    // Increase pet happiness
    // Increase pet weight
    
    // retrieve button's containing pet element
    const petEl = event.data.petEl;

    // display treat action for this pet
    displayAction(actions.treat, petEl);

    // update pet info
    checkAndUpdatePetInfoInHtml(null, null, WEIGHT_INC, HAPPINESS_INC, petEl);
}

function clickedPlayButton(event) {
    // Increase pet happiness
    // Decrease pet weight
    
    // retrieve button's containing pet element
    const petEl = event.data.petEl;

    // display play action for this pet
    displayAction(actions.play, petEl);

    // update pet info
    checkAndUpdatePetInfoInHtml(null, null, -WEIGHT_INC, HAPPINESS_INC, petEl);
}

function clickedExerciseButton(event) {
    // Decrease pet happiness
    // Decrease pet weight

    // retrieve button's containing pet element
    const petEl = event.data.petEl;

    // display exercise action for this pet
    displayAction(actions.exercise, petEl);

    // update pet info
    checkAndUpdatePetInfoInHtml(null, null, -WEIGHT_INC, -HAPPINESS_INC, petEl);
}

function clickedNameEditButton(event) {
    // retrieve button's containing pet element
    const petEl = event.data.petEl;

    // retrieve the form element
    const formEl = petEl.find('.name-form');

    // toggle the display of the edit form
    formEl.toggleClass('no-display');

    // update the text within the edit button based on form display state
    updateEditButtonState(petEl);

    // focus the edit input (will work when displayed)
    formEl.find('.name-input').focus();
}

function submittedNameForm(event) {
    event.preventDefault();

    // retrieve form's containing pet element
    const petEl = event.data.petEl;

    // retrive form that triggered this submit event
    const formEl = $(this);

    // hide form after submit
    formEl.toggleClass('no-display', true);
    // update edit button based on form display state
    updateEditButtonState(petEl);

    // get form input element
    const inputEl = formEl.find(".name-input");
    // get user typed name
    const newName = inputEl.val();
    // reset input value
    inputEl.val("");
    
    // update pet name
    checkAndUpdatePetInfoInHtml(newName, null, 0, 0, petEl);

    // display name change action for this pet
    displayAction(actions.changeName, petEl);
}

function clickedAddButton() {
    addPet();
}

function mouseEnteredImageContainer(event) {
    // retrieve image container's containing pet element
    const petEl = event.data.petEl;

    // get label surrounding image input
    const editLabel = petEl.find('.img-edit-label');

    // enable image input display
    editLabel.toggleClass('no-display', false); // show label
}

function mouseLeftImageContainer(event) {
    // retrieve image container's containing pet element
    const petEl = event.data.petEl;
    // get label surrounding image input
    const editLabel = petEl.find('.img-edit-label');

    // enable image input display
    editLabel.toggleClass('no-display', true); // show label
}

function changedImageEditValue(event) {
    // get image file that user input
    const file = event.target.files[0];
    if(!file) return; // no file, don't try to create url

    // retrieve image input's containing pet element
    const petEl = event.data.petEl;

    // create src url for inputted image
    const url = URL.createObjectURL(file);

    // update pet image
    checkAndUpdatePetInfoInHtml(null, url, 0, 0, petEl);
    
    // display image change action for this pet
    displayAction(actions.changeImage, petEl);
}




// UTIL FUNCTIONS

function updateEditButtonState(petEl) {
    const clickedButton = petEl.find('.name-edit-button');
    const formEl = petEl.find('.name-form');

    // update the text of the edit button based on the form's display
    clickedButton.text(formEl.hasClass('no-display') ? "Edit name" : "Cancel");
}


function addPet(initInfo) {
    // use initInfo if it exists
    const newPetInfo = initInfo ?? PET_INFO;

    // clone hidden template in DOM
    const newPetTemplate = $('#pet-template').clone();

    // get the actual content within the clone and append it
    const newPetEl = $(newPetTemplate).find('.pet-container');

    /*
        * SIGNED UP METHOD .append()
        * This method appends the passed in element to child elements
        * of the caller.
        *
        * In this case, the caller is the ".pets-container" and the
        * passd in element is "newPetEl."
        *
        * I used this method to append new pet elements to the ".pets-container"
    */
    $('.pets-container').append(newPetEl);


    newPetInfo.element = newPetEl;

    // create new pet object
    const newPet = new Pet(newPetInfo);

    // push pet object to pets array
    pets.push(newPet);

    // update pet info in html
    checkAndUpdatePetInfoInHtml(null, null, 0, 0, newPet.element);

    // set event listeners for this specific pet element

    newPetEl.find('.treat-button').on('click', { petEl: newPetEl }, clickedTreatButton);
    newPetEl.find('.play-button').on('click', { petEl: newPetEl }, clickedPlayButton);
    newPetEl.find('.exercise-button').on('click', { petEl: newPetEl }, clickedExerciseButton);
    newPetEl.find('.name-edit-button').on('click', { petEl: newPetEl }, clickedNameEditButton);
    newPetEl.find('.name-form').on('submit', { petEl: newPetEl }, submittedNameForm);

    newPetEl.find('.pet-image-container').on('mouseenter', { petEl: newPetEl }, mouseEnteredImageContainer);
    newPetEl.find('.pet-image-container').on('mouseleave', { petEl: newPetEl }, mouseLeftImageContainer);

    newPetEl.find('.img-edit-input').on('change', { petEl: newPetEl }, changedImageEditValue);
}


function displayAction(action, petEl) {
    // get the pet element's action indicator
    const actionIndicatorEl = petEl.find('.action-indicator');
    
    // display different text for different actions
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

    // ensure that when an action occurs, the indicator is showing
    actionIndicatorEl.toggleClass('no-display', false);
    actionIndicatorEl.css('opacity', '100%');

    // stop any animations this indicator is performing
    actionIndicatorEl.stop(true, false);

    // perform fade animation to make indicator dissapear after 1.2 seconds
    /*
        * SIGNED UP METHOD .fadeTo
        * This method performs a fade animation on the caller with some options.
        *
        * You can specify the duration of the animation, how much you want the
        * element to fade, the animation easing, and a callback function that is
        * executed when the animation finishes.
        *
        * I used this method to fade out the action indicator after it displays
        * an action that the user took.
    */
    actionIndicatorEl.fadeTo(1200, 0, () => {
        actionIndicatorEl.toggleClass('no-display', true);
        actionIndicatorEl.css('opacity', '100%');
    })
}


function checkAndUpdatePetInfoInHtml(name, image, weightDiff, happinessDiff, petEl) {
    // get correct object in pets array
    const petObj = pets.find((p) => p.element.is(petEl)); // compares dom elements
    
    // make sure pet object gets updated correctly
    checkWeightAndHappinessBeforeUpdating(name, image, weightDiff, happinessDiff, petObj);
    // update html based on pet object
    updatePetInfoInHtml(petObj);
}


// updates a petObject
function checkWeightAndHappinessBeforeUpdating(name, image, weightDiff, happinessDiff, petObj) {
    // calculate new weight and happiness based on diffs
    const newWeight = petObj.weight + weightDiff;
    const newHappiness = petObj.happiness + happinessDiff;

    // make sure weight and happiness don't go below min (0)
    petObj.weight = newWeight > MIN_WEIGHT ? newWeight : MIN_WEIGHT;
    petObj.happiness = newHappiness > MIN_HAPPINESS ? newHappiness : MIN_HAPPINESS;

    if(name) petObj.name = name; // set name if given name is not null
    if(image) petObj.image = image; // set image if given image is not null
    
}

// Updates your HTML with the current values in a pet object
function updatePetInfoInHtml(petObj) {
    // set text and attributes of elements accordingly
    petObj.element.find('.name').text(petObj.name);
    petObj.element.find('.weight').text(petObj.weight);
    petObj.element.find('.happiness').text(petObj.happiness);
    petObj.element.find('.pet-image').attr('src', petObj.image);
}

