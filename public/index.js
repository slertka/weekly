// ///// LOGIN FUNCTIONS
function logIn() {
  const username = $('#js-username-login').val();
  const password = $('#js-password-login').val();
  const reqBody = { username, password }

  fetch('/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    body: JSON.stringify(reqBody)
  }).then(res => res.json())
    .then(resj => {
      localStorage.setItem('user', resj.username)
      localStorage.setItem('jwt', resj.authToken)
      loginSuccess()
    })
}

//  ///// BUILD PLANNER PAGE
function getEventsData() {
  let token = localStorage.getItem('jwt');
  fetch('/planner/events', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json())
    .then(resj => displayCalData(resj.cal[0]))
}

function displayCalData(response) {
  for(let i=0; i<response[0].length; i++) {
    $('.js-monday').append(`
      <li>${response[0][i].title}
        <ul>
          <li>StartTime: ${response[0][i].startTime}</li>
          <li>Notes: ${response[0][i].notes}</li>
          <button class="update-event">Edit</button>
          <button class="delete-event">Remove</button>
        </ul>
      </li>
    `)
  }
}

function getTasksData() {
  let token = localStorage.getItem('jwt');

  fetch('/planner/tasks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json())
    .then(resj => displayTasksData(resj.tasks))
}

function displayTasksData(response) {
  for(let i=0; i<response.length; i++) {
    $('#to-do').append(`
      <li class="priority.${response[i].priority} complete.${response[i].complete}"> ${response[i].title}
        <ul><li>Notes: ${response[i].notes}</li></ul>
        <button class="update-task">Edit</button>
        <button class="delete-task">Remove</button>
      </li>
    `)
  }
}

function loginSuccess() {
  $('#js-login-form').addClass('hidden');
  getEventsData();
  getTasksData();
  $('#planner').removeClass('hidden');
}

// ///// START APPLICATION
$('body').on('click', '#js-login-submit', function(e) {
  e.preventDefault();
  logIn();
})