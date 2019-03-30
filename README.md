# Weekly: Plan for you

## Overview

Weekly is an full-stack application where users can create an account, log in, and access an interactive planner that tracks your events for the next week and any tasks you need to accomplish. Users can add new events, edit existing events, and remove existing events. The same actions can be done for tasks. Important tasks that you must accomplish can be made a priority.

Click [here](https://ancient-badlands-64634.herokuapp.com/) to try for yourself.

**Language:** Javascript  
**Technologies Used:** Node.js, Express, MongoDB / Mongoose, Passport, jQuery, HTML/CSS

## API Endpoints

### POST /signup

![user sign up](./public/img/desktop/desktop-signup.png)
Create a new user

### POST /login

![user log in](./public/img/desktop/desktop-login.png)
Log in to the application

### GET /planner/events and GET /planner/tasks

![desktop planner view](./public/img/desktop/desktop-planner.png)
![mobile planner view](./public/img/mobile/mobile-planner.png)
Display events and tasks

### POST /planner/events

![desktop create event](./public/img/desktop/desktop-create-event.png)
![mobile create event](./public/img/mobile/mobile-create-event.png)
Create new events

### POST /planner/tasks

![desktop create task](./public/img/desktop/desktop-create-task.png)
![mobile create task](./public/img/mobile/mobile-create-task.png)
Create new tasks

### PUT /planner/events/:id

![edit existing event](./public/img/edit-event.png)
Edit an existing event

### PUT /planner/tasks/id

![edit existing task](./public/img/edit-task.png)
Edit an existing task

### DELETE /planner/events/:id and DELETE /planner/events/:id

Delete an existing task or event
