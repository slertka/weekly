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
  $("body")
    .find("#new-task")
    .remove();
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
    .closest("li")
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
