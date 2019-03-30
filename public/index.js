// ///// LOGIN FUNCTIONS
function logIn() {
  $(".js-login-fail").remove();
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
      localStorage.setItem("user", resj.username);
      localStorage.setItem("jwt", resj.authToken);
      loginSuccess();
    })
    .catch(e => {
      console.log(e);
      loginFailure();
    });
}

function loginSuccess() {
  $("#js-login-form").addClass("hidden");
  $("#js-user-signout").removeClass("hidden");
  $("div.header")
    .removeClass("before-planner")
    .addClass("after-planner");
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
  })
    .then(res => {
      console.log(res.status);
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

      // prepend display that account was successfully created
      $("#js-login-form").prepend(`
          <p class='js-user-success'>Account created!</p>
      `);
    })
    .catch(err => {
      console.log(err.message);
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
  $(".js-monday").empty();
  $(".js-tuesday").empty();
  $(".js-wednesday").empty();
  $(".js-thursday").empty();
  $(".js-friday").empty();
  $(".js-saturday").empty();
  $(".js-sunday").empty();

  for (let i = 0; i < response[0].length; i++) {
    $(".js-monday").append(`
      <li id="${response[0][i]._id}" class='js-event hvr-fade-event'> 
      ${response[0][i].startTime}
      ${response[0][i].title}
      <button class="update-event hvr-icon-fade"><i class="fas fa-edit fa-2x hvr-icon"></i></button>
      <button class="delete-event hvr-icon-fade"><i class="fas fa-trash-alt fa-2x hvr-icon"></i></button>
        <ul class='hidden'>
          <li>${response[0][i].notes}</li>
        </ul>
      </li>
    `);
  }

  for (let i = 0; i < response[1].length; i++) {
    $(".js-tuesday").append(`
      <li id="${response[1][i]._id}" class='js-event hvr-fade-event'>
      ${response[1][i].startTime}
      ${response[1][i].title}
      <button class="update-event hvr-icon-fade"><i class="fas fa-edit  fa-2x hvr-icon"></i></button>
      <button class="delete-event hvr-icon-fade"><i class="fas fa-trash-alt fa-2x hvr-icon"></i></button>
        <ul class='hidden'>
          <li>${response[1][i].notes}</li>
        </ul>
      </li>
    `);
  }

  for (let i = 0; i < response[2].length; i++) {
    $(".js-wednesday").append(`
      <li id="${response[2][i]._id}" class='js-event hvr-fade-event'>
      ${response[2][i].startTime}
      ${response[2][i].title}
      <button class="update-event hvr-icon-fade"><i class="fas fa-edit fa-2x hvr-icon"></i></button>
      <button class="delete-event hvr-icon-fade"><i class="fas fa-trash-alt fa-2x hvr-icon"></i></button>
        <ul class='hidden'>
          <li>${response[2][i].notes}</li>
        </ul>
      </li>
    `);
  }

  for (let i = 0; i < response[3].length; i++) {
    $(".js-thursday").append(`
      <li id="${response[3][i]._id}" class='js-event hvr-fade-event'>
        ${response[3][i].startTime}
        ${response[3][i].title}
        <button class="update-event hvr-icon-fade"><i class="fas fa-edit fa-2x hvr-icon"></i></button>
        <button class="delete-event hvr-icon-fade"><i class="fas fa-trash-alt fa-2x hvr-icon"></i></button>
        <ul class='hidden'>
          <li>${response[3][i].notes}</li>
        </ul>
      </li>
    `);
  }

  for (let i = 0; i < response[4].length; i++) {
    $(".js-friday").append(`
      <li id="${response[4][i]._id}" class='js-event hvr-fade-event'>
        ${response[4][i].startTime}
        ${response[4][i].title}
        <button class="update-event hvr-icon-fade"><i class="fas fa-edit fa-2x hvr-icon"></i></button>
        <button class="delete-event hvr-icon-fade"><i class="fas fa-trash-alt fa-2x hvr-icon"></i></button>
        <ul class='hidden'>
          <li>${response[4][i].notes}</li>
        </ul>
      </li>
    `);
  }

  for (let i = 0; i < response[5].length; i++) {
    $(".js-saturday").append(`
      <li id="${response[5][i]._id}" class='js-event hvr-fade-event'>
        ${response[5][i].startTime}
        ${response[5][i].title}
        <button class="update-event hvr-icon-fade"><i class="fas fa-edit fa-2x hvr-icon"></i></button>
        <button class="delete-event hvr-icon-fade"><i class="fas fa-trash-alt fa-2x hvr-icon"></i></button>
        <ul class='hidden'>
          <li>${response[5][i].notes}</li>
        </ul>
      </li>
    `);
  }

  for (let i = 0; i < response[6].length; i++) {
    $(".js-sunday").append(`
      <li id="${response[6][i]._id}" class='js-event hvr-fade-event'>
        ${response[6][i].startTime}
        ${response[6][i].title}
        <button class="update-event hvr-icon-fade"><i class="fas fa-edit fa-2x hvr-icon"></i></button>
        <button class="delete-event hvr-icon-fade"><i class="fas fa-trash-alt fa-2x hvr-icon"></i></button>
        <ul class='hidden'>
          <li>${response[6][i].notes}</li>
        </ul>
      </li>
    `);
  }
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
  // Empty existing HTML before appending new data
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
  const title = $("#js-event-title").val();
  const day = $("#js-event-day").val();
  const startTime = $("#js-event-time").val();
  const notes = $("#js-event-notes").val();

  let token = localStorage.getItem("jwt");

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
    $("#new-event-form").remove();
    $("#js-create").removeClass("hidden");
    getEventsData();
    $("#js-event-title").val("");
    $("#js-event-day").val("");
    $("#js-event-time").val("");
    $("#js-event-notes").val("");
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
  $("body").one("click", "#js-btn-update-event", function(e) {
    e.preventDefault();
    const field = $("#event-update-field").val();
    const text = $("#js-text-update-event").val();
    const startTime = $("#js-event-time").val();
    let dayClass = $(this)
      .parents("ul")
      .attr("class");
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

    let reqBody = {};
    reqBody._id = id;
    reqBody.day = day;

    // Prevent field from updating if left blank
    if (text !== "") {
      reqBody[field] = text;
    }

    // Prevent startTime from updating if left blank
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
  const title = $("#js-task-title").val();
  const notes = $("#js-task-notes").val();

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
  $("body").on("click", "#js-btn-update-task", function(e) {
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
  $("body")
    .find(".priority-on")
    .children(".js-task-priority-off")
    .addClass("hidden");
  $("body")
    .find(".priority-on")
    .children(".js-task-priority-on")
    .removeClass("hidden");

  $("body")
    .find(".priority-off")
    .children(".js-task-priority-off")
    .removeClass("hidden");
  $("body")
    .find(".priority-off")
    .children(".js-task-priority-on")
    .addClass("hidden");
}

// ///// START APPLICATION & LISTEN FOR BUTTON CLICKS
// REFRESH PAGE LISTEN TO PAGE
$(document).ready(function() {
  if (localStorage.getItem("jwt")) {
    $(".header")
      .removeClass("before-planner")
      .addClass("after-planner");
    $("#js-user-signout").removeClass("hidden");
    $("#js-login-form").addClass("hidden");
    getEventsData();
    getTasksData();
    $("#planner").removeClass("hidden");
  }
});

// LOGIN EVENT BUTTON
$("body").on("click", "#js-login-submit", function(e) {
  e.preventDefault();
  logIn();
});

// SIGN UP EVENT BUTTON
$("body").on("click", "#js-signup-submit", function(e) {
  e.preventDefault();
  signupUser();
});

// SIGN OUT BUTTON EVENT LISTENER
$("body").on("click", "#js-user-signout", function(e) {
  // Clear JWT from local Storage
  localStorage.removeItem("jwt");

  // Clear planner data
  $(".js-monday").empty();
  $(".js-tuesday").empty();
  $(".js-wednesday").empty();
  $(".js-thursday").empty();
  $(".js-friday").empty();
  $(".js-saturday").empty();
  $(".js-sunday").empty();

  // Clear task data
  $("#to-do").empty();

  // Re-position header
  $("div.header").addClass("before-planner");
  $("div.header").removeClass("after-planner");

  // Hide planner view
  $("#planner").addClass("hidden");

  // Hide signout link
  $(this).addClass("hidden");

  // Display login view
  $("#js-login-form").removeClass("hidden");
});

// RENDER SIGN UP FORM
$("body").on("click", "#sign-up-link", function(e) {
  e.preventDefault();
  $("body")
    .find("#js-login-form")
    .addClass("hidden");
  $("body")
    .find(".js-login-fail")
    .remove();
  $("body")
    .find("#js-signup-form")
    .removeClass("hidden");
});

// RENDER LOG IN FORM
$("body").on("click", "#login-link", function(e) {
  e.preventDefault();
  $("body")
    .find("#js-login-form")
    .removeClass("hidden");
  $("body")
    .find(".js-user-failure")
    .remove();
  $("body")
    .find(".js-user-success")
    .remove();
  $("body")
    .find("#js-signup-form")
    .addClass("hidden");
});

// DISPLAY CREATE EVENT OR TASK BUTTON
$("body").on("click", "#js-create", function(e) {
  e.preventDefault();
  // find button and toggle hidden class on / off
  $("body")
    .find("#js-create-new-event")
    .toggleClass("hidden");
  $("body")
    .find("#js-create-new-task")
    .toggleClass("hidden");
});

// // listen for create new event button click
$("body").on("click", "#js-create-new-event", function() {
  $("body")
    .find("#js-create")
    .addClass("hidden");
  $("body")
    .find("#js-create-new-event")
    .addClass("hidden");
  $("body")
    .find("#js-create-new-task")
    .addClass("hidden");
  renderNewEventForm();
});

// // listen for cancel create new event button click
$("body").on("click", "#js-cancel-create-event", function() {
  $("#new-event-form").remove();
  $("body")
    .find("#js-create")
    .removeClass("hidden");
});

// // listen for create new task button click
$("body").on("click", "#js-create-new-task", function() {
  $("body")
    .find("#js-create")
    .addClass("hidden");
  $("body")
    .find("#js-create-new-event")
    .addClass("hidden");
  $("body")
    .find("#js-create-new-task")
    .addClass("hidden");
  renderNewTaskForm();
});

// // listen for cancel create new task button click
$("body").on("click", "#js-cancel-create-task", function() {
  $("#new-task").remove();
  $("body")
    .find("#js-create")
    .removeClass("hidden");
});

// LISTEN FOR CLICK ON EVENT TO DISPLAY EVENTS
$("body").on("click", ".js-event", function() {
  $(this)
    .children("ul")
    .toggleClass("hidden");
});

// LISTEN FOR CLICK ON TASK TO DISPLAY TASKS
$("body").on("click", ".js-task-item", function() {
  $(this)
    .children("ul")
    .toggleClass("hidden");
});

// CREATE EVENT BUTTON
$("body").on("click", "#js-btn-create-event", function(e) {
  e.preventDefault();
  createEvent();
});

// UPDATE EVENT BUTTON
$("body").on("click", ".update-event", function() {
  let eventId = $(this)
    .closest("li")
    .attr("id");
  $("body")
    .find(".update-event")
    .addClass("hidden");
  $(this)
    .next()
    .addClass("hidden");
  displayEditEventForm(eventId);
});

// DELETE EVENT BUTTON
$("body").on("click", ".delete-event", function() {
  let eventId = $(this)
    .closest("li")
    .attr("id");
  let token = localStorage.getItem("jwt");
  let day;
  let dayClass = $(this)
    .parent()
    .closest("ul")
    .attr("class");

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

  if (confirm("Are you sure you want to delete this event?")) {
    fetch(`/planner/events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ _id: eventId, day })
    }).then(() => {
      getEventsData();
    });
  }
});

// CREATE TASK BUTTON
$("body").on("click", "#js-btn-create-task", function(e) {
  e.preventDefault();
  createTask();
});

// UPDATE TASK BUTTON
$("body").on("click", ".update-task", function(e) {
  let eventId = $(this)
    .prev()
    .parent()
    .attr("id");
  $("body")
    .find(".update-task")
    .addClass("hidden");
  $(this)
    .next()
    .addClass("hidden");
  displayEditTaskForm(eventId);
});

// TASK COMPLETE BUTTON
$("body").on("click", ".js-task-complete", function() {
  let eventId = $(this)
    .parent()
    .attr("id");
  completeTask(eventId);
});

// TASK UNDO BUTTON
$("body").on("click", ".js-task-undo", function() {
  let eventId = $(this)
    .parent()
    .attr("id");
  undoCompleteTask(eventId);
});

// TASK PRIORITY ON BUTTON
$("body").on("click", ".js-task-priority-off", function() {
  let eventId = $(this)
    .parent()
    .attr("id");
  priorityOn(eventId);
});

// TASK PRIORITY OFF UBTTON
$("body").on("click", ".js-task-priority-on", function() {
  let eventId = $(this)
    .parent()
    .attr("id");
  priorityOff(eventId);
});

// DELETE TASK EVENT LISTENER
$("body").on("click", ".delete-task", function(e) {
  let taskId = $(this)
    .prev()
    .parent()
    .attr("id");

  let token = localStorage.getItem("jwt");
  if (confirm("Are you sure you want to delete this task?")) {
    fetch(`/planner/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).then(() => {
      getTasksData();
    });
  }
});
