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
        ${response[i].title}
        <ul><li>Notes: ${response[i].notes}</li></ul>
        <button class="update-task">Edit</button>
        <button class="delete-task">Remove</button>
      </li>
    `)
  }

  // completeModifiers();
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

function deleteEvent() {
  // Listen to form click on .delete-event button to collect id
  $('body').on('click', '.delete-event', function(e) {
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
  })
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

  updateTask(id);
}

function updateTask(id) {
  $('body').one('click', '#js-btn-update-task', function(e) {
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
}

function editTask() {
  // Listen to form click on .update-task button to collect id
  $('body').on('click', '.update-task', function(e) {
    let eventId = $(this).prev().parent().attr('id');
    $(this).addClass('hidden');
    displayEditTaskForm(eventId);
  })
}

function deleteTask() {
  // Listen to form click on .delete-task button to collect id
  $('body').on('click', '.delete-task', function(e) {
    let taskId = $(this).prev().parent().attr('id')
    
    let token = localStorage.getItem('jwt');

    fetch(`/planner/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getTasksData();
    })
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

// function completeModifiers() {
//   $('.js-task-item').each( function() {
//     if ($(this).hasClass('complete-on')) {
//       $('.js-task-complete').addClass('hidden')
//     }
//   })
// }

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

$('body').on('click', '.js-task-complete', function() {
    let eventId = $(this).parent().attr('id');
    // console.log($(this).parent().attr('id'))
    completeTask(eventId);
})

editTask();
deleteTask();
deleteEvent();