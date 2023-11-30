CREATE DATABASE postgres;

CREATE TYPE priority_enum AS ENUM ('High', 'Medium', 'Low');
CREATE TYPE task_status_enum AS ENUM ('Not-Started', 'In-Progress', 'Completed');
CREATE TYPE notification_status_enum AS ENUM ('Read', 'Unread');
CREATE TYPE task_type_enum AS ENUM ('Exam', 'Project', 'Assignment');

CREATE TABLE Users (
  user_id SERIAL PRIMARY KEY,
  fname VARCHAR(250),
  lname VARCHAR(250),
  email VARCHAR(250) UNIQUE NOT NULL,
  hashed_pass CHAR(60) NOT NULL,
  canvasurl VARCHAR(250) DEFAULT NULL
);

CREATE TABLE CanvasEvents (
  event_id TEXT PRIMARY KEY,
  dtstamp TEXT,
  user_id INT REFERENCES Users(user_id) ON DELETE CASCADE NOT NULL,
  dtstart TEXT,
  description TEXT,
  summary TEXT,
  url TEXT,
  task_type task_type_enum
);

CREATE TABLE Tasks (
  task_id SERIAL PRIMARY KEY,
  event_id TEXT REFERENCES CanvasEvents(event_id) ON DELETE CASCADE DEFAULT NULL,
  user_id INT REFERENCES Users(user_id) ON DELETE CASCADE NOT NULL,
  task_name VARCHAR(250) NOT NULL,
  start_date DATE,
  deadline DATE,
  priority_level priority_enum,
  task_status task_status_enum,
  created_at TIMESTAMP NOT NULL,
  note TEXT,
  task_type task_type_enum
);

CREATE TABLE CanvasEvents (
  event_id TEXT PRIMARY KEY,
  dtstamp TEXT,
  user_id INT REFERENCES Users(user_id) ON DELETE CASCADE NOT NULL,
  dtstart TEXT,
  description TEXT,
  summary TEXT,
  url TEXT,
  task_type task_type_enum
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

CREATE OR REPLACE FUNCTION trigger_add_event_to_task()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if a task associated with this event_id already exists --
  IF NOT EXISTS (SELECT 1 FROM Tasks WHERE event_id = NEW.event_id) THEN
    -- If no task with this event_id exists, insert a new task --
    INSERT INTO Tasks 
      (event_id, user_id, task_name, start_date, deadline, priority_level, task_status, created_at, note, task_type)
    VALUES 
      (NEW.event_id, NEW.user_id, NEW.summary, NEW.dtstamp::DATE, NEW.dtstart::DATE, 'Medium', 'Not-Started', NOW(), NEW.description, NEW.task_type);
  ELSE
    -- If a task with this event_id already exists, update that task --
    UPDATE Tasks SET
      user_id = NEW.user_id,
      task_name = NEW.summary,
      start_date = NEW.dtstamp::DATE,
      deadline = NEW.dtstart::DATE,
      priority_level = 'Medium',
      task_status = 'Not-Started',
      note = NEW.description,
      task_type = NEW.task_type
    WHERE event_id = NEW.event_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_event_to_task
AFTER INSERT OR UPDATE ON CanvasEvents
FOR EACH ROW
EXECUTE FUNCTION trigger_add_event_to_task();

-- Enabling Views for Tables:
-- CREATE OR REPLACE FUNCTION current_user_id() RETURNS INTEGER AS $$
-- BEGIN
--     RETURN (SELECT user_id FROM Users WHERE username = current_user);
-- END;
-- $$ LANGUAGE plpgsql;

-- ALTER TABLE Users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE Tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE CanvasEvents ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY select_own_record ON Users
-- FOR SELECT
-- USING (user_id = current_user_id());

-- CREATE POLICY update_own_record ON Users
-- FOR UPDATE
-- USING (user_id = current_user_id());

-- CREATE POLICY select_own_tasks ON Tasks
-- FOR SELECT
-- USING (user_id = current_user_id());

-- CREATE POLICY modify_own_tasks ON Tasks
-- FOR ALL
-- USING (user_id = current_user_id());

-- CREATE POLICY select_own_events ON CanvasEvents
-- FOR SELECT
-- USING (user_id = current_user_id());

-- CREATE POLICY modify_own_events ON CanvasEvents
-- FOR ALL
-- USING (user_id = current_user_id());



-- SIMULATING DATa:
-- Inserting data into the Users table
INSERT INTO Users (fname, lname, email, hashed_pass)
VALUES ('Tom', 'Smith', 'tom@email.com', '$2b$10$2younuZUPbBrWIH15j6joOACwST4f3TAAvsB1HOCORc9mZuqNJSRa');

INSERT INTO Users (fname, lname, email, hashed_pass)
VALUES ('Sara', 'Jones', 'sara@email.com', '$2b$10$2younuZUPbBrWIH15j6joOACwST4f3TAAvsB1HOCORc9mZuqNJSRa');

-- Inserting data into the Tasks table
INSERT INTO Tasks (user_id, task_name, start_date, deadline, priority_level, task_status, created_at, note, task_type)
VALUES (1, 'Study Math', '2023-01-01', '2023-01-10', 'High', 'Not-Started', NOW(), 'Prepare for math exam', 'Exam');

INSERT INTO Tasks (user_id, task_name, start_date, deadline, priority_level, task_status, created_at, note, task_type)
VALUES (2, 'Project Work', '2023-02-15', '2023-03-01', 'Medium', 'In-Progress', NOW(), 'Work on project', 'Project');

-- Inserting data into the Tag table
INSERT INTO Tag (tag_name, course_id, tag_description)
VALUES ('Math101', 'MATH101', 'Math tag');

INSERT INTO Tag (tag_name, course_id, tag_description)
VALUES ('CS202', 'COMP202', 'CS tag');

-- Inserting data into the TaskTag table
INSERT INTO TaskTag (task_id, tag_name)
VALUES (1, 'Math101');

INSERT INTO TaskTag (task_id, tag_name)
VALUES (2, 'CS202');

-- -- Inserting data into the Notifications table
-- INSERT INTO Notifications (user_id, message, notification_status, created_at, remind_at)
-- VALUES (1, 'Exam Reminder', 'Unread', NOW(), '2023-01-09T12:00:00Z');

-- INSERT INTO Notifications (user_id, message, notification_status, created_at, remind_at)
-- VALUES (2, 'Project Deadline', 'Unread', NOW(), '2023-02-28T10:00:00Z');
