'use strict';
require('dontenv').config();
const express = require('express');

const app = express();

const { Task } = require('../models/tasks');
const { User } = require('../models/user');
const { Cal, Event } = require('../models/calendar');

// Create new event
function newEvent() {
  // Verify all fields are complete

  // Verify event name is a string

  // Verify notes is a string

  // Add new event to Calendar
};

// Update existing event
function changeEvent() {

};

// Delete existing event
function deleteEvent() {

};

// Create new task
function newTask() {

};

// Update existing task
function changeTask() {

};

// Delete existing task
function deleteTask() {

};

module.export = { newEvent, changeEvent, deleteEvent, newTask, changeTask, deleteTask };
