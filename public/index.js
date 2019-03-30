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

function convertTime() {
  // find items with the time class

  $(".time").each(function() {
    console.log($(this).html());
    if ($(this).html() !== "") {
      let timeDisplay;
      let hour = parseInt(
        $(this)
          .text()
          .substring(0, 2)
      );
      let min = parseInt(
        $(this)
          .text()
          .substring(3, 5)
      );
      if (hour > 12) {
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
  const title = $("#js-task-title").val();
  const notes = $("#js-task-notes").val();

  if (title == "") {
    $(".task-title-empty").remove();
    return $("#new-task").prepend(`
      <p class="task-title-empty">Enter a valid title</p>
    `);
  }

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
