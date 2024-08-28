/* eslint-disable no-console */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: '',
  password: '',
  database: 'voluntree'
});

/*For password hashing*/
const bcrypt = require('bcrypt');
const saltRounds = 10;

connection.connect((err) => {
  if (err) throw err;
});

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/*Route to handle a POST request to add admin*/
router.post('/addAdmin', function (req, res) {
  const { firstName, lastName, email, dateOfBirth, contactNumber, userRole, userPassword } = req.body;

  bcrypt.hash(userPassword, saltRounds, function (err, hash) {
    //Error checking
    if (err) {
      console.error('Error here when hashing passwords');
      console.error(err);
      res.sendStatus(500);
      return;
    }
    //Insert into user table
    connection.query('INSERT INTO user (first_name, last_name, email, date_of_birth, contact_number, user_role) VALUES (?,?,?,?,?,?)', [firstName, lastName, email, dateOfBirth, contactNumber, userRole], (err, results) => {
      //Error checking
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        res.sendStatus(500);
        return;
      }
      //Store new admin's id
      const userId = results.insertId;

      //Insert hashed password into email_auth table
      connection.query('INSERT INTO email_auth (user_id, password_hash) VALUES (?, ?)', [userId, hash], (err) => {
        if (err) {
          console.error('Error when inserting into email_auth table');
          console.error(err);
          res.sendStatus(500);
          return;
        }
        //When done, redirect to manage users page
        res.redirect('/manageUsers.html');
      });
    });
  });
});

/*Route to hanole POST requeat to add branch to database */
router.post('/addBranch', function (req, res) {
  const { branchName, branchDescription, branchEmail, branchContact, branchUnit, branchStreetAddress, branchCity, branchPostcode, branchState } = req.body;
  connection.query('INSERT INTO branch (branch_name, descriptions, email, phone_number, unit, street_address, city, post_code, states) VALUES(?,?,?,?,?,?,?,?,?)', [branchName, branchDescription, branchEmail, branchContact, branchUnit, branchStreetAddress, branchCity, branchPostcode, branchState], (err, results) => {
    //Error check
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      res.sendStatus(500);
      return;
    }
    //Send back status code of 200 (success)
    res.sendStatus(200);
  });
});

/*Route to handle a POST request to edit branch details*/
router.post('/editBranch', function (req, res) {
  const { branchID, attributeToChange, newValue, unit, streetAddress, city, state, postcode } = req.body;
  // console.log(attributeToChange);
  // console.log(newValue);

  //Depending on the attribute to change, the query is different
  if (attributeToChange === 'address') {
    //If address is chosen, the parameters are different
    //We need to insert the unit, address, state, postcode for the new full address
    let param = [unit, streetAddress, city, state, postcode, branchID];
    // console.log(unit, streetAddress, city, state, postcode, branchID);
    connection.query('UPDATE branch SET unit =?, street_address=?,city=?,states=?,post_code=? WHERE branch_id = ? ', param, (err, results) => {
      //Error check
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }
      //Send status code of 200 (sucess)
      res.sendStatus(200);
    });
  }
  //If any other attribute (including branch name, email and contact number etc)
  else {
    //Same query can be reused by just substituting the attributeToChange.
    /*This is because in the POST request made, the attributeToChange is set to the attribute name as found in the mysql file.
    We do not need to manually check and input one by one. The new values are passed with the same name newValue for reusability purposes */
    connection.query(`UPDATE branch SET ${attributeToChange} = ? WHERE branch_id = ?`, [newValue, branchID], (err, results) => {
      //Error check
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        res.sendStatus(500);
      }
    });
    res.sendStatus(200);
  }
});

/*Route to handle a GET request to get list of all branches.
Necessary to display branch details such as name etc*/
router.get('/listBranch', function (req, res) {
  //Make a query to retrieve the necessary branch details from the database
  connection.query('SELECT branch_id, branch_name, phone_number FROM branch', (err, results) => {
    //Error check
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      res.sendStatus(500);
      return;
    }
    //If sucessful, send back the results with status code 200
    res.status(200).json(results);
  });
});

/*For admin landing page. Route handles a GET request to display statistics regarding number of volunteers and branches */
router.get('/statistics', function (req, res) {
  connection.query('SELECT COUNT(*) AS numVolunteers FROM volunteer;', (err, volunteerCount) => {
    //Error check
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      res.sendStatus(500);
      return;
    }
    connection.query('SELECT COUNT(*) AS numBranches FROM branch;', (err, branchesCount) => {
      //Error check
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        res.sendStatus(500);
        return;
      }
      //If successful,, send the results with status code 200
      res.status(200).json({
        numVolunteers: volunteerCount[0].numVolunteers,
        numBranches: branchesCount[0].numBranches
      });
    });
  });
});

/*Route to handle a POST request to retrieve details for a specific branch*/
router.post('/retrieveBranchDetails', function (req, res) {
  const { branchId } = req.body;
  //Make a sql query to retrieve the branch details for the branchId passed
  connection.query('SELECT * FROM branch WHERE branch_id = ?', [branchId], (err, results) => {
    //Error check
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      res.sendStatus(500);
      return;
    }
    // console.log(results[0]);

    //If sucessful, send back the results with status code 200
    res.status(200).json(results[0]);
  });
});
module.exports = router;