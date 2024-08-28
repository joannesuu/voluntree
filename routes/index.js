/* eslint-disable no-console */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

// Establish database connection with voluntree.sql
const db = mysql.createConnection({
  host: 'localhost',
  user: '',
  password: '',
  database: 'voluntree'
});

db.connect((err) => {
  if (err) throw err;
  // eslint-disable-next-line
  console.log('Connected to the database');
});

// Handle password hashing, salting and storage
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// Handle branch details retrieval for LOCATION tab in Landing Page
router.get('/branchdetails', (req, res) => {
  const sql_branches = 'SELECT branch_id, branch_name, unit, street_address, city, post_code, states, email, phone_number FROM branch';
  db.query(sql_branches, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Failed to retrieve branch information' });
    }
    res.status(200).json(results); // Respond with all details
  });
});

// API to retrive list of branches from database
router.get('/getbranches', (req, res) => {
  const sql_get_branche_id_name = 'SELECT branch_id, branch_name FROM branch';
  db.query(sql_get_branche_id_name, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching branch data');
      return;
    }
    res.status(200).json(results);
  });
});

// Endpoint to handle signup
router.post('/signup', (req, res) => {

  // Read form inputs from request body
  const { firstName, lastName, email, password, phone, dateOfBirth, role, branchId } = req.body;

  // Hash and salt password using bcrypt with callback
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      res.status(500).json({ message: 'Error hashing password' });
      return;
    }
    // Verify email
    const sql_check_email = 'SELECT * FROM user WHERE email = ?';
    db.query(sql_check_email, [email], (err, result) => {
      if (err) {
        res.status(500).json({ message: 'Database error/nPlease try again later' });
        return;
      }

      if (result.length > 0) {
        res.status(409).json({ message: 'Account already exists' }); // User exists, send alert message
        return;
      }

      // Store new user
      const sql_insert_user = 'INSERT INTO user (first_name, last_name, email, contact_number, date_of_birth, user_role) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(sql_insert_user, [firstName, lastName, email, phone, dateOfBirth, role], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Database error/unable to insert new user' });
          return;
        }
        const userId = result.insertId;

        // Store into respective role table
        const sql_update = role === 'VOLUNTEER' ? 'UPDATE volunteer SET branch_id = ? WHERE user_id = ?' : 'UPDATE manager SET branch_id = ? WHERE user_id = ?';
        db.query(sql_update, [branchId, userId], (err, results) => {
          if (err) {
            res.status(500).json({ message: 'Database error/could not update table' });
            return;
          }
        });

        // Store hashed password into 'email_auth' table
        const sql_store_password = 'INSERT INTO email_auth (user_id, password_hash) VALUES (?, ?)';
        db.query(sql_store_password, [userId, hashedPassword], (err, result) => {
          if (err) {
            res.status(500).json({ message: 'Password error' });
            return;
          }
        });

        // User registered successfully
        res.status(200).json({ message: 'Signup successful!' });
      });
    });
  });
});

// Authenticate function to check username and password
const authenticate = (email, password, role, callback) => {
  // Find email in TABLE user
  const sql_email_query = 'SELECT user_id FROM user WHERE email=? AND user_role=?';
  db.query(sql_email_query, [email, role], (err, emailResult) => {
    if (err) {
      return callback(500, { message: 'Database error, email could not be retrieved' }); // Server error
    }

    if (emailResult.length === 0) {
      return callback(409, { message: 'Account does not exist, please sign-up' }); // Email not found, return conflicting status
    }

    // User exists, retrieve password from TABLE email_auth
    const sql_password_query = 'SELECT password_hash FROM email_auth WHERE user_id=?';
    db.query(sql_password_query, [emailResult[0].user_id], (err, authResult) => {
      if (err) {
        return callback(500, { message: 'Database error, password could not be verified' }); // Server error
      }

      if (authResult.length === 0) {
        return callback(404, { message: 'No password set for this user, please contact admin' }); // No password hash found
      }

      // Password hash exists, compare and return status
      bcrypt.compare(password, authResult[0].password_hash, (err, isMatch) => {
        if (err) {
          return callback(500, { message: 'Error checking password' });
        }

        if (!isMatch) {
          return callback(401, { message: 'Password does not match' });
        }

        return callback(200, emailResult[0].user_id);
      });
    });
  });
};

// Handle login request from Landing Page
router.post('/login', (req, res) => {
  const { email, password, role } = req.body;
  authenticate(email, password, role, (statusCode, message) => {

    // Passed authentication
    if (statusCode === 200) {
      req.session.userId = message;
      req.session.isAuthenticated = true;
      res.status(200).json({ message: 'Log-in successful' });
    }

    // Failed authentication
    else {
      res.status(statusCode).json(message);
    }
  });
});

// Handle logout request from All Interfaces
router.post('/logout', (req, res) => {
  if (!req.session.userId) {
    return res.sendStatus(404);
  }

  // Remove cookies
  req.session.destroy(err => {
      if(err){
        res.status(500).json({ message: 'Failed to log out' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Log out successful', status: 200 });
  });
});

module.exports = router;