'use strict';

// Function to redirect to planner when JWT is returned in response body
function watchForm() {
  $('form').submit(res => {
    // event returns the JWT in the response body
    const JWT = res.json();
    // fetch /planner with JWT in the body
    fetch('/planner', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JWT
    })
    .catch(error => console.error('Error: ', error))
  })
}

watchForm();