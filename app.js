// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code
const PORT = 3000;

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
    console.log("Hit alcohol route")
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
    const buildUpdateQuery = (data) => {
        let queryString = `UPDATE Alcohols SET`;
        const queryVariableArray = [];
        if(data.alcoholType) {
            queryString += ` alcoholType = ?,`
            queryVariableArray.push(data.alcoholType)
        }
        if(data.alcoholPercentage){
            queryString += ` alcoholPercentage = ?,`
            queryVariableArray.push(parseFloat(data.alcoholPercentage))
        }
        if(data.alcoholPrice){
            queryString += ` wholesalePrice = ?,`
            queryVariableArray.push(parseFloat(data.alcoholPrice))
        }
        if(data.alcoholVolume){
            queryString += ` alcoholVolume = ?,`
            queryVariableArray.push(parseFloat(data.alcoholVolume))
        }
        if(data.inventory){
            queryString += ` inventory = ?,`
            queryVariableArray.push(parseInt(data.inventory))
        }
        queryString = queryString.substring(0, queryString.length-1); // removing final comma because otherwise SQL will not run
        queryString += ` WHERE Alcohols.alcoholID = ?`
        queryVariableArray.push(parseInt(data.alcoholName))
        return {
            queryString,
            queryVariableArray
        }
    }

    let data = req.body;
    console.log("APP DATA = " + JSON.stringify(data));
    const queryObject = buildUpdateQuery(data);
    let selectAlcohol = `SELECT * FROM Alcohols WHERE alcoholID = ?`
    
          // Run the 1st query
          db.pool.query(queryObject.queryString, queryObject.queryVariableArray, function(error, rows, fields){
          //db.pool.query(queryUpdateAlcohol, [data.alcoholType, parseFloat(data.alcoholPercentage), parseFloat(data.alcoholPrice), parseFloat(data.alcoholVolume), parseInt(data.inventory), parseInt(data.alcoholName)], function(error, rows, fields){

              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the alcohol's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectAlcohol, [data.alcoholName], function(error, rows, fields) {
          
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
    let employeeDisplayQuery = "SELECT * FROM Employees ORDER BY employeeID ASC;";
    db.pool.query(employeeDisplayQuery, function(error, results){
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

    const buildUpdateQuery = (data) => {
        let queryString = `UPDATE Wholesalers SET`;
        const queryVariableArray = [];
        if(data.address) {
            queryString += ` address = ?,`
            queryVariableArray.push(data.address)
        }
        if(data.email){
            queryString += ` email = ?,`
            queryVariableArray.push(data.email)
        }
        if(data.phone){
            queryString += ` phone = ?,`
            queryVariableArray.push(data.phone)
        }
        if(data.contactName){
            queryString += ` contactName = ?,`
            queryVariableArray.push(data.contactName)
        }
        queryString = queryString.substring(0, queryString.length-1); // removing final comma because otherwise SQL will not run
        queryString += ` WHERE wholesalerID = ?`
        queryVariableArray.push(parseInt(data.wholesalerID))
        return {
            queryString,
            queryVariableArray
        }
    }   

        let wholesalerUpdateQuery = buildUpdateQuery(data);
        console.log("wholesale query" + wholesalerUpdateQuery.queryString);

          db.pool.query(wholesalerUpdateQuery.queryString, wholesalerUpdateQuery.queryVariableArray, function(error, rows, fields){
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
    let getWholesaleInfoQuery = `SELECT * FROM Wholesalers`;
    let getEmployeeInfoQuery = `SELECT * FROM Employees`;

    let getAllInfoJoined = `SELECT * FROM Purchases 
    INNER JOIN Wholesalers ON Purchases.wholesalerID = Wholesalers.wholesalerID 
    LEFT JOIN Employees ON Purchases.employeeID = Employees.employeeID
    ORDER BY purchaseID ASC`;
    
    
    //Below does multiple queries instead of a big join. Not sure if this makes the most sense or not!
    db.pool.query(getAllInfoJoined, function(error, results){
        if (error) {
        res.status(500).send('Database error: ' + error.message);
        } else {
            //Get individualized data for wholesaler
            db.pool.query(getWholesaleInfoQuery, function(error, wholesalerResults){
                if (error) {
                    res.status(500).send('Error with wholesaler query');
                } else {
                    db.pool.query(getEmployeeInfoQuery, function(error, employeeResults){
                        if (error) {
                            res.status(500).send('Error with employee query');
                        } else {
                            return res.render('purchases', {
                                data: results,
                                wholesalerData: wholesalerResults,
                                employeeData: employeeResults 
                            });
                        }
                    })
                }
            })
        }
    });
});

// ADD PURCHASE
app.post('/add-purchase-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let wholesalerID = parseInt(data.wholesalerID);
    let employeeID = parseInt(data.employeeID);
    let date = new Date(data.deliveryDate);
    let paidValue = '0';
    let deliveredValue = '0';
    console.log(data)
    console.log(paidValue);
    if (data.paid != null) {
        paidValue = 1;
    }

    console.log(data.delivered);
    if (data.delivered != null) {
        deliveredValue = 1;
    }
    addPurchaseQuery = `INSERT INTO Purchases (Purchases.wholesalerID, Purchases.employeeID, paid, deliveryDate, delivered) VALUES (?, ?, ?, ?, ?)`;
    console.log(deliveredValue)
    db.pool.query(addPurchaseQuery, [wholesalerID, employeeID, paidValue, date, deliveredValue], function(error, rows, fields){
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
app.put('/update-purchase-form', function(req,res,next){
    let data = req.body;
    let purchaseID = parseInt(data.purchaseID);

    const buildUpdateQuery = (data) => {
        let queryString = `UPDATE Purchases SET`;
        const queryVariableArray = [];
        if(data.wholesaler) {
            queryString += ` wholesalerID = ?,`
            queryVariableArray.push(data.wholesaler)
        }
        if(data.employee){
            queryString += ` employeeID = ?,`
            if (data.employee == "Null"){
                queryVariableArray.push(null);
            } else {
                queryVariableArray.push(parseInt(data.employee));
            }
        }
        if(data.paid){
            queryString += ` paid = ?,`
            queryVariableArray.push(data.paid)
        }
        if(data.deliveryDate){
            queryString += ` deliveryDate = ?,`
            queryVariableArray.push(data.deliveryDate)
        }
        if(data.delivered){
            queryString += ` delivered = ?,`
            queryVariableArray.push(data.delivered);
        }
        queryString = queryString.substring(0, queryString.length-1); // removing final comma because otherwise SQL will not run
        queryString += ` WHERE purchaseID = ?`
        queryVariableArray.push(parseInt(data.purchaseID))
        return {
            queryString,
            queryVariableArray
        }
    }   

        let purchaseUpdateQuery = buildUpdateQuery(data);
        console.log(purchaseUpdateQuery);
          db.pool.query(purchaseUpdateQuery.queryString, purchaseUpdateQuery.queryVariableArray, function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                let selectQuery = `SELECT * FROM Purchases WHERE purchaseID = ?`;
                db.pool.query(selectQuery, purchaseID, function(error, rows, fields) {

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
    ALCOHOL PURCHASES ROUTES
*/
// DISPLAY ALCOHOL PURCHASES PAGE
app.get('/alcohol-purchases', function(req, res)
{
    console.log("Hit alcoholPurchases display route")
    let getAlcoholInfoQuery = `SELECT * FROM Alcohols`;
    let getPurchaseInfoQuery = `SELECT * FROM Purchases`;

    let getAllInfoJoined = `SELECT * FROM AlcoholPurchases 
    INNER JOIN Purchases ON AlcoholPurchases.purchaseID = Purchases.purchaseID 
    INNER JOIN Alcohols ON AlcoholPurchases.alcoholID = Alcohols.alcoholID
    ORDER BY AlcoholPurchases.alcoholPurchaseID ASC`;
    
    console.log(getAllInfoJoined);
    
    //Below does a big join and then two smaller queries to isolate data from non-parent tables
    db.pool.query(getAllInfoJoined, function(error, results){
        if (error) {
        res.status(500).send('Database error: ' + error.message);
        } else {
            //Get individualized data for wholesalers and employees
            db.pool.query(getAlcoholInfoQuery, function(error, alcoholResults){
                if (error) {
                    res.status(500).send('Error with alcohols query');
                } else {
                    db.pool.query(getPurchaseInfoQuery, function(error, purchaseResults){
                        if (error) {
                            res.status(500).send('Error with purchases query');
                        } else {
                            return res.render('alcohol-purchases', {
                                data: results,
                                alcoholData: alcoholResults,
                                purchaseData: purchaseResults 
                            });
                        }
                    })
                }
            })
        }
    });
});
// ADD ALCOHOL PURCHASE
app.post('/add-alcohol-purchase-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    console.log(data)
    
    let unitCostQuery = `SELECT wholesalePrice FROM Alcohols WHERE Alcohols.alcoholID = ?`;
    let query1 = `INSERT INTO AlcoholPurchases (purchaseID, alcoholID, quantityPurchased, lineCost) VALUES (?, ?, ?, ?)`;
    db.pool.query(unitCostQuery, data.alcoholID, function(error, unitCost){
        if (error){
            console.log(error);
            res.sendStatus(400);
        } else {
            let sum = parseInt(unitCost[0].wholesalePrice) * parseInt(data.quantityPurchased);
            db.pool.query(query1, [parseInt(data.purchaseID), parseInt(data.alcoholID), parseInt(data.quantityPurchased), sum], function(error, rows, fields){
        
                if (error) {
        
                    console.log('Could not add purchase');
                    res.sendStatus(400);
        
                } else {
        
                    res.redirect('/alcohol-purchases');
        
                }
        })
    }
})})

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
