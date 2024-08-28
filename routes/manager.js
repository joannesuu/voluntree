/* eslint-disable no-console */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const nodemailer = require('nodemailer');

const db = mysql.createConnection({
  host: 'localhost',
  user: '',
  password: '',
  database: 'voluntree'
});

db.connect((err) => {
  if (err) throw err;
});

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'walton.ritchie39@ethereal.email',
      pass: 'qg56wjaUWNCTutUbar'
  }
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


/*Route to handle GET request retrieve the list of events based on the branch id */
router.get('/displayEvents', function (req, res) {
  const branch_id = req.query.branch_id;
console.log(branch_id);

  // console.log(branch_id);
  //Make sql query to retrieve all the events
  db.query('SELECT * FROM event WHERE branch_id = ?', [branch_id], (err, result) => {
    //Error check
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      res.sendStatus(500);
    }
    //If sucessful, send back the results with status code 200
    res.status(200).send(result);
  });
});

/*Route to handle POST request to add an event to the database */
router.post('/addEvent', function (req, res) {
  // console.log(req.body);
  const { name, description, date, startTime: start_time, endTime: end_time, unit, streetAddress: street_address, city, state, postCode: post_code, branch_id } = req.body;
  //Make sql query to insert all the necessary event details
  db.query('INSERT INTO event (name, description, date, start_time, end_time, unit, street_address, city, post_code, state, branch_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, description, date, start_time, end_time, unit, street_address, city, post_code, state, branch_id], (err, result) => {
    //Error check
    if (err) {
      console.error(err);
      return res.status(500).send('Error adding event');
    }
    //If sucessful, send back the results with status code 200
    res.status(200).send('Event added');
  });
});

/*Route to handle GET request to get the list of all the members in the database
The list of members is retreived based on the manager's session id */
router.get('/displayMembers', function (req, res) {
  //Retrieve manager's ID
  const managerId = req.session.userId;

  //Sql query to retrieve the necessary details.
  //Join with volunteer and manager tables to retrieve only the members in the same branch
  //as the current manager
  const query = `
  SELECT u.first_name, u.last_name, u.user_id
  FROM user u
  JOIN volunteer v ON u.user_id = v.user_id
  JOIN manager m ON v.branch_id = m.branch_id
  WHERE m.user_id = ? AND u.user_role = 'VOLUNTEER'
`;

  //Make the query
  db.query(query, [managerId], (err, result) => {
    // console.log(result);
    //Error check
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      res.sendStatus(500);
    }
    // console.log(result);
    //If sucessful, send back the results with status code 200
    res.status(200).send(result);
  });
});

/*Route to handle a POST request to retrieve list of members who have RSVP'd for a specific event*/
router.post('/RSVPList', function (req, res) {
  const { eventId } = req.body;

  //Query to retrieve the rsvp list
  const query = `
  SELECT u.user_id, u.first_name, u.last_name, u.email, u.contact_number
  FROM user u
  JOIN volunteer v ON u.user_id = v.user_id
  JOIN rsvp r ON r.volunteer_id =v.volunteer_id
  WHERE event_id = ?`;

  //Make the query to database
  db.query(query, [eventId], (err, results) => {
    //Error check
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
    //If sucessful, send back the results with status code 200
    res.status(200).json(results);
  });
});

/*Route to handle a POST request to delete a event from database*/
router.post('/deleteEvent', function (req, res) {
  const { eventId } = req.body;

  /*Make the deletion from the event table. As we set ON DELETE CASCADE for the related foreign key tables, we do not
  need to include queries to delete from those related tables*/
  db.query('DELETE FROM event WHERE event_id = ?', [eventId], (err, results) => {
    //Error check
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    //If sucessful, send back status code 200
    res.sendStatus(200);
  });
});

/*Route to handle a POST request to retrieve statistics for the landing page
Similar route done in admin.js but was not reused as the manager landing page include
statistics for numManagers; but in admin its numBranches*/
router.post('/statistics', function (req, res) {
  const { branchId } = req.body;
console.log(branchId);
  //Make queries to retrieve number of volunteers for the manager's branch
  db.query('SELECT COUNT(*) AS numVolunteers FROM volunteer WHERE branch_id = ?;', [branchId], (err, volunteerCount) => {
    //Error check
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      res.sendStatus(500);
      return;
    }
    //Make queries to retrieve number of managers for the manager's branch
    db.query('SELECT COUNT(*) AS numManagers FROM manager WHERE branch_id = ?', [branchId], (err, managerCount) => {
      //Error check
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        res.sendStatus(500);
        return;
      }

      //If sucessful, send back results with status code 200
      res.status(200).json({
        numVolunteers: volunteerCount[0].numVolunteers,
        numManagers: managerCount[0].numManagers,
      });
    });
  });
});

router.post('/retrieveEventInfo', function (req, res) {
  const { eventId } = req.body;
  db.query('SELECT * FROM event WHERE event_id = ?', [eventId], (err, results) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      res.sendStatus(500);
      return;
    }
    console.log(results[0]);
    res.status(200).json(results[0]);

  });
});

router.post('/updateEvent', function (req, res) {
  const { eventId, attributeToChange, newValue, unit, streetAddress, city, state, postcode } = req.body;
  console.log(newValue);
  console.log(attributeToChange);
  console.log(eventId);

  if (attributeToChange === 'eventAddress') {
    let param = [unit, streetAddress, city, state, postcode, eventId];
    db.query('UPDATE event SET unit =?, street_address=?,city=?,states=?,post_code=? WHERE event_id = ? ', param, (err, results) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  } else {
    let query = `UPDATE event SET ${attributeToChange} = ? WHERE event_id = ?`;
    db.query(query, [newValue, eventId], (err, results) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  }
});

/* API to store manager updates */
router.post('/postupdates', function (req, res) {
  // Accessing userid stored in session
  const userId = req.session.userId;
  if (userId) {
    console.log("User ID:", req.session.userId);
  }
  else {
    console.log("No user is currently logged in.");
  }

  // Retrieve branch id
  db.query('SELECT branch_id FROM manager WHERE user_id = ?', [userId], (branchIderr, result) => {
    if(branchIderr){
      res.status(500).json({ message: 'BranchID cannot be retrieved' });
      return;
    }

    // ... insert code to extract branch_id from the query result above...
    if (result.length === 0) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const branchId = result[0].branch_id;

    const { title, content, audience } = req.body;
    const sql_post_update = 'INSERT INTO post (title, content, audience, published_date, published_time, branch_id) VALUES (?, ?, ?, DATE(NOW()), TIME(NOW()), ?)';
    db.query(sql_post_update, [title, content, audience, branchId], (err, result) => {
      if(err){
        res.status(500).json({ message: 'Post update error' });
        return;
      }

      // Post updated successfully
      res.status(200).json({ message: 'Post success' });
    });
  });
});

/* API to send manager emails */
router.post('/sendemail', function (req, res) {

  // Accessing userid stored in session
  const userId = req.session.userId;
  if (userId) {
    //console.log("Manager User ID:", req.session.userId);
  }
  else {
    //console.log("No user is currently logged in.");
  }

  // Retrieve branch_id of manager
  db.query('SELECT branch_id FROM manager WHERE user_id = ?', [userId], (brancherr, branchResult) => {
    if(brancherr){
      res.status(500).json({ message: 'Error retrieving manager branch id' });
      return;
    }

    if (branchResult.length === 0) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    const branchId = branchResult[0].branch_id;
    console.log('branchId: ', branchId);

    // Retrieve email of manager
    db.query('SELECT email FROM user WHERE user_id = ?', [userId], (manageremailerr, managerEmailResult) => {
      if(manageremailerr){
        res.status(500).json({ message: 'Error retrieving manager event' });
        return;
      }

      if (managerEmailResult.length === 0) {
        return res.status(404).json({ message: 'Manager email not found' });
      }

      const managerEmail = managerEmailResult[0].email;

      // Retrieve emails for volunteers who subscribed to notification
      const sql_retrieve_email = 'SELECT email FROM user WHERE user_id IN (SELECT volunteer.user_id FROM volunteer JOIN notification_subscription ON volunteer.volunteer_id = notification_subscription.volunteer_id WHERE volunteer.branch_id = ? AND notification_subscription.receive_event = TRUE);';
      db.query(sql_retrieve_email, [branchId], (volunteeremailerr, volunteerEmails) => {
        if(volunteeremailerr){
          res.status(500).json({ message: 'Error retrieving volunteer emails' });
          return;
        }

        const emails = volunteerEmails.map(v => v.email);
        const{ subject, body } = req.body;

        const mailOptions = {
          from: managerEmail,
          to: emails.join(', '),
          subject: subject,
          text: body
        };

        // Send emails to list of subscribed volunteers
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email', error: error });
          }
          res.json({ message: 'Email sent', messageId: info.messageId });
        });

      });
    });
  });
});

module.exports = router;