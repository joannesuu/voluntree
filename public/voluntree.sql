USE voluntree;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS rsvp;
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS notification_subscription;
DROP TABLE IF EXISTS google_auth;
DROP TABLE IF EXISTS email_auth;
DROP TABLE IF EXISTS system_admin;
DROP TABLE IF EXISTS volunteer;
-- ALTER TABLE branch DROP FOREIGN KEY fk_manager;
DROP TABLE IF EXISTS manager;
DROP TABLE IF EXISTS branch;
DROP TABLE IF EXISTS user;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE user (
    user_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    email VARCHAR(50) DEFAULT NULL,
    contact_number VARCHAR(20),
    date_of_birth DATE,
    user_role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE branch (
  branch_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  image_url VARCHAR(255) DEFAULT '/public/rundle.jpg' ,
  branch_name VARCHAR(45) NOT NULL,
  email VARCHAR(50) DEFAULT NULL,
  phone_number VARCHAR(45) DEFAULT NULL,
  descriptions VARCHAR(200) DEFAULT NULL,
  unit VARCHAR(50) DEFAULT NULL,
  street_address VARCHAR(50) NOT NULL,
  city VARCHAR(50) DEFAULT NULL,
  post_code SMALLINT UNSIGNED NOT NULL,
  states VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (branch_id)
);

CREATE TABLE manager (
  manager_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  branch_id INT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (manager_id),
  CONSTRAINT fk_manager_user
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_manager_branch
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ALTER TABLE branch
-- ADD CONSTRAINT fk_manager
-- FOREIGN KEY (branch_id) REFERENCES manager(manager_id);

CREATE TABLE system_admin (
  system_admin_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (system_admin_id),
  CONSTRAINT fk_system_admin_user
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE email_auth (
  user_id INT UNSIGNED NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_email_auth_user
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE volunteer (
    volunteer_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NULL,
    branch_id INT UNSIGNED NULL,
    PRIMARY KEY (volunteer_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE notification_subscription (
  volunteer_id INT UNSIGNED NOT NULL,
  -- receive_update BOOLEAN NOT NULL DEFAULT TRUE,
  receive_event BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (volunteer_id),
  CONSTRAINT fk_notification_volunteer
    FOREIGN KEY (volunteer_id) REFERENCES volunteer(volunteer_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE event (
  event_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  unit VARCHAR(50),
  street_address VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  post_code SMALLINT NOT NULL,
  state VARCHAR(50) NOT NULL,
  branch_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (event_id),
  CONSTRAINT fk_branch_id FOREIGN KEY (branch_id) REFERENCES branch (branch_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE post (
  post_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  audience VARCHAR(50) DEFAULT NULL,
  published_date DATE DEFAULT NULL,
  published_time TIME DEFAULT NULL,
  branch_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (post_id),
  CONSTRAINT fk_branch_post
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE rsvp (
  rsvp_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  event_id INT UNSIGNED NOT NULL,
  volunteer_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (rsvp_id),
  CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES event (event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_volunteer_id FOREIGN KEY (volunteer_id) REFERENCES volunteer (volunteer_id) ON DELETE CASCADE ON UPDATE CASCADE
);


DELIMITER $$

CREATE TRIGGER after_user_insert
AFTER INSERT ON user
FOR EACH ROW
BEGIN
    IF NEW.user_role = 'volunteer' THEN
      INSERT INTO volunteer (user_id)
      VALUES (NEW.user_id);
      INSERT INTO notification_subscription (volunteer_id) VALUES (LAST_INSERT_ID());

    ELSEIF NEW.user_role = 'admin' THEN
      INSERT INTO system_admin (user_id) VALUES (NEW.user_id);
    ELSEIF NEW.user_role = 'manager' THEN
      INSERT INTO manager (user_id) VALUES (NEW.user_id);
    END IF;
END$$

DELIMITER ;



-- Insert dummy data into the user table
-- INSERT INTO user (first_name, last_name, email, contact_number, date_of_birth, user_role)
-- VALUES
-- ('TAYLOR', 'SWIFT', 'taylorswift@gmail.com', '0451118234', '1999-12-31',  'VOLUNTEER'),
-- ('JONATHAN MATHIUS', 'LEE', 'jonM1923@gmail.com', '0452938234', '1923-04-28','MANAGER'),
-- ('PERRY', 'PLATYPUS', 'pp@gmail.com', '0411223344', '1987-02-17', 'ADMIN');

-- UPDATE volunteer SET branch_id=1 WHERE user_id=1;
-- UPDATE manager SET branch_id=3 WHERE user_id=2;


-- INSERT INTO email_auth (user_id, password_hash) VALUES (1, '$2b$16$ePucftquAaLg9qeCEqsPOeN57dRcA5xAaxRgxb1V2El1bxCu7KFlS');
-- INSERT INTO email_auth (user_id, password_hash) VALUES (2, '$2b$16$DXMOtV5GQQJ1C44RHzVrsOpOtYZkGfiPrgPVH88XJse5fpLvPZqIW');


-- Insert dummy data into the branch table
INSERT INTO branch (image_url,branch_name, email, phone_number, descriptions, unit, street_address, city, post_code, states)
VALUES
("public/rundle.jpg",'Adelaide', 'adelaideVoluntree@gmail.com','0419837643','Branch based in Adelaide','12', 'South St', 'Adelaide', 5000, 'SA'),

("public/rundle.jpg",'Sydney', 'sydneyVoluntree@gmail.com','0420827633','Branch based in Sydney','9A', 'Jacob Boulevard', 'Sydney', 2005, 'NSW'),

("public/rundle.jpg",'Melbourne', 'melbourneVoluntree@gmail.com','0419837643','Branch based in Melbourne','8', 'South St', 'Melbourne', 3000, 'VIC'),

("public/rundle.jpg", 'Brisbane', 'brisbaneVoluntree@gmail.com', '0419837633', 'Branch based in Brisbane', '5', 'North St', 'Brisbane', 4000, 'QLD');


-- Insert dummy data into the volunteer table
-- SELECT user_id FROM user WHERE email IN ('taylorswift@gmail.com', 'jonathanlee@gmail.com');
-- SELECT branch_id FROM branch WHERE branch_name IN ('Adelaide', 'Sydney');

-- INSERT INTO volunteer (user_id, branch_id)
-- VALUES
-- (1, 1),
-- (2, 2);


INSERT INTO event (name, description, date, start_time, end_time, unit, street_address, city, post_code, state, branch_id)
VALUES
('Community Clean-up', 'Join us for a community clean-up event in the local park.', '2024-07-15', '09:00:00', '12:00:00', '12', 'Park St', 'Adelaide', 5000, 'South Australia', 1),
('Food Drive', 'Help us collect and distribute food to those in need.', '2024-08-20', '10:00:00', '14:00:00', '45A', 'Main Rd', 'Sydney', 2000, 'New South Wales', 2),
('Charity Run', 'Participate in our charity run to raise funds for local shelters.', '2024-09-10', '08:00:00', '11:00:00', '78', 'Runway Ave', 'Brisbane', 4000, 'Queensland', 3),
('Community Clean-up 2', 'Join us for a community clean-up event in the local park.', '2024-07-15', '09:00:00', '12:00:00', '12', 'Park St', 'Adelaide', 5000, 'South Australia', 1);




-- Insert dummy data into the rsvp table
-- INSERT INTO rsvp (event_id, volunteer_id) VALUES
-- ((SELECT event_id FROM event WHERE name = 'Career Expo Day 1'), (SELECT volunteer_id FROM volunteer WHERE user_id = (SELECT user_id FROM user WHERE email = 'taylorswift@gmail.com'))),
-- ((SELECT event_id FROM event WHERE name = 'Community Clean-up'), (SELECT volunteer_id FROM volunteer WHERE user_id = (SELECT user_id FROM user WHERE email = 'jonathanlee@gmail.com')));

-- Get event IDs
-- SELECT event_id FROM event WHERE name IN ('Career Expo Day 1', 'Community Clean-up');

-- Get volunteer IDs
-- SELECT volunteer_id FROM volunteer;

-- Insert RSVPs
-- INSERT INTO rsvp (event_id, volunteer_id) VALUES
-- (1, 1),
-- (2, 2),
-- (3, 1),
-- (4, 2);

-- Insert dummy data into the post table
INSERT INTO post (title, content, audience, published_date, published_time, branch_id) VALUES
('Welcome to Adelaide Branch', 'We are excited to welcome new volunteers to the Adelaide branch.', 'Public', '2024-01-15', '09:00:00', (SELECT branch_id FROM branch WHERE branch_name = 'Adelaide')),

('Sydney Branch Event', 'Join us for a community clean-up event in Sydney.', 'Private', '2024-02-20', '10:30:00', (SELECT branch_id FROM branch WHERE branch_name = 'Sydney')),

('Brisbane Branch Update', 'We are pleased to announce new volunteer opportunities in the Brisbane branch.', 'Public', '2024-03-01', '11:00:00', (SELECT branch_id FROM branch WHERE branch_name = 'Brisbane')),

('Hobart Branch Meeting', 'All volunteers are invited to the upcoming meeting at the Hobart branch.', 'Public', '2024-04-01', '14:00:00', (SELECT branch_id FROM branch WHERE branch_name = 'Melbourne'));