# Client Documentation for Canvas Flow

Canvas Flow is a web application designed to integrate with Canvas LMS to manage tasks and events effectively. This document provides an overview of the client-side functionality and how to interact with the user interface.

## Overview

The client side of Canvas Flow is built with React.js and utilizes Material-UI for styling. It interacts with the server via API endpoints to perform CRUD operations on tasks, events, and user accounts.

## Installation

To run Canvas Flow client on your local machine:

1. Clone the repository to your local machine.
2. Navigate to the client directory.
3. Run `npm install` to install dependencies.
4. Start the development server with `npm start`.

## Features

### User Authentication

- **Login**: Users can log in using their email and password.
- **Signup**: New users can create an account.

### Task Management

- **View Tasks**: Display all tasks associated with the logged-in user.
- **Add Task**: Users can add new tasks with details such as name, start date, deadline, priority, and notes.
- **Edit Task**: Existing tasks can be edited.
- **Delete Task**: Users can delete tasks.

### Event Integration with Canvas

- **Fetch Events**: Users can retrieve events from their Canvas calendar.
- **View Events**: Display a list of events fetched from Canvas.

## Components

- `LoginComponent`: Handles user login.
- `SignupComponent`: Handles user registration.
- `TaskListComponent`: Displays a list of tasks.
- `TaskFormComponent`: Form to add or edit tasks.
- `EventListComponent`: Shows a list of Canvas events.

## Usage

After logging in, users are directed to the dashboard, where they can view tasks and events. Users can navigate using the sidebar to access different sections of the application.

## API Interaction

The client interacts with the server via RESTful API endpoints. The following are the primary endpoints used:

- `/auth/login`
- `/auth/signup`
- `/tasks`
- `/events/CanvasEvents`
- `/events/fetchCanvasEvents`

## State Management

State is managed using React's Context API and hooks. Stateful logic is encapsulated in custom hooks and context providers.

## Styling

Material-UI is used for styling components. The theme can be customized in `theme.js`.

## Testing

- Run `npm test` to execute the test suite.
- Components are tested using React Testing Library.

## Build and Deployment

- To create a production build, run `npm run build`.
- Deploy the build to a web server or a service like Netlify or Vercel.

## Support

For issues or feature requests, please file a ticket on our GitHub repository issue tracker.

For more information on how to use Canvas Flow, visit our [Help Center](#).

## Contributing

Contributions are welcome. Please read our [Contributing Guide](CONTRIBUTING.md) for more information on making pull requests.

---

Canvas Flow is maintained by a dedicated team of developers who are committed to providing a seamless integration with Canvas LMS for task and event management.
