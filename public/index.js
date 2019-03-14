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
      console.log(resj.authToken)
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
    .then(resj => console.log(resj))
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
    .then(resj => console.log(resj))
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