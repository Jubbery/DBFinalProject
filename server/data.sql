
CREATE DATABASE todoapp;

CREATE TYPE priority_enum AS ENUM ('High', 'Medium', 'Low');
CREATE TYPE task_status_enum AS ENUM ('Not-Started', 'In-Progress', 'Completed');
CREATE TYPE notification_status_enum AS ENUM ('Read', 'Unread');
CREATE TYPE task_type_enum AS ENUM ('Exam', 'Project', 'Assignment');

CREATE TABLE Users (
  user_id INT PRIMARY KEY,
  fname VARCHAR(250) NOT NULL,
  lname VARCHAR(250) NOT NULL,
  email VARCHAR(250) UNIQUE NOT NULL,
  hashed_pass CHAR(64) NOT NULL
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
  uid TEXT PRIMARY KEY,
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
