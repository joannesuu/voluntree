/* eslint-disable no-console */
/* eslint-disable no-undef */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: '',
  password: '',
  database: 'voluntree'
});
db.connect((err) => {
  if (err) throw err;
});
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//ADMIN ROUTES----------------------------------------------

/*Route to handle GET request to display list of all the users in the database */
router.get('/displayListOfUsers', function (req, res) {
  db.query(' SELECT u.user_id, u.first_name,u.last_name, u.user_role,u.email, b.branch_name FROM user u LEFT JOIN volunteer v ON u.user_id = v.user_id LEFT JOIN manager m ON u.user_id = m.user_id LEFT JOIN branch b ON (v.branch_id = b.branch_id OR m.branch_id = b.branch_id)WHERE v.user_id IS NOT NULL OR m.user_id IS NOT NULL;  ', (err, results) => {
    if (err) {
      res.status(500).send('Error in fetching users from database');
      return;
    }
    // console.log(results);
    //Send back a status code of 200 and results if successful
    res.status(200).json(results);
  });
});

/*Route to handle POST request to add user to database */
router.post('/addUser', function (req, res) {
  const { firstName, lastName, email, contactNumber, dateOfBirth, userRole, userBranch, userPassword } = req.body;
  //hash user password
  bcrypt.hash(userPassword, saltRounds, function (err, hash) {
    //Error check
    if (err) {
      console.error('Error here when hashing passwords');
      console.log(err);
      res.sendStatus(500);
      return;
    }
    //Make a query to insert user into the database
    db.query('INSERT INTO user (first_name, last_name, email, contact_number, date_of_birth, user_role) VALUES (?,?,?,?,?,?)', [firstName, lastName, email, contactNumber, dateOfBirth, userRole], (err, results) => {
      if (err) {
        res.sendStatus(500);
      }
      //Make a query to retrieve last inserted user id
      db.query('SELECT LAST_INSERT_ID() AS lastId', (err, results) => {
        //Error check
        if (err) {
          console.error('Error retrieving user id', err);
          res.sendStatus(500);
          return;
        }

        //Store user id and branch id
        const userId = results[0].lastId;
        const branchId = userBranch;

        //Depending on the user's role, update the respective tables accordingly
        //Update the branch id for the tables
        if (userRole === 'MANAGER') {
          db.query('UPDATE manager SET branch_id = ? WHERE user_id = ?', [branchId, userId], (err, results) => {
            //Error check
            if (err) {
              console.error('Error here for manager', err);
              res.sendStatus(500);
              return;
            }
          });
        }
        //Update the branch id for volunteer
        else if (userRole === 'VOLUNTEER') {
          db.query('UPDATE volunteer SET branch_id = ? WHERE user_id = ?', [branchId, userId], (err, results) => {
            //Error check
            if (err) {
              console.err('Error here for volunteer', err);
              res.sendStatus(500);
              return;
            }
          });
        }
        //Make a query to insert the login details into the email_auth table
        db.query('INSERT INTO email_auth (user_id, password_hash) VALUES (?, ?)', [userId, hash], (err) => {
          //Error check
          if (err) {
            console.error('Error when inserting into email_auth table:', err);
            return res.sendStatus(500);
          }
          return res.sendStatus(200);
        });
      });
    });

  });
});

/*Route to handle a post request to delete user */
router.post('/deleteUser', function (req, res) {
  const { userID } = req.body;
  //lastly, delete from the user table
  db.query('DELETE FROM user WHERE user_id = ?', [userID], (err, results) => {
    //Error check
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
    res.redirect('/manageUsers.html');
  });
});

/*Route to handle a POST request to edit user information*/
router.post('/editUser', function (req, res) {
  const { userID, attributeToChange, newValue } = req.body;

  //Update based on the attribute to be changed
  if (attributeToChange == 'firstName') {
    const query = 'UPDATE user SET first_name = ? WHERE user_id = ?';
    //Update first name if attribute to be changed is user's first name
    db.query(query, [newValue, userID], (err) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      }
    });
  } else if (attributeToChange == 'lastName') {
    const query = 'UPDATE user SET last_name = ? WHERE user_id = ?';
    //Update last name if attribute to be changed is user's last name
    db.query(query, [newValue, userID], (err) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      }
    });
  } else if (attributeToChange == 'contactNumber') {
    const query = 'UPDATE user SET contact_number = ? WHERE user_id = ?';
    //Update contact number if attribute to be changed is user's contact number
    db.query(query, [newValue, userID], (err) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      }
    });
  } else if (attributeToChange == 'email') {
    const query = 'UPDATE user SET email = ? WHERE user_id = ?';
    //Update email if attribute to be changed is user's email
    db.query(query, [newValue, userID], (err) => {
      //Error check
      if (err) {
        console.error(err);
        res.sendStatus(500);
      }
    });
  }
  //Send back status code of 200 if successful
  res.sendStatus(200);
});

/*Route to handle a POST request to retrieve a specific user's information */
router.post('/retrieveUserInfo', function (req, res) {
  const { userId } = req.body;
  //Make the query to retrieve the user's information
  db.query('SELECT * FROM user WHERE user_id = ?', [userId], (err, results) => {
    //Error check
    if (err) {
      console.err(err);
      res.sendStatus(500);
    }
    // console.log(results);

    //Send results with status code 200 if successful
    res.status(200).json(results[0]);
  });
});

/*END ADMIN ROUTES----------------------------------------------------------- */


/*VOLUNTEER ROUTES----------------------------------------------------------- */

/* API to retrieve user info on volunteer home page */
router.get('/displayUserNames.ajax', function (req, res) {
  const userId = req.session.userId;

  if (!userId) {
    res.status(400).send('User ID not found in session');
    return;
  }

  // get the sql query to get user info, connected branch info and volunteer id

  const sql_get_user_info = `
  SELECT u.first_name, u.last_name, b.branch_name, b.branch_id, v.volunteer_id
  FROM user u
  LEFT JOIN volunteer v ON u.user_id = v.user_id
  LEFT JOIN branch b ON v.branch_id = b.branch_id
  WHERE u.user_id = ?
  `;

  db.query(sql_get_user_info, [userId], (err, result) => {
    if (err) {
      console.error('Error in fetching users from database:', err);
      res.status(500).send('Error in fetching users from database');
      return;
    }

    if (result.length === 0) {
      res.status(404).send('User not found');
      return;
    }
    console.log('Query result:', result);
    res.status(200).json(result[0]);
  });
});


/* API to retrieve events info on volunteer home page */
router.get('/displayEvents.ajax', (req, res) => {
  const eventId = req.query.eventId;
  const currentDate = new Date().toISOString().slice(0, 10); // Get current date in 'YYYY-MM-DD' format

  let sql = 'SELECT event_id, name, date, start_time, end_time, unit, street_address, city, post_code, state, description FROM event WHERE date >= ?';
  const params = [currentDate];

  if (eventId) {
    sql += ' AND event_id = ?';
    params.push(eventId);
  }

  //put events in timeline order
  sql += ' ORDER BY date ASC';

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error in fetching events from database:', err);
      res.status(500).send('Error in fetching events from database');
      return;
    }
    console.log('Query result:', result);
    res.status(200).json(result); // Send all upcoming events
  });
});

// display events specific to branch
router.get('/displayBranchEvents.ajax', (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    res.status(400).send('User ID not found in session');
    return;
  }

  // get the sql query to get events info for the user's branch
  const sql_get_events_info = `
  SELECT e.event_id, e.name, e.date, e.start_time, e.end_time, e.unit, e.street_address, e.city, e.post_code, e.state, e.description
  FROM event e
  JOIN branch b ON e.branch_id = b.branch_id
  JOIN volunteer v ON b.branch_id = v.branch_id
  JOIN user u ON v.user_id = u.user_id
  WHERE u.user_id = ?
  `;

  // const sql_get_events = `
  //   SELECT event_id, name, date, start_time, end_time, unit, street_address, city, post_code, state, description
  //   FROM event
  //   WHERE branch_id = ?
  // `;

  db.query(sql_get_events_info, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching events from database:', err);
      res.status(500).send('Error fetching events from database');
      return;
    }

    res.status(200).json(result); // Send all events for the user's branch
  });
});

// display all branches
router.get('/displayBranches.ajax', (req, res) => {
  console.log('Fetching branches...');
  const sql = 'SELECT branch_id, image_url, branch_name, email, phone_number, descriptions, unit, street_address, city, post_code, states FROM branch';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error in fetching branches from database:', err);
      res.status(500).send('Error in fetching branches from database');
      return;
    }
    console.log('Query result:', result);
    res.status(200).json(result); // Send all branches
  });
});


// display posts specific to branch
router.get('/displayBranchPosts.ajax', (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    res.status(400).send('User ID not found in session');
    return;
  }

  // get the sql query to get posts info for the user's branch
  const sql_get_posts_info = `
  SELECT p.title, p.content, p.audience, p.published_date, p.published_time
  FROM post p
  JOIN branch b ON p.branch_id = b.branch_id
  JOIN volunteer v ON b.branch_id = v.branch_id
  JOIN user u ON v.user_id = u.user_id
  WHERE u.user_id = ? AND p.branch_id = b.branch_id
  `;

  db.query(sql_get_posts_info, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching events from database:', err);
      res.status(500).send('Error fetching events from database');
      return;
    }

    res.status(200).json(result); // Send all events for the user's branch
  });
});


// display all posts
router.get('/displayPublicPosts.ajax', (req, res) => {
  const sql = 'SELECT title, content, audience, published_date, published_time FROM post WHERE audience = "Public" ORDER BY published_date DESC, published_time DESC';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error in fetching posts from database:', err);
      res.status(500).send('Error in fetching posts from database');
      return;
    }
    res.status(200).json(result); // Send all public posts
  });
});

router.get('/events/:userId', (req, res) => {
  const userId = req.session.userId;

  console.log('Fetching events for user ID:', userId);

  // get the sql query to get events for the user so that they can rsvp

  const sql = `
    SELECT e.event_id, e.name, e.start_time, e.end_time
    FROM event e
    JOIN rsvp r ON e.event_id = r.event_id
    JOIN volunteer v ON r.volunteer_id = v.volunteer_id
    WHERE v.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error in fetching events from database:', err);
      res.status(500).send('Error in fetching events from database');
      return;
    }

    if (result.length === 0) {
      console.log('No events found for user ID:', userId);
      res.status(404).send('No events found for this user');
      return;
    }

    console.log('Events found for user ID:', userId, result);
    res.status(200).json(result);
  });
});

// get user detaisl for profile page
router.get('/getUser', (req, res) => {
  const userId = req.session.userId;
  const query = `
      SELECT
      u.user_id, u.first_name, u.last_name, u.email, u.contact_number, v.branch_id
      FROM user u
      LEFT JOIN volunteer v ON u.user_id = v.user_id
      WHERE u.user_id = ?`;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error in fetching user data from database:', err);
      res.status(500).send('Error in fetching user data from database');
      return;
    }
    console.log('Query result:', result[0]);
    res.status(200).json(result[0]);
  });
});

// update profile when user edits profile
router.post('/updateUser', (req, res) => {
  const { userId, firstName, lastName, email, contact_number, branch_id } = req.body;

  if (!userId || !firstName || !lastName || !email || !contact_number || !branch_id) {
    res.status(400).send('Missing required fields');
    return;
  }

  // update user table
  const userQuery = 'UPDATE user SET first_name = ?, last_name = ?, email = ?, contact_number = ? WHERE user_id = ?';

  // update volunteer table
  const volunteerQuery = 'UPDATE volunteer SET branch_id = ? WHERE user_id = ?';


 db.query(userQuery, [firstName, lastName, email, contact_number, userId], (err, userResults) => {
  console.log("ran user query", firstName, lastName, email, contact_number, userId);
    if (err) {
      console.error('Error updating user table:', err);
      res.status(500).send('Error updating user table');
      return;
    }

    db.query(volunteerQuery, [branch_id, userId], (err, volunteerResults) => {
  console.log("ran volunteer query", branch_id, userId);

      if (err) {
        console.error('Error updating volunteer table:', err);
        res.status(500).send('Error updating volunteer table');
        return;
      }
      res.send('Profile updated successfully.');
    });
  });
});

// rsvp for an event and update it to Schedule
router.post('/rsvp', (req, res) => {
  const { eventId, volunteerId } = req.body;

  if (!eventId || !volunteerId) {
    res.status(400).send('Event ID and Volunteer ID are required');
    return;
  }

  // check if volunteer has already RSVPed to this event
  const checkRSVPQuery = `
    SELECT *
    FROM rsvp
    WHERE event_id = ? AND volunteer_id = ?`;

  db.query(checkRSVPQuery, [eventId, volunteerId], (err, rsvpResult) => {
    if (err) {
      console.error('Error checking existing RSVP:', err);
      res.status(500).send('Error checking existing RSVP');
      return;
    }

    if (rsvpResult.length > 0) {
      res.status(400).send('You have already RSVPed to this event');
      return;
    }

    // check if event and volunteer are from the same branch
    const eventBranchQuery = `
      SELECT branch_id
      FROM event
      WHERE event_id = ?`;

    const volunteerBranchQuery = `
      SELECT branch_id
      FROM volunteer
      WHERE volunteer_id = ?`;

    db.query(eventBranchQuery, [eventId], (err, eventResult) => {
      if (err) {
        console.error('Error fetching event branch:', err);
        res.status(500).send('Error fetching event branch');
        return;
      }

      if (eventResult.length === 0) {
        res.status(404).send('Event not found');
        return;
      }

      db.query(volunteerBranchQuery, [volunteerId], (err, volunteerResult) => {
        if (err) {
          console.error('Error fetching volunteer branch:', err);
          res.status(500).send('Error fetching volunteer branch');
          return;
        }

        if (volunteerResult.length === 0) {
          res.status(404).send('Volunteer not found');
          return;
        }

        // check if volunteer and event are from the same branch
        if (eventResult[0].branch_id === volunteerResult[0].branch_id) {
          const insertRSVPQuery = `
            INSERT INTO rsvp (event_id, volunteer_id)
            VALUES (?, ?)`;

          db.query(insertRSVPQuery, [eventId, volunteerId], (err, result) => {
            if (err) {
              console.error('Error inserting RSVP into database:', err);
              res.status(500).send('Error inserting RSVP into database');
              return;
            }
            res.status(200).send('RSVP successful');
          });
        } else {
          res.status(403).send('Volunteers can only RSVP to events of their own branch');
        }
      });
    });
  });
});

// Delete RSVP for an event
router.delete('/deleteRsvp', (req, res) => {
  const { eventId, volunteerId } = req.body;

  console.log('Delete RSVP request received');
  console.log('Event ID:', eventId);
  console.log('Volunteer ID:', volunteerId);

  if (!eventId || !volunteerId) {
    res.status(400).send('Event ID and Volunteer ID are required');
    return;
  }

  // delete RSVP from database
  const sql = 'DELETE FROM rsvp WHERE event_id = ? AND volunteer_id = ?';
  db.query(sql, [eventId, volunteerId], (err, result) => {
    if (err) {
      console.error('Error deleting RSVP from database:', err);
      res.status(500).send('Error deleting RSVP from database');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('RSVP not found');
      return;
    }

    res.status(200).send('RSVP deleted successfully');
  });
});

// notification subscription for volunteer
router.post('/subscribeNotifications', (req, res) => {
  const { volunteerId } = req.body;

//   const getVolunteerIdQuery = `
//       SELECT volunteer_id
//       FROM volunteer
//       WHERE user_id = ?
//   `;
// console.log(volunteerId);
//   db.query(getVolunteerIdQuery, [volunteerId], (err, results) => {
//       if (err) {
//           console.error('Error fetching volunteer ID:', err);
//           res.status(500).send('Error fetching volunteer ID');
//           return;
//       }

//       if (results.length === 0) {
//           res.status(404).send('Volunteer not found');
//           return;
//       }

//       const volunteerId = results[0].volunteer_id;

      const updateSubscriptionQuery = `
          UPDATE notification_subscription
          SET receive_event = TRUE
          WHERE volunteer_id = ?
      `;
  console.log(volunteerId);

      db.query(updateSubscriptionQuery, [volunteerId], (err, result) => {
          if (err) {
              console.error('Error updating subscription:', err);
              res.status(500).send('Error updating subscription');
              return;
          }

          res.status(200).send('Subscription updated successfully');
      });
});



module.exports = router;
