/* eslint-disable no-console */
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var managerRouter = require('./routes/manager');

var session = require('express-session');
var app = express();
var mysql = require('mysql');

/* GET home page. */
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

// const { isAuthenticated, isAdmin } = require('./middleware/auth');

app.use(session({
  secret: 'your_secret_key',  // Secret key to sign the session ID cookie
  resave: false,              // Avoid resaving sessions that haven't changed
  saveUninitialized: false,   // Don't save uninitialized sessions
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } // Secure cookies, HTTP only, and set expiry
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

//this must come after app.use express static
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/manager', managerRouter);

//MANAGER--------------------------------------------------------------------------
//setting up a route to retrieve data from sql regarding manager
app.get('/api/user', (req, res) => {
  const query = `
  SELECT u.user_id, u.first_name, u.last_name, u.email, u.contact_number, m.branch_id
  FROM user u
  JOIN manager m ON u.user_id = m.user_id
  WHERE u.user_id = ? AND u.user_role = 'MANAGER'
`;

  const userId = req.session.userId;
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'An error occurred.', error: err });
    }
    if (results.length > 0) {
    // console.log(results[0]);
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: 'User not present in database' });
    }
  });
});

app.get('/api/managerBranchId', (req, res) => {
  const query = `
  SELECT u.user_id, u.first_name, u.last_name, u.email, u.contact_number, m.branch_id
  FROM user u
  JOIN manager m ON u.user_id = m.user_id
  WHERE u.user_id = ? AND u.user_role = 'MANAGER'
`;

  const userId = req.session.userId;
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'An error occurred.', error: err });
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'User not present in database' });
    }
  });
});


//ADMIN--------------------------------------------------------------------------
app.get('/api/userAdmin', (req, res) => {

  // console.log(userId);
  const query = `SELECT user_id, first_name, last_name, email, contact_number FROM user WHERE user_id = ?`;

  const userId = req.session.userId;
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'An error occurred.', error: err });
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'User not present in database' });
    }
  });

});

module.exports = app;