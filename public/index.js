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

function loginSuccess() {
  $('#js-login-form').addClass('hidden');
  getEventsData();
  getTasksData();
  $('#planner').removeClass('hidden');
}

// ///// BUILD PLANNER PAGE
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
  $('.js-monday').empty();
  $('.js-tuesday').empty();
  $('.js-wednesday').empty();
  $('.js-thursday').empty();
  $('.js-friday').empty();
  $('.js-saturday').empty();
  $('.js-sunday').empty();

  for (let i=0; i<response[0].length; i++ ) {
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
  };

  for (let i=0; i<response[1].length; i++ ) {
    $('.js-tuesday').append(`
      <li>${response[0][i].title}
        <ul>
          <li>StartTime: ${response[1][i].startTime}</li>
          <li>Notes: ${response[1][i].notes}</li>
          <button class="update-event">Edit</button>
          <button class="delete-event">Remove</button>
        </ul>
      </li>
    `)
  };

  for (let i=0; i<response[2].length; i++ ) {
    $('.js-wednesday').append(`
      <li>${response[2][i].title}
        <ul>
          <li>StartTime: ${response[2][i].startTime}</li>
          <li>Notes: ${response[2][i].notes}</li>
          <button class="update-event">Edit</button>
          <button class="delete-event">Remove</button>
        </ul>
      </li>
    `)
  }

  for (let i=0; i<response[3].length; i++ ) {
    $('.js-thursday').append(`
      <li>${response[3][i].title}
        <ul>
          <li>StartTime: ${response[3][i].startTime}</li>
          <li>Notes: ${response[3][i].notes}</li>
          <button class="update-event">Edit</button>
          <button class="delete-event">Remove</button>
        </ul>
      </li>
    `)
  };

  for (let i=0; i<response[4].length; i++ ) {
    $('.js-friday').append(`
      <li>${response[0][i].title}
        <ul>
          <li>StartTime: ${response[4][i].startTime}</li>
          <li>Notes: ${response[4][i].notes}</li>
          <button class="update-event">Edit</button>
          <button class="delete-event">Remove</button>
        </ul>
      </li>
    `)
  }

  for (let i=0; i<response[5].length; i++ ) {
    $('.js-saturday').append(`
      <li>${response[5][i].title}
        <ul>
          <li>StartTime: ${response[5][i].startTime}</li>
          <li>Notes: ${response[5][i].notes}</li>
          <button class="update-event">Edit</button>
          <button class="delete-event">Remove</button>
        </ul>
      </li>
    `)
  };

  for (let i=0; i<response[6].length; i++ ) {
    $('.js-sunday').append(`
      <li>${response[6][i].title}
        <ul>
          <li>StartTime: ${response[6][i].startTime}</li>
          <li>Notes: ${response[6][i].notes}</li>
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
  // Empty existing HTML before appending new data
  $('#to-do').empty();

  for(let i=0; i<response.length; i++) {
    $('#to-do').append(`
      <li class="priority.${response[i].priority} complete.${response[i].complete}">
       <input type="checkbox" id="js-task-complete">${response[i].title}
        <ul><li>Notes: ${response[i].notes}</li></ul>
        <button class="update-task">Edit</button>
        <button class="delete-task">Remove</button>
      </li>
    `)
  }
}

// ///// EDIT PLANNER PAGE
function createEvent() {
  const title = $('#js-event-title').val();
  const day = $('#js-event-day').val();
  const startTime = $('#js-event-time').val();
  const notes = $('#js-event-notes').val();

  let token = localStorage.getItem('jwt')
  
  const reqBody = {
    title,
    day,
    startTime,
    notes
  };

  fetch('/planner/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reqBody)
  }).then(() => getEventsData())

}

function editEvent() {
}

function createTask() {
  const title = $('#js-task-title').val();
  const notes = $('#js-task-notes').val();
  const priority = $('#js-task-priority').is(':checked') ? "on" : "off";
  
  const reqBody = {
    title,
    notes,
    priority,
    complete: "off"
  }
  console.log(reqBody);

  let token = localStorage.getItem('jwt');

  // fetch('/planner/tasks', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   },
  //   body: JSON.stringify(reqBody)
  // }).then(() => getTasksData());
}

function displayEditTaskForm(id) {
  // append form to li where button was clicked
  $(`#${id}`).append(`
    <form>
      <select id="task-update-field" name="update-field">
      <option value="title">Title</option>
      <option value="notes">Notes</option>
      </select>
      <input type="text" id="js-text-update-task">
      <label for="task-priority">Priority: </label><input type="checkbox" name="task-priority" id="js-task-priority">
      <input type="submit" id="js-btn-update-task">
    </form>
  `)

  updateEvent(id);
 }

 function updateEvent(id) {
  $('body').on('click', '#js-btn-update-task', function(e) {
    e.preventDefault();
    // Get form data to update task
    const field = $('#task-update-field').val();
    const text = $('#js-text-update-task').val();
    const priority = $('#js-task-priority').val();
    console.log(priority);
  
    const reqBody = {};
    reqBody._id = id;
    reqBody.priority = priority;
    
    // Prevent field from updating if left blank
    if ( text !== "" ) {
      reqBody[field] = text;
    };

    let token = localStorage.getItem('jwt');

    fetch(`/planner/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reqBody)
    }).then(() => {
      getTasksData();
    });
  });
 }

function editTask() {
  // Listen to form click on js-btn-submit-update-task to collect id
  $('body').on('click', '.js-task-item', function(e) {
    e.preventDefault();
    let eventId = $(this).parent().map(() => {
      return this.id
    }).get()[0];
    $(this).removeClass('js-task-item');
    displayEditTaskForm(eventId);
  })
}

// ///// START APPLICATION & LISTEN FOR BUTTON CLICKS
$('body').on('click', '#js-login-submit', function(e) {
  e.preventDefault();
  logIn();
})

$('body').on('click', '#js-btn-create-event', function(e) {
  e.preventDefault();
  createEvent();
})

$('body').on('click', '#js-btn-create-task', function(e) {
  e.preventDefault();
  createTask();
})

editTask();