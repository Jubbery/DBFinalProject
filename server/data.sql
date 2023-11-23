
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

--

-- Insert into Users
INSERT INTO Users(user_id, fname, lname, email, hashed_pass)
VALUES (1, 'John', 'Doe', 'john.doe@example.com', 'hashedpassword1'),
     (2, 'Jane', 'Doe', 'jane.doe@example.com', 'hashedpassword2');

-- Insert into Tasks
INSERT INTO Tasks(user_id, task_name, start_date, deadline, priority_level, task_status, created_at, note, task_type)
VALUES (1, 'Task 1', '2022-01-01', '2022-01-31', 'High', 'Not-Started', CURRENT_TIMESTAMP, 'This is a note', 'Exam'),
     (2, 'Task 2', '2022-02-01', '2022-02-28', 'Medium', 'In-Progress', CURRENT_TIMESTAMP, 'This is another note', 'Project');

-- Insert into Tag
INSERT INTO Tag(tag_name, course_id, tag_description)
VALUES ('Tag1', 'Course1', 'This is a tag description'),
     ('Tag2', 'Course2', 'This is another tag description');

-- Insert into TaskTag
INSERT INTO TaskTag(task_id, tag_name)
VALUES (1, 'Tag1'),
     (2, 'Tag2');

-- Insert into Notifications
INSERT INTO Notifications(user_id, message, notification_status, created_at, remind_at)
VALUES (1, 'This is a notification', 'Unread', CURRENT_TIMESTAMP, '2022-01-15 12:00:00'),
     (2, 'This is another notification', 'Read', CURRENT_TIMESTAMP, '2022-02-15 12:00:00');

-- Insert into TaskNotification
INSERT INTO TaskNotification(task_id, notification_id)
VALUES (1, 1),
     (2, 2);

-- Insert into Courses
INSERT INTO Courses(course_id, tag_name, description, course_code, semester)
VALUES ('Course1', 'Tag1', 'This is a course description', 'CSE101', 'Spring 2022'),
     ('Course2', 'Tag2', 'This is another course description', 'CSE102', 'Spring 2022');