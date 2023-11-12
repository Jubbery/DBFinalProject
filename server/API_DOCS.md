# API Documentation for Canvas Flow

This documentation outlines the API endpoints provided by the Canvas Flow application's server. These endpoints allow for interaction with the Canvas LMS and internal databases for task and event management.

## Authentication

### `POST /auth/login`

Authenticates a user.

- **Body**:
  - `email` - The user's email.
  - `password` - The user's password.

### `POST /auth/signup`

Creates a new user account.

- **Body**:
  - `email` - The user's email.
  - `password` - The user's chosen password.

## Users

### `GET /users`

Retrieves a list of all users.

### `POST /users`

Creates a new user.

- **Body**:
  - `fname` - First name.
  - `lname` - Last name.
  - `email` - Email address.
  - `hashed_pass` - A hashed password.

## Tasks

### `GET /tasks/:user_id`

Retrieves all tasks for a specific user.

- **Parameters**:
  - `user_id` - The ID of the user.

### `POST /tasks`

Creates a new task.

- **Body**:
  - `user_id` - The ID of the user.
  - `task_name` - Name of the task.
  - `start_date` - Start date of the task.
  - `deadline` - Deadline of the task.
  - `priority_level` - Priority level of the task.
  - `status` - Current status of the task.
  - `note` - Additional notes.
  - `task_type` - Type of the task.

## Events

### `POST /events/CanvasEvents`

Processes Canvas LMS events.

- **Body**: A JSON object representing the event.

### `POST /events/fetchCanvasEvents`

Fetches events from a Canvas LMS calendar URL.

- **Body**:
  - `canvasURL` - The Canvas calendar URL.

### `POST /events/fetchAllCanvasEvents`

Fetches all events from a Canvas LMS calendar URL.

- **Body**:
  - `canvasURL` - The Canvas calendar URL.

## Error Handling

All endpoints return an appropriate HTTP status code and, in case of an error, a JSON object with an `error` key describing the issue.

```json
{
  "error": "Description of the error"
}
```

## Status Codes

The API returns the following status codes:

- `200 OK`: The request was successful.
- `201 Created`: A new resource was successfully created.
- `400 Bad Request`: The request was invalid or incomplete.
- `401 Unauthorized`: Authentication failed.
- `403 Forbidden`: The request is not allowed.
- `404 Not Found`: The resource was not found.
- `500 Internal Server Error`: An error occurred on the server.

For more detailed examples, including request and response formats, please refer to our [Postman Collection](./postman_collection.json).

For any additional information or help, please contact the API team at api-support@canvasflow.com.
