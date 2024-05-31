// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code
const PORT = 28997;

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector');

const path = require('path');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public'))); // The express.static middleware serves static files from the specified directory

/*
    ROUTES
*/

app.get('/', function(req, res) {
    let query1;

    if (req.query.alcoholName === undefined) {
        query1 = "SELECT * FROM Alcohols;";
    }

    else {
        query1 = `SELECT * FROM Alcohols WHERE alcoholName LIKE "%${req.query.alcoholName}%"`
    }

    // run query
    db.pool.query(query1, function(error, rows, fields) {
        let alcohols = rows;
        return res.render('index', {data: alcohols});
    })
})

/*
    ALCOHOL ROUTES
*/
// DISPLAY ALCOHOL PAGE
app.get('/alcohols', function(req, res)
{
    let query1;

    if (req.query.alcoholName === undefined) {
        query1 = "SELECT * FROM Alcohols;";
    }

    else {
        query1 = `SELECT * FROM Alcohols WHERE alcoholName LIKE "%${req.query.alcoholName}%"`
    }

    // run query
    db.pool.query(query1, function(error, rows, fields) {
        let alcohols = rows;
        return res.render('alcohols', {data: alcohols});
    })
});

// ADD ALCOHOL
app.post('/add-alcohol-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // Create the query and run it on the database
    let query1 = `INSERT INTO Alcohols (alcoholName, alcoholType, alcoholPercentage, wholesalePrice, alcoholVolume, inventory) VALUES (?, ?, ?, ?, ?, ?)`;
    db.pool.query(query1, [data.alcoholName, data.alcoholType, data.alcoholPercentage, data.wholesalePrice, data.alcoholVolume, data.inventory], function(error, rows, fields){
        if (error) {
            console.log('Could not add alcohol');
            res.sendStatus(400);
        } else {
            res.redirect('/alcohols');
        }
    });
});

// ALCOHOL DELETION
app.delete('/delete-alcohol/:alcoholID', function(req,res,next){
    let deleteAlcohol = `DELETE FROM Alcohols WHERE alcoholID = ?`;
          db.pool.query(deleteAlcohol, [req.params.alcoholID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else {
                res.sendStatus(204);
            }
    })
});

// ALCOHOL UPDATE
app.put('/put-alcohol-ajax', function(req,res,next){  
    console.log("Hit the route");                                 
    let data = req.body;
  
    let alcoholType = data.alcoholType;
    let alcoholName = data.alcoholName;
  
    queryUpdateAlcohol = `UPDATE Alcohols SET alcoholType = ? WHERE Alcohols.alcoholID = ?`;
    selectAlcohol = `SELECT * FROM Alcohols WHERE alcoholID = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateAlcohol, [alcoholType, alcoholName], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectAlcohol, [alcoholType], function(error, rows, fields) {
          
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});
/*
    EMPLOYEE ROUTES
*/
// DISPLAY EMPLOYEE PAGE
app.get('/employees', function(req, res)
{
        let query1 = "SELECT * FROM Employees;";
    db.pool.query(query1, function(error, results){
        if (error) {
        res.status(500).send('Database error: ' + error.message);
        } else {
        res.render('employees', { data: results });
        }
    });
});
// ADD EMPLOYEE
app.post('/add-employee-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Employees (firstName, lastName, startDate, employeeRole) VALUES (?, ?, ?, ?)`;
    db.pool.query(query1, [data.firstName, data.lastName, data.startDate, data.employeeRole], function(error, rows, fields){
        if (error) {
            console.log('Could not add employee');
            res.sendStatus(400);
        } else {
            res.redirect('/employees');
        }
    });
});
// DELETE EMPLOYEE
app.delete('/delete-employee/:employeeID', function(req,res,next){
    let deleteEmployee = `DELETE FROM Employees WHERE employeeID = ?`;

          db.pool.query(deleteEmployee, [req.params.employeeID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else {
                res.sendStatus(204);
            }
    })
});
// UPDATE EMPLOYEE
app.put('/update-employee-form', function(req,res,next){                                   
    let data = req.body;
  
    let employeeRole = data.empolyeeRole;
    let employeeID = data.employeeID;
  
    queryUpdateEmployee = `UPDATE Employees SET employeeRole = ? WHERE Employees.employeeID = ?`;
  
          // Run the 1st query
          db.pool.query(queryUpdateEmployee, [employeeRole, employeeID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              console.log("unable to update employee");
              res.sendStatus(400);
              }
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                res.send(rows);
                
              }
  })});
/*
    WHOLESALER ROUTES
*/
// DISPLAY WHOLESALER PAGE
app.get('/wholesalers', function(req, res)
{
        let query1 = "SELECT * FROM Wholesalers;";
    db.pool.query(query1, function(error, results){
        if (error) {
        res.status(500).send('Database error: ' + error.message);
        } else {
        res.render('wholesalers', { data: results });
        }
    });
});

// ADD WHOLESALER
app.post('/add-wholesaler-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Wholesalers (name, address, email, phone, contactName) VALUES (?, ?, ?, ?, ?)`;
    db.pool.query(query1, [data.name, data.address, data.email, data.phone, data.contactName], function(error, rows, fields){

        if (error) {

            console.log('Could not add wholesaler');
            res.sendStatus(400);

        } else {

            res.redirect('/wholesalers');

        }

    });

});
// DELETE WHOLESALER
app.delete('/delete-wholesaler/:wholesalerID', function(req,res,next){
    let deleteWholesaler = `DELETE FROM Wholesalers WHERE wholesalerID = ?`;

          db.pool.query(deleteWholesaler, [req.params.wholesalerID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else {
                res.sendStatus(204);
            }
    })
});

// UPDATES WHOLESALER
app.put('/update-wholesaler-form', function(req,res,next){
    console.log("you're closer");
    let data = req.body;

    let wholesalerID = data.wholesalerID;
    let address = data.address;
    let email = data.email;
    let phone = data.phone;
    let contactName = data.contactName

    let queryUpdateWholesaler = `UPDATE Wholesalers SET address = ?, email = ?, phone = ?, contactName = ? WHERE Wholesalers.wholesalerID = ?`;

          db.pool.query(queryUpdateWholesaler, [address, email, phone, contactName, wholesalerID], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                let selectQuery = `SELECT * FROM Wholesalers WHERE wholesalerID = ?`;
                db.pool.query(selectQuery, [wholesalerID], function(error, rows, fields) {

                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});
/*
   PURCHASES ROUTES
*/
// DISPLAY PURCHASES PAGE
app.get('/purchases', function(req, res)
{
    let query1 = `SELECT * FROM Purchases;`;
    db.pool.query(query1, function(error, results){
        if (error) {
        res.status(500).send('Database error: ' + error.message);
        } else {
        res.render('purchases', { data: results });
        }
    });
});
// ADD PURCHASE
app.post('/add-purchase-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let wholesalerID = parseInt(data.wholesalerID);
    let employeeID = parseInt(data.employeeID);

    addPurchaseQuery = `INSERT INTO Purchases (wholesalerID, employeeID, paid, deliveryDate, delivered) VALUES (?, ?, ?, ?, ?)`;
    db.pool.query(addPurchaseQuery, [wholesalerID, employeeID, data.paid, data.deliveryDate, data.delivered], function(error, rows, fields){
        if (error) {
            console.log('Could not add purchase');
            res.sendStatus(400);
        } else {
            res.redirect('/purchases');
        }
    });
});
// DELETE PURCHASE
app.delete('/delete-purchase/:purchaseID', function(req,res,next){
    let deletePurchase = `DELETE FROM Purchases WHERE purchaseID = ?`;

          db.pool.query(deletePurchase, [req.params.purchaseID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else {
                res.sendStatus(204);
            }
    })
});
/*
    ALCOHOL PURCHASES ROUTES
*/
// DISPLAY ALCOHOL PURCHASES PAGE
app.get('/alcohol-purchases', function(req, res)
{
    let query1 = "SELECT * FROM AlcoholPurchases;";
    db.pool.query(query1, function(error, results){
        if (error) {
        res.status(500).send('Database error: ' + error.message);
        } else {
        res.render('alcohol-purchases', { data: results });
        }
    });
});
// ADD ALCOHOL PURCHASE
app.post('/add-alcohol-purchase-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO AlcoholPurchases (purchaseID, alcoholID, quantityPurchased, lineCost) VALUES (?, ?, ?, ?)`;
    db.pool.query(query1, [data.purchaseID, data.alcoholID, data.quantityPurchased, data.lineCost], function(error, rows, fields){

        if (error) {

            console.log('Could not add purchase');
            res.sendStatus(400);

        } else {

            res.redirect('/alcohol-purchases');

        }

    });

});
// DELETE ALCOHOL PURCHASE
app.delete('/delete-alcohol-purchase/:alcoholPurchaseID', function(req,res,next){
    let deleteAlcoholPurchase = `DELETE FROM AlcoholPurchases WHERE alcoholPurchaseID = ?`;

          db.pool.query(deleteAlcoholPurchase, [req.params.alcoholPurchaseID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else {
                res.sendStatus(204);
            }
    })
});


/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
