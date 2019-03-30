// ///// LOGIN FUNCTIONS
function logIn() {
  $(".js-login-fail").remove();

  // Get payload from form fields
  const username = $("#js-username-login").val();
  const password = $("#js-password-login").val();
  const reqBody = { username, password };

  fetch("/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(reqBody)
  })
    .then(res => res.json())
    .then(resj => {
      // Store user and jwt in localStorage
      localStorage.setItem("user", resj.username);
      localStorage.setItem("jwt", resj.authToken);
      loginSuccess();
    })
    .catch(e => {
      loginFailure();
    });
}

function loginSuccess() {
  // Render planner pages
  $("#js-login-form").addClass("hidden");
  $("#js-user-signout").removeClass("hidden");
  $("div.header")
    .removeClass("before-planner")
    .addClass("after-planner");
  // Fetch data from server
  getEventsData();
  getTasksData();
  $("#planner").removeClass("hidden");
}

function loginFailure() {
  $("#js-login-form").prepend(`
    <p class='js-login-fail'> The username or password you entered is incorrect. </p>
  `);
}

// ///// SIGN UP FUNCTIONS
function signupUser() {
  // Get new user credentials from form
  const username = $("#js-username-signup").val();
  const password = $("#js-password-signup").val();
  const password2 = $("#js-password2").val();

  const reqBody = {
    username,
    password,
    password2
  };

  fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(reqBody)
  }).then(res => {
    // display error when user was not created
    if (res.status == 422) {
      $(".js-user-failure").remove();
      return $("#js-signup-form").prepend(`
          <p class='js-user-failure'>Username already taken or password does not meet validation requirements. Password must be at least 8 characters long and match. </p>`);
    }

    // hide sign up form
    $("#js-signup-form").addClass("hidden");

    // display login form
    $("#js-login-form").removeClass("hidden");

    // empty sign up form
    $("#js-username-signup").empty();
    $("#js-password-signup").empty();
    $("#js-password2").empty();

    // account successfully created / notify user
    $("#js-login-form").prepend(`
          <p class='js-user-success'>Account created!</p>
      `);
  });
}

// ///// BUILD PLANNER PAGE
function getEventsData() {
  let token = localStorage.getItem("jwt");
  fetch("/planner/events", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(resj => displayCalData(resj));
}

function displayCalData(response) {
  // Empty existing data
  $(".js-monday").empty();
  $(".js-tuesday").empty();
  $(".js-wednesday").empty();
  $(".js-thursday").empty();
  $(".js-friday").empty();
  $(".js-saturday").empty();
  $(".js-sunday").empty();

  // Display data for each day of the week
  for (let i = 0; i < response[0].length; i++) {
    $(".js-monday").append(`
      <li id="${response[0][i]._id}" class='js-event hvr-fade-event'> 
      <span class="time">${response[0][i].startTime}</span>
      ${response[0][i].title}
      <button class="update-event hvr-icon-fade"><i class="fas fa-edit fa-2x hvr-icon"></i></button>
      <button class="delete-event hvr-icon-fade"><i class="fas fa-trash-alt fa-2x hvr-icon"></i></button>
        <ul class='hidden'>
          <li>${response[0][i].notes}</li>
        </ul>
      </li><br>
    `);
  }

  for (let i = 0; i < response[1].length; i++) {
    $(".js-tuesday").append(`
      <li id="${response[1][i]._id}" class='js-event hvr-fade-event'>
      <span class="time">${response[1][i].startTime}</span>
      ${response[1][i].title}
      <button class="update-event hvr-icon-fade"><i class="fas fa-edit  fa-2x hvr-icon"></i></button>
      <button class="delete-event hvr-icon-fade"><i class="fas fa-trash-alt fa-2x hvr-icon"></i></button>
        <ul class='hidden'>
          <li>${response[1][i].notes}</li>
        </ul>
      </li><br>
    `);
  }

  for (let i = 0; i < response[2].length; i++) {
    $(".js-wednesday").append(`
      <li id="${response[2][i]._id}" class='js-event hvr-fade-event'>
      <span class="time">${response[2][i].startTime}</span>
      ${response[2][i].title}
      <button class="update-event hvr-icon-fade"><i class="fas fa-edit fa-2x hvr-icon"></i></button>
      <button class="delete-event hvr-icon-fade"><i class="fas fa-trash-alt fa-2x hvr-icon"></i></button>
        <ul class='hidden'>
          <li>${response[2][i].notes}</li>
        </ul>
      </li><br>
    `);
  }

  for (let i = 0; i < response[3].length; i++) {
    $(".js-thursday").append(`
      <li id="${response[3][i]._id}" class='js-event hvr-fade-event'>
      <span class="time">${response[3][i].startTime}</span>
      ${response[3][i].title}
      <button class="update-event hvr-icon-fade"><i class="fas fa-edit fa-2x hvr-icon"></i></button>
      <button class="delete-event hvr-icon-fade"><i class="fas fa-trash-alt fa-2x hvr-icon"></i></button>
        <ul class='hidden'>
          <li>${response[3][i].notes}</li>
        </ul>
      </li><br>
    `);
  }

  for (let i = 0; i < response[4].length; i++) {
    $(".js-friday").append(`
      <li id="${response[4][i]._id}" class='js-event hvr-fade-event'>
        <span class="time">${response[4][i].startTime}</span>
        ${response[4][i].title}
        <button class="update-event hvr-icon-fade"><i class="fas fa-edit fa-2x hvr-icon"></i></button>
        <button class="delete-event hvr-icon-fade"><i class="fas fa-trash-alt fa-2x hvr-icon"></i></button>
        <ul class='hidden'>
          <li>${response[4][i].notes}</li>
        </ul>
      </li><br>
    `);
  }

  for (let i = 0; i < response[5].length; i++) {
    $(".js-saturday").append(`
      <li id="${response[5][i]._id}" class='js-event hvr-fade-event'>
        <span class="time">${response[5][i].startTime}</span>
        ${response[5][i].title}
        <button class="update-event hvr-icon-fade"><i class="fas fa-edit fa-2x hvr-icon"></i></button>
        <button class="delete-event hvr-icon-fade"><i class="fas fa-trash-alt fa-2x hvr-icon"></i></button>
        <ul class='hidden'>
          <li>${response[5][i].notes}</li>
        </ul>
      </li><br>
    `);
  }

  for (let i = 0; i < response[6].length; i++) {
    $(".js-sunday").append(`
      <li id="${response[6][i]._id}" class='js-event hvr-fade-event'>
        <span class="time">${response[6][i].startTime}</span>
        ${response[6][i].title}
        <button class="update-event hvr-icon-fade"><i class="fas fa-edit fa-2x hvr-icon"></i></button>
        <button class="delete-event hvr-icon-fade"><i class="fas fa-trash-alt fa-2x hvr-icon"></i></button>
        <ul class='hidden'>
          <li>${response[6][i].notes}</li>
        </ul>
      </li><br>
    `);
  }

  // display time AM/PM
  convertTime();
}

function getTasksData() {
  let token = localStorage.getItem("jwt");

  fetch("/planner/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(resj => displayTasksData(resj.tasks));
}

function displayTasksData(response) {
  // Empty existing list before appending new data
  $("#to-do").empty();

  for (let i = 0; i < response.length; i++) {
    $("#to-do").append(`
      <li class="complete-${response[i].complete} priority-${
      response[i].priority
    } js-task-item hvr-fade-event" id="${response[i]._id}"> 
        <button name="task-complete" class="js-task-complete hvr-icon-fade"><label for="task-complete"><i class="far fa-check-circle fa-2x hvr-icon"></i></label></button>

        <button name="task-undo-complete" class="js-task-undo hvr-icon-fade hidden"><label for="task-undo-complete"><i class="fas fa-check fa-2x hvr-icon"></i></label></button>

        <button name="priority-star-off" class="js-task-priority-off hvr-icon-fade"><label for="priority-star-off"><i class="far fa-star fa-2x hvr-icon"></i></label></button>

        <button name="priority-star-on" class="hvr-icon-fade js-task-priority-on"><label for="priority-star-on"><i class="fas fa-star fa-2x hvr-icon"></i></label></button>
        ${response[i].title}
        <button class="update-task hvr-icon-fade"><i class="fas fa-edit fa-2x hvr-icon"></i></button>
        <button class="delete-task hvr-icon-fade"><i class="fas fa-trash-alt fa-2x hvr-icon"></i></button>
        <ul class="hidden">
          <li>${response[i].notes}</li>
        </ul>
      </li><br>
    `);
  }

  completeModifiers();
  priorityModifiers();
}

// ///// EDIT PLANNER PAGE

// EVENT FUNCTIONS
function renderNewEventForm() {
  $(".create-event-or-task").append(`
    <form id='new-event-form'>
      <fieldset>
        <legend>Create new Event</legend>
        <label for="title">Title: </label> <input type="text" name="title" id='js-event-title' placeholder="Meet with manager"><br>
        <label for="day">Day: </label> <select id='js-event-day' name="day" required>
            <option value="0">Monday</option>
            <option value="1">Tuesday</option>
            <option value="2">Wednesday</option>
            <option value="3">Thursday</option>
            <option value="4">Friday</option>
            <option value="5">Saturday</option>
            <option value="6">Sunday</option>
          </select><br>
        <label for="startTime">Start: </label> <input type="time" name="startTime" id='js-event-time' required><br>
        <label for="notes">Notes: </label> <input type="text" id="js-event-notes" name="notes" placeholder="Bring resume..."><br>
        <input type="submit" id="js-btn-create-event" class='hvr-fade'>
        <button id='js-cancel-create-event' name='cancel-create-event' class='hvr-fade'><label for='cancel-create-event'>Cancel</label></button>
      </fieldset>
    </form>
  `);
}

function createEvent() {
  // Get values from form
  const title = $("#js-event-title").val();
  const day = $("#js-event-day").val();
  const startTime = $("#js-event-time").val();
  const notes = $("#js-event-notes").val();

  let token = localStorage.getItem("jwt");

  // Do not allow user to create an event when the title is empty
  // Time can be blank to signify an "all day event"
  if (title == "") {
    $(".blank-field").empty();
    return $("#new-event-form").prepend(`
      <p class="blank-field">Enter a valid title</p>
    `);
  }

  const reqBody = {
    title,
    day,
    startTime,
    notes
  };

  fetch("/planner/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(reqBody)
  }).then(() => {
    // Remove create new event form
    $("#new-event-form").remove();
    $("#js-create").removeClass("hidden");
    // Get Events Data and render new display
    getEventsData();
  });
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
      <input type="time" name="startTime" id='js-event-time'>
      <input type="submit" id="js-btn-update-event">
      <button id="js-cancel-update-event" name="cancel-update-event"><label for"cancel-update-event">Cancel</button>
    </form>
  `);

  updateEvent(id);
}

function updateEvent(id) {
  // Update event when submit button is clicked
  $("body").one("click", "#js-btn-update-event", function(e) {
    e.preventDefault();

    // Get values from field
    const field = $("#event-update-field").val();
    const text = $("#js-text-update-event").val();
    const startTime = $("#js-event-time").val();
    let dayClass = $(this)
      .parents("ul")
      .attr("class");

    // Define key (server-side) for which day to update
    let day;
    if (dayClass == "js-monday") {
      day = "0";
    } else if (dayClass == "js-tuesday") {
      day = "1";
    } else if (dayClass == "js-wednesday") {
      day = "2";
    } else if (dayClass == "js-thursday") {
      day = "3";
    } else if (dayClass == "js-friday") {
      day = "4";
    } else if (dayClass == "js-saturday") {
      day = "5";
    } else {
      day = "6";
    }

    // Create request body
    let reqBody = {};
    reqBody._id = id;
    reqBody.day = day;

    // Prevent field from updating if left blank (e.g. the user submits the form but doesn't update anything, the existing value will remain)
    if (text !== "") {
      reqBody[field] = text;
    }

    // Prevent startTime from updating if left blank (e.g. the user submits the form without a time, the existing value will remain)
    if (startTime !== "") {
      reqBody.startTime = startTime;
    }

    let token = localStorage.getItem("jwt");
    fetch(`/planner/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(reqBody)
    }).then(getEventsData());
  });

  // User cancels the update event form
  $("body").on("click", "#js-cancel-update-event", function(e) {
    e.preventDefault();
    // Display edit button if user cancels action to update event
    $("body")
      .find(".update-event")
      .removeClass("hidden");
    // Display delete button on event if user cancels event
    $(this)
      .parent()
      .parent()
      .find(".delete-event")
      .removeClass("hidden");
    // Remove rendered form if user cancels
    $(this)
      .parent()
      .remove();
  });
}

// Display time as AM/PM format rather than military
function convertTime() {
  $(".time").each(function() {
    if ($(this).html() !== "") {
      let timeDisplay;
      let hour = parseInt(
        $(this)
          .text()
          .substring(0, 2)
      );
      let min = $(this)
        .text()
        .substring(3, 5);
      if (hour == 12) {
        timeDisplay = `${hour}:${min} PM`;
      } else if (hour > 12) {
        timeDisplay = `${-(12 - hour)}:${min} PM`;
      } else {
        timeDisplay = `${hour}:${min} AM`;
      }
      return $(this).html(timeDisplay);
    }
  });
}

// TASK FUNCTIONS
function renderNewTaskForm() {
  $(".create-event-or-task").append(`
    <form id="new-task">
      <fieldset>
        <legend>Create new Task</legend>
        <label for="title">Title: </label> <input id="js-task-title" type="text" name="title" placeholder="Bring resume to manager meeting"><br>
        <label for="notes">Notes: </label> <input id="js-task-notes" type="text" name="notes"><br>
        <input type="submit" id="js-btn-create-task" class='hvr-fade'>
        <button id='js-cancel-create-task' name='cancel-create-task' class='hvr-fade'><label for='cancel-create-task'>Cancel</label></button>
      </fieldset>
    </form>
  `);
}

function createTask() {
  // Get values from form fields
  const title = $("#js-task-title").val();
  const notes = $("#js-task-notes").val();

  // New event cannot be created if task title is empty
  if (title == "") {
    $(".task-title-empty").remove();
    return $("#new-task").prepend(`
      <p class="task-title-empty">Enter a valid title</p>
    `);
  }

  // Create request body
  const reqBody = {
    title,
    notes,
    priority: "off",
    complete: "off"
  };

  let token = localStorage.getItem("jwt");
  fetch("/planner/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(reqBody)
  }).then(() => {
    getTasksData();
    $("#js-create").removeClass("hidden");
    $("#new-task").addClass("hidden");
    $("#js-task-title").val("");
    $("#js-task-notes").val("");
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
      <input type="text" id="js-text-update-task"><br>
      <input type="submit" id="js-btn-update-task">
      <button id="js-cancel-update-task" name="cancel-update-task><label for="cancel-update-task">Cancel</button>
    </form>
  `);

  updateTask(id);
}

function updateTask(id) {
  // Update task when submit button is clicked
  $("body").one("click", "#js-btn-update-task", function(e) {
    e.preventDefault();

    // Get form data to update task
    const field = $("#task-update-field").val();
    const text = $("#js-text-update-task").val();

    const reqBody = {};
    reqBody._id = id;

    // Prevent field from updating if left blank
    if (text !== "") {
      reqBody[field] = text;
    }

    let token = localStorage.getItem("jwt");

    fetch(`/planner/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(reqBody)
    }).then(() => {
      getTasksData();
    });
  });

  // Remove form when cancel button is clicked for updating the task
  $("body").on("click", "#js-cancel-update-task", function(e) {
    e.preventDefault();
    $("body")
      .find(".update-task")
      .removeClass("hidden");
    // Display remove and edit buttons
    $(this)
      .parent()
      .siblings("button.delete-task")
      .removeClass("hidden");
    // Remove appended edit task form
    $(this)
      .parent()
      .remove();
  });
}

function completeTask(id) {
  let token = localStorage.getItem("jwt");
  fetch(`/planner/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ _id: id, complete: "on" })
  }).then(() => {
    getTasksData();
  });
}

function undoCompleteTask(id) {
  let token = localStorage.getItem("jwt");
  fetch(`/planner/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ _id: id, complete: "off" })
  }).then(() => {
    getTasksData();
  });
}

function priorityOn(id) {
  let token = localStorage.getItem("jwt");
  fetch(`/planner/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ _id: id, priority: "on" })
  }).then(() => {
    getTasksData();
  });
}

function priorityOff(id) {
  let token = localStorage.getItem("jwt");
  fetch(`/planner/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ _id: id, priority: "off" })
  }).then(() => {
    getTasksData();
  });
}

function completeModifiers() {
  // when .complete-on class is assigned to task
  $("body")
    .find(".complete-on")
    .children(".js-task-complete")
    .addClass("hidden");
  $("body")
    .find(".complete-on")
    .children(".js-task-undo")
    .removeClass("hidden");
  $("body")
    .find(".complete-on")
    .children(".update-task")
    .addClass("hidden");
  $("body")
    .find(".complete-on")
    .children(".delete-task")
    .addClass("hidden");

  // when .complete-off class is assigned to a task
  $("body")
    .find(".complete-off")
    .children("js-task-complete")
    .removeClass("hidden");
  $("body")
    .find(".complete-off")
    .children("js-task-undo")
    .addClass("hidden");
}

function priorityModifiers() {
  // when .priority-on class is assigned to a task
  $("body")
    .find(".priority-on")
    .children(".js-task-priority-off")
    .addClass("hidden");
  $("body")
    .find(".priority-on")
    .children(".js-task-priority-on")
    .removeClass("hidden");

  // when .priority-off class is assigned to a task
  $("body")
    .find(".priority-off")
    .children(".js-task-priority-off")
    .removeClass("hidden");
  $("body")
    .find(".priority-off")
    .children(".js-task-priority-on")
    .addClass("hidden");
}
