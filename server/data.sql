
CREATE DATABASE todoapp;

CREATE TYPE priority_enum AS ENUM ('High', 'Medium', 'Low');
CREATE TYPE task_status_enum AS ENUM ('Not-Started', 'In-Progress', 'Completed');
CREATE TYPE notification_status_enum AS ENUM ('Read', 'Unread');
CREATE TYPE task_type_enum AS ENUM ('Exam', 'Project', 'Assignment');

CREATE TABLE Users (
  user_id SERIAL PRIMARY KEY,
  fname VARCHAR(250),
  lname VARCHAR(250),
  email VARCHAR(250) UNIQUE NOT NULL,
  hashed_pass CHAR(60) NOT NULL
  canvasurl VARCHAR(250) DEFAULT NULL,
);

CREATE TABLE Tasks (
  task_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES Users(user_id) ON DELETE CASCADE NOT NULL,
  task_name VARCHAR(250) NOT NULL,
  start_date DATE,
  deadline DATE,
  priority_level priority_enum,
  task_status task_status_enum,
  created_at TIMESTAMP NOT NULL,
  note VARCHAR(250),
  task_type task_type_enum
);

CREATE TABLE CanvasEvents (
  dtstamp TEXT,
  user_id INT REFERENCES Users(user_id) ON DELETE CASCADE NOT NULL,
  dtstart TEXT,
  class TEXT,
  description TEXT,
  sequence INTEGER,
  summary TEXT,
  url TEXT,
  x_alt_desc TEXT
);

CREATE TABLE Tag (
  tag_name VARCHAR(250) PRIMARY KEY,
  course_id VARCHAR(250) UNIQUE,
  tag_description VARCHAR(250)
);

CREATE TABLE TaskTag (
  task_id INT REFERENCES Tasks(task_id) NOT NULL,
  tag_name VARCHAR(250) REFERENCES Tag(tag_name) NOT NULL
);

CREATE TABLE Notifications (
  notification_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES Users(user_id) NOT NULL,
  message VARCHAR(250) NOT NULL,
  notification_status notification_status_enum,
  created_at TIMESTAMP NOT NULL,
  remind_at TIMESTAMP
);

CREATE TABLE TaskNotification (
  task_id INT REFERENCES Tasks(task_id) NOT NULL,
  notification_id INT REFERENCES Notifications(notification_id) NOT NULL
);

CREATE TABLE Courses (
  course_id VARCHAR(250) PRIMARY KEY UNIQUE,
  tag_name VARCHAR(250) REFERENCES Tag(tag_name) NOT NULL,
  description VARCHAR(250),
  course_code VARCHAR(250),
  semester VARCHAR(250)
);

-- SIMULATED DATA FOR DATABASE 

-- Inserting data into Users table
-- plaintext password is "password" associated hash is '$2b$10$0krZmoyvT0NVvRAtZ1eBOeUw7ZLrikWtaCK1xbDCBe1IFi2bPO.iS    '
-- Users Table
INSERT INTO Users (fname, lname, email, hashed_pass) VALUES
  ('John', 'Doe', 'john.doe@example.com', '$2b$10$2younuZUPbBrWIH15j6joOACwST4f3TAAvsB1HOCORc9mZuqNJSRa'),
  ('Jane', 'Smith', 'jane.smith@example.com', '$2b$10$2younuZUPbBrWIH15j6joOACwST4f3TAAvsB1HOCORc9mZuqNJSRa');

-- Tasks Table
INSERT INTO Tasks (user_id, task_name, start_date, deadline, priority_level, task_status, created_at, note, task_type) VALUES
  (1, 'Study for Exam 1', '2023-11-22', '2023-11-30', 'High', 'Not-Started', '2023-11-22 12:00:00', 'Prepare for the upcoming exam', 'Exam'),
  (2, 'Complete Project', '2023-11-25', '2023-12-05', 'Medium', 'In-Progress', '2023-11-22 14:30:00', 'Work on the assigned project', 'Project');

-- Tag Table
INSERT INTO Tag (tag_name, course_id, tag_description) VALUES
  ('Math', 'MATH101', 'Introduction to Mathematics'),
  ('CS', 'CS201', 'Introduction to Computer Science');

-- TaskTag Table
INSERT INTO TaskTag (task_id, tag_name) VALUES
  (1, 'Math'),
  (2, 'CS');

-- Notifications Table
INSERT INTO Notifications (user_id, message, notification_status, created_at, remind_at) VALUES
  (1, 'Reminder: Exam Tomorrow', 'Unread', '2023-11-29 18:00:00', '2023-11-29 16:00:00'),
  (2, 'Project Deadline Approaching', 'Unread', '2023-12-04 10:00:00', '2023-12-03 15:00:00');

-- TaskNotification Table
INSERT INTO TaskNotification (task_id, notification_id) VALUES
  (1, 1),
  (2, 2);

-- Courses Table
INSERT INTO Courses (course_id, tag_name, description, course_code, semester) VALUES
  ('MATH101', 'Math', 'Introduction to Mathematics', 'MATH101', 'Fall 2023'),
  ('CS201', 'CS', 'Introduction to Computer Science', 'CS201', 'Fall 2023');
