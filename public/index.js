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

// ///// SIGN UP FUNCTIONS
function signupUser() {
  const username = $('#js-username-signup').val();
  const password = $('#js-password-signup').val();
  const password2 = $('#js-password2').val();

  const reqBody = {
    username, password, password2
  }
  console.log(reqBody);

  fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqBody)
  }).then(location.reload())
    .catch(err => console.log(err.message))
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
      <li id="${response[0][i]._id}">${response[0][i].title}
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
      <li id="${response[1][i]._id}">${response[1][i].title}
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
      <li id="${response[2][i]._id}">${response[2][i].title}
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
      <li id="${response[3][i]._id}">${response[3][i].title}
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
      <li id="${response[4][i]._id}">${response[0][i].title}
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
      <li id="${response[5][i]._id}">${response[5][i].title}
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
      <li id="${response[6][i]._id}">${response[6][i].title}
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
      <li class="priority-${response[i].priority} complete-${response[i].complete} js-task-item" id="${response[i]._id}"> 
        <button name="task-complete" class="js-task-complete"><label for="task-complete">Complete</button>
        <button name="task-undo-complete" class="js-task-undo hidden"><label for="task-undo-complete">Undo</button>
        ${response[i].title}
        <ul><li>Notes: ${response[i].notes}</li></ul>
        <button class="update-task">Edit</button>
        <button class="delete-task">Remove</button>
      </li>
    `)
  }

  completeModifiers();
}

// ///// EDIT PLANNER PAGE

// EVENT FUNCTIONS
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
  }).then(() => {
    getEventsData();
    $('#js-event-title').val('');
    $('#js-event-day').val('');
    $('#js-event-time').val('');
    $('#js-event-notes').val('');
  })

}

function editEvent() {
}

function displayEditEventForm(id) {
  // append form to li where button was clicked
  $(`#${id}`).append(`
    <form id="edit-js-event-form">
      <select id="event-update-field" name="update-field">
        <option value="title">Title</option>
        <option value="notes">Notes</option>
      </select>
      <input type="text" id="js-text-update-event">
      <label for="startTime">Start: </label> <input type="time" name="startTime" id='js-event-time'>
      <input type="submit" id="js-btn-update-event">
      <button id="js-cancel-update-event" name="cancel-update-event"><label for"cancel-update-event">Cancel</button>
    </form>
  `)

  updateEvent(id);
};

function updateEvent(id) {
  $('body').one('click', '#js-btn-update-event', function(e) {
    e.preventDefault();
    const field = $('#event-update-field').val();
    const text = $('#js-text-update-event').val();
    const startTime = $('#js-event-time').val();
    let dayClass = $(this).parents('ul').attr('class');
    let day;

    if (dayClass=='js-monday') {
      day = '0'
    } else if (dayClass=='js-tuesday') {
      day = '1'
    } else if (dayClass=='js-wednesday') {
      day = '2'
    } else if (dayClass=='js-thursday') {
      day = '3'
    } else if (dayClass=='js-friday') {
      day = '4'
    } else if (dayClass=='js-saturday') {
      day = '5'
    } else {
      day = '6'
    };

    let reqBody = {};
    reqBody._id = id;
    reqBody.day = day;

    // Prevent field from updating if left blank
    if (text!=="") {
      reqBody[field] = text;
    }

    // Prevent startTime from updating if left blank
    if (startTime!=="") {
      reqBody.startTime = startTime
    }

    let token = localStorage.getItem('jwt');
    fetch(`/planner/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reqBody)
    }).then( getEventsData() )

  })

  $('body').on('click', '#js-cancel-update-event', function(e) {
    e.preventDefault();
    // Display edit button if user cancels action to update event
    $('body').find('.update-event').removeClass('hidden');
    // Display delete button on event if user cancels event
    $(this).parent().prev().find('.delete-event').removeClass('hidden');
    // Remove rendered form if user cancels
    $(this).parent().remove();
  })
}

// TASK FUNCTIONS
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

  let token = localStorage.getItem('jwt');

  fetch('/planner/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reqBody)
  }).then(() => {
    getTasksData()
    $('#js-task-title').val("");
    $('#js-task-notes').val("");
    $('#js-task-priority').prop('checked', false)
  });
}

function displayEditTaskForm(id) {
  // append form to li where button was clicked
  $(`#${id}`).append(`
    <form class="edit-js-task-form">
      <select id="task-update-field" name="update-field">
      <option value="title">Title</option>
      <option value="notes">Notes</option>
      </select>
      <input type="text" id="js-text-update-task">
      <label for="task-priority">Priority: </label><input type="checkbox" name="task-priority" id="js-task-priority">
      <input type="submit" id="js-btn-update-task">
      <button id="js-cancel-update-task" name="cancel-update-task><label for="cancel-update-task">Cancel</button>
    </form>
  `)

  updateTask(id);
}

function updateTask(id) {
  $('body').on('click', '#js-btn-update-task', function(e) {
    e.preventDefault();

    // Get form data to update task
    const field = $('#task-update-field').val();
    const text = $('#js-text-update-task').val();
    const priority = $('#js-task-priority').is(':checked') ? 'on' : 'off';
  
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

  $('body').on('click', '#js-cancel-update-task', function(e) {
    e.preventDefault();
    $('body').find('.update-task').removeClass('hidden');
    // Display remove and edit buttons
    $(this).parent().siblings('button.delete-task').removeClass('hidden');
    // Remove appended edit task form
    $(this).parent().remove();
  })
}

function completeTask(id) {
  let token = localStorage.getItem('jwt');

  fetch(`/planner/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ _id: id, complete: "on" })
  }).then(() => {
    getTasksData();
  })
}

function undoCompleteTask(id) {
  let token = localStorage.getItem('jwt');

  fetch(`/planner/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ _id: id, complete: "off" })
  }).then(() => {
    getTasksData();
  })

}

function completeModifiers() {
  $('body').find('.complete-on').children('.js-task-complete').addClass('hidden');
  $('body').find('.complete-on').children('.js-task-undo').removeClass('hidden');

  $('body').find('.complete-off').children('js-task-complete').removeclass('hidden');
  $('body').find('.complete-off').children('js-task-undo').addClass('hidden');
}

// ///// START APPLICATION & LISTEN FOR BUTTON CLICKS
// REFRESH PAGE LISTEN TO PAGE
// Listen to when page loads
// If jwt exists, display planner data
// Else, display as normal

// LOGIN EVENT BUTTON
$('body').on('click', '#js-login-submit', function(e) {
  e.preventDefault();
  logIn();
})

// SIGN UP EVENT BUTTON
$('body').on('click', '#js-signup-submit', function(e) {
  e.preventDefault();
  signupUser();
})

// SIGN OUT BUTTON EVENT LISTENER

// RENDER SIGN UP FORM
$('body').on('click', '#sign-up-link', function(e) {
  e.preventDefault();
  $('body').find('#js-login-form').addClass('hidden');
  $('body').find('#js-signup-form').removeClass('hidden');
})

// RENDER LOG IN FORM
$('body').on('click', '#login-link', function(e) {
  e.preventDefault();
  $('body').find('#js-login-form').removeClass('hidden');
  $('body').find('#js-signup-form').addClass('hidden');
})

// CREATE EVENT BUTTON 
$('body').on('click', '#js-btn-create-event', function(e) {
  e.preventDefault();
  createEvent();
})

// UPDATE EVENT BUTTON
$('body').on('click', '.update-event', function() {
  let eventId = $(this).closest('li').attr('id');
  $('body').find('.update-event').addClass('hidden');
  $(this).next().addClass('hidden');
  displayEditEventForm(eventId);
})

// DELETE EVENT BUTTON 
$('body').on('click', '.delete-event', function() {
  let eventId = $(this).closest('li').attr("id");
  let token = localStorage.getItem('jwt');
  let day;
  let dayClass = $(this).closest('ul').parent().closest('ul').attr('class');

  if (dayClass=='js-monday') {
    day = '0'
  } else if (dayClass=='js-tuesday') {
    day = '1'
  } else if (dayClass=='js-wednesday') {
    day = '2'
  } else if (dayClass=='js-thursday') {
    day = '3'
  } else if (dayClass=='js-friday') {
    day = '4'
  } else if (dayClass=='js-saturday') {
    day = '5'
  } else {
    day = '6'
  };

  if (confirm('Are you sure you want to delete this event?')) {
    fetch(`/planner/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ _id: eventId, day })
    }).then(() => {
      getEventsData();
    })
  }
})

// CREATE TASK BUTTON
$('body').on('click', '#js-btn-create-task', function(e) {
  e.preventDefault();
  createTask();
})

// UPDATE TASK BUTTON
$('body').on('click', '.update-task', function(e) {
  let eventId = $(this).prev().parent().attr('id');
  $('body').find('.update-task').addClass('hidden');
  $(this).next().addClass('hidden');
  displayEditTaskForm(eventId);
})

// TASK COMPLETE BUTTON
$('body').on('click', '.js-task-complete', function() {
    let eventId = $(this).parent().attr('id');
    completeTask(eventId);
})

// TASK UNDO BUTTON
$('body').on('click', '.js-task-undo', function() {
  let eventId = $(this).parent().attr('id');
  undoCompleteTask(eventId);
})

// DELETE TASK EVENT LISTENER
$('body').on('click', '.delete-task', function(e) {
  let taskId = $(this).prev().parent().attr('id')
  
  let token = localStorage.getItem('jwt');
  if (confirm('Are you sure you want to delete this task?')) {
    fetch(`/planner/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getTasksData();
    })  
  }
})