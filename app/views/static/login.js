'use strict';

function loginUser() {
  const user = {
    "username": "slertka",
    "password": "password"
  }
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  }).then(responseJSON => loadPlanner(responseJSON.authToken))
  .catch(error => {
    console.log(error.message);
  })
}

function loadPlanner(authToken) {
  fetch('/planner', {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + authToken
    }
    }).then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(response.statusText);
  }).then(responseJSON => generatePlannerView(responseJSON))
}

function generatePlannerView(responseJSON) {
  // generate HTML with data
  $('body').find('#message').text(responseJSON.message)
}

function watchForm() {
  $('form').submit((event) => {
    event.preventDefault();
    loginUser();
  })
}

watchForm();