# Canvas Flow

Canvas Flow is a comprehensive application designed to integrate with the Canvas LMS to provide an enhanced, streamlined experience for managing courses, tasks, and events. It offers an intuitive interface for students and educators to interact with Canvas data, along with additional features to improve organization and productivity.

## Features

- **User Authentication**: Secure user accounts with login and signup capabilities.
- **Task Management**: Users can create, update, and organize tasks associated with their courses.
- **Event Integration**: Automatically synchronizes events from the Canvas calendar.
- **Course Overview**: Provides an at-a-glance view of course details, assignments, and announcements.
- **Material-UI Design**: A clean and modern interface for a superior user experience.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL (v12 or later)
- A Canvas LMS account

### Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/canvas-flow.git
cd canvas-flow
```

#### Set up the server

Navigate to the server directory and install the dependencies:

```bash
cd server
npm install
```

Set up your `.env` file with the required environment variables:

```env
PORT=8000
DB_USERNAME=yourusername
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=yoursecret
```

Run the server:

```bash
npm start
```

#### Set up the client

Navigate to the client directory and install the dependencies:

```bash
cd ../client
npm install
```

Start the React development server:

```bash
npm start
```

The application should now be running on `http://localhost:3000`.

### Usage

Log in with your Canvas credentials to access your dashboard. You can add tasks, view upcoming events, and manage your courses directly from the dashboard.

## Documentation

- **API Documentation**: For backend API details, see [API_DOCS.md](./server/API_DOCS.md).
- **Client Documentation**: For frontend component details, see [CLIENT_DOCS.md](./client/CLIENT_DOCS.md).

## Contributing

We encourage contributions to Canvas Flow! Please check out our [Contributing Guide](./CONTRIBUTING.md) for guidelines on how to proceed.

## License

Canvas Flow is open source software [licensed as MIT](./LICENSE).
