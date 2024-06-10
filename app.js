// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code
const PORT = 3002;

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars); // Import handlebars moment

// create handlebars helper to show bool as yes/no
Handlebars.registerHelper("ifZero", function(value, options) {
    if (value !== 0) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

// Database connection
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

// HOME PAGE ROUTE
app.get('/', function(req, res) {
    res.render('index');
})

/*
    ALCOHOL ROUTES
*/
// DISPLAY ALCOHOL PAGE
app.get('/alcohols', function(req, res)
{
    // Declare a query. If the user is using the search functionality, run 1 version of the query, else, just
    // display each alcohol record as it appears in the database
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
    // Capture the incoming data and insert into Alcohols Table
    let data = req.body;
    // Create the query and run it on the database
    let query1 = `INSERT INTO Alcohols (alcoholName, alcoholType, alcoholPercentage, wholesalePrice, alcoholVolume, inventory) VALUES (?, ?, ?, ?, ?, ?)`;
    db.pool.query(query1, [data.alcoholName, data.alcoholType, data.alcoholPercentage, data.wholesalePrice, data.alcoholVolume, data.inventory], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/alcohols');
        }
    });
});

// ALCOHOL DELETION
app.delete('/delete-alcohol/:alcoholID', function(req,res,next){
    // Deletes an alcohol based on an ID entered from the Alcohols table
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
    // Updates an alcohol record in the alcohols table

    const buildUpdateQuery = (data) => {
        // This function makes it so that the user need only enter the information they'd like to change in a record.
        // This is done via building an alcohol update query based on information entered in the Update section of the form
        let queryString = `UPDATE Alcohols SET`;
        const queryVariableArray = [];

        // If an element is entered, add the corresponding query portion to the query string and push var to query array
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

        // Removing final comma because otherwise SQL syntax is wrong
        queryString = queryString.substring(0, queryString.length-1); 
        queryString += ` WHERE Alcohols.alcoholID = ?`
        queryVariableArray.push(parseInt(data.alcoholName))

        // Output is an object that contains query string and the corresponding query variables
        return {
            queryString,
            queryVariableArray
        }
    }

    let data = req.body;
    const queryObject = buildUpdateQuery(data);
    let selectAlcohol = `SELECT * FROM Alcohols WHERE alcoholID = ?`
    
          // Run the update query
          db.pool.query(queryObject.queryString, queryObject.queryVariableArray, function(error, rows, fields){
          

              if (error) {
  
              // Log the error to the terminal, if it occurs
              console.log(error);
              res.sendStatus(400);
              }
  
              // If no error, run select query to display update
              else
              {
                  // Run the select query to re-display updated table. Send data to update_alcohol.js
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

    // Run query to display employees in table
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
    
    let data = req.body;    // Capture incoming data in variable

    // Create the insert query and run 
    let addEmployeeQuery = `INSERT INTO Employees (firstName, lastName, startDate, employeeRole) VALUES (?, ?, ?, ?)`;
    db.pool.query(addEmployeeQuery, [data.firstName, data.lastName, data.startDate, data.employeeRole], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/employees');
        }
    });
});

// DELETE EMPLOYEE
app.delete('/delete-employee/:employeeID', function(req,res,next){

    // Create delete query and run
    let deleteEmployee = `DELETE FROM Employees WHERE employeeID = ?`;
          db.pool.query(deleteEmployee, [req.params.employeeID], function(error, rows, fields){
            if (error) {
                console.log(error);     // If error occurs, log them and send error status
                res.sendStatus(400);
            }
            else {
                res.sendStatus(204);
            }
    })
});

// UPDATE EMPLOYEE
app.put('/update-employee-form', function(req,res,next){

    // Capture required data as variables
    let data = req.body; 
    let employeeRole = data.employeeRole;
    let employeeID = data.employeeID;

    // Create update query and run
    queryUpdateEmployee = `UPDATE Employees SET employeeRole = ? WHERE Employees.employeeID = ?`;
    let selectQueryEmployees = `SELECT * FROM Employees WHERE employeeID = ?`;
          db.pool.query(queryUpdateEmployee, [employeeRole, employeeID], function(error, rows, fields){
              if (error) {
              console.log(error);       
              res.sendStatus(400);
              }
              else {
                db.pool.query(selectQueryEmployees, data.employeeID, function(error, rows, fields) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.send(rows);
                    }

                })
                
              }
  })});

/*
    WHOLESALER ROUTES
*/

// DISPLAY WHOLESALER PAGE
app.get('/wholesalers', function(req, res)
{
    // Create and run select query for Wholesalers table. Send results to user
    let displayWholesalersQuery = "SELECT * FROM Wholesalers;";
    db.pool.query(displayWholesalersQuery, function(error, results){
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
    let addWholesalerQuery = `INSERT INTO Wholesalers (name, address, email, phone, contactName) VALUES (?, ?, ?, ?, ?)`;
    db.pool.query(addWholesalerQuery, [data.name, data.address, data.email, data.phone, data.contactName], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/wholesalers');
        }

    });
});

// DELETE WHOLESALER
app.delete('/delete-wholesaler/:wholesalerID', function(req,res,next){
    // Create and run delete query from Wholesalers table
    let deleteWholesaler = `DELETE FROM Wholesalers WHERE wholesalerID = ?`;
          db.pool.query(deleteWholesaler, [req.params.wholesalerID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
    })
});

// UPDATES WHOLESALER
app.put('/update-wholesaler-form', function(req,res,next){

    // Capture requisite data in variables
    let data = req.body;
    let wholesalerID = data.wholesalerID;

    // Build query string and query variable array
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

        // Run update query
        let wholesalerUpdateQuery = buildUpdateQuery(data);

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
    // Create Necessary queries
    let getWholesaleInfoQuery = `SELECT * FROM Wholesalers`;
    let getEmployeeInfoQuery = `SELECT * FROM Employees`;

    let getAllInfoJoined = `SELECT * FROM Purchases 
    INNER JOIN Wholesalers ON Purchases.wholesalerID = Wholesalers.wholesalerID 
    LEFT JOIN Employees ON Purchases.employeeID = Employees.employeeID
    ORDER BY purchaseID ASC`;
    
    // Need to calculate total cost from alcoholPurchases (line items) on any given purchase
    let purchaseIDQuery = `SELECT purchaseID FROM Purchases`;
    let totalCostQuery = `SELECT SUM(lineCost) FROM AlcoholPurchases WHERE purchaseID = ?`
    let updateLineCost = `UPDATE Purchases SET totalCost = ? WHERE purchaseID = ?`

    // Run queries
    db.pool.query(getAllInfoJoined, function(error, results){
        if (error) {
        res.status(500).send('Database error: ' + error.message);
        } else {
            //Get individualized data for wholesaler
            db.pool.query(getWholesaleInfoQuery, function(error, wholesalerResults){
                if (error) {
                    res.status(500).send('Error with wholesaler query');
                } else {
                    // Get individualized data for employee
                    db.pool.query(getEmployeeInfoQuery, function(error, employeeResults){
                        if (error) {
                            res.status(500).send('Error with employee query');
                        } else {
                            // Get each purchaseID present in the Purchases table
                            db.pool.query(purchaseIDQuery, function(error, purchaseIDRes){
                                if (error) {
                                    console.log(error);
                                    res.sendStatus(400);
                                } else {
                                    // For each purchaseID, calculate the total cost of the purchase by summing all line items that appear on that purchase order
                                    for (let i = 0; i < purchaseIDRes.length; i++) {
                                        let purchaseID = parseInt(purchaseIDRes[i].purchaseID);
                                        db.pool.query(totalCostQuery, purchaseID, function(error, newTotalRes){
                                            if (error) {
                                                console.log(error);
                                                res.sendStatus(400);
                                            } else {
                                                // Now update the total cost for each purchase
                                                let newTotal = newTotalRes[0]["SUM(lineCost)"];
                                                db.pool.query(updateLineCost, [newTotal, purchaseID], function(error){
                                                    if (error) {
                                                        console.log(error);
                                                        res.sendStatus(400);
                                                    }
                                                })
                                            }
                                        })

                                    }
                                    // Once finished with for-loop, render page with the results of the first 3 queries
                                    res.render('purchases', {
                                        data: results,
                                        wholesalerData: wholesalerResults,
                                        employeeData: employeeResults
                                         })
                                }
                            })
                        }
                    })
                }
            })
        }
    });
});


// ADD PURCHASE
app.post('/add-purchase-form', function(req, res) {
    // Capture the requisite data in variables
    let data = req.body;

    let wholesalerID = parseInt(data.wholesalerID);
    let employeeID = parseInt(data.employeeID);
    let date = new Date(data.deliveryDate);
    // Bool in SQL is either 0 or 1, default to 0
    let paidValue = '0';
    let deliveredValue = '0';
    
    // Convert bool vals to 1 if they are checked by user
    if (data.paid != null) {
        paidValue = 1;
    }

    if (data.delivered != null) {
        deliveredValue = 1;
    }
    // Declare and run query to insert Purchase record into Purchases table
    addPurchaseQuery = `INSERT INTO Purchases (Purchases.wholesalerID, Purchases.employeeID, paid, deliveryDate, delivered) VALUES (?, ?, ?, ?, ?)`;

    db.pool.query(addPurchaseQuery, [wholesalerID, employeeID, paidValue, date, deliveredValue], function(error, rows, fields){
        if (error) {
            console.log(error);
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

// UPDATE A PURCHASE
app.put('/update-purchase-form', function(req,res,next){
    let data = req.body;
    let purchaseID = parseInt(data.purchaseID);

    // Build query string and variable array
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
        queryVariableArray.push(purchaseID)
        return {
            queryString,
            queryVariableArray
        }
    }   

        let purchaseUpdateQuery = buildUpdateQuery(data);

        // Run query to update Purchases table
          db.pool.query(purchaseUpdateQuery.queryString, purchaseUpdateQuery.queryVariableArray, function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                let selectQuery = `SELECT * FROM Purchases`;
                db.pool.query(selectQuery, function(error, rows, fields) {

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
    let getAlcoholInfoQuery = `SELECT * FROM Alcohols`;
    let getPurchaseInfoQuery = `SELECT * FROM Purchases JOIN Wholesalers ON Purchases.wholesalerID = Wholesalers.wholesalerID`;

    let getAllInfoJoined = `SELECT * FROM AlcoholPurchases 
    INNER JOIN Purchases ON AlcoholPurchases.purchaseID = Purchases.purchaseID 
    INNER JOIN Alcohols ON AlcoholPurchases.alcoholID = Alcohols.alcoholID
    INNER JOIN Wholesalers ON Purchases.wholesalerID = Wholesalers.wholesalerID
    ORDER BY AlcoholPurchases.alcoholPurchaseID ASC`;
    
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
    // Capture requisite data and store in variables
    let data = req.body;
    let purchaseID = parseInt(data.purchaseID);
    let alcoholID = parseInt(data.alcoholID);
    let quantityPurchased = parseInt(data.quantityPurchased);

    // Declare queries
    let unitCostQuery = `SELECT wholesalePrice FROM Alcohols WHERE Alcohols.alcoholID = ?`;
    let addAlcoholPurchaseQuery = `INSERT INTO AlcoholPurchases (purchaseID, alcoholID, quantityPurchased, lineCost) VALUES (?, ?, ?, ?)`;
    let sumAlcoholPurchasesQuery = `SELECT SUM(lineCost) FROM AlcoholPurchases WHERE AlcoholPurchases.purchaseID = ?`
    let updatePurchasesTotalQuery = `UPDATE Purchases SET totalCost = ? WHERE purchaseID = ?`;

    // Run all queries necessary to add alcohol purchase
    db.pool.query(unitCostQuery, data.alcoholID, function(error, unitCost){
        // Get alcohol unit cost (wholesalePrice from Alcohols table)
        if (error){
            console.log(error);
            res.sendStatus(400);
        } else {
            // Calculate line cost and insert into alcoholPurchases along with entered data
            let sum = parseInt(unitCost[0].wholesalePrice) * parseInt(data.quantityPurchased);
            db.pool.query(addAlcoholPurchaseQuery, [purchaseID, alcoholID, quantityPurchased, sum], function(error, rows, fields){
        
                if (error) {
        
                    console.log(error);
                    res.sendStatus(400);
        
                } else {
                    // Now, get totalCost of all line items on same purchase, and update Purchases upon addition of new line item
                    db.pool.query(sumAlcoholPurchasesQuery, purchaseID, function(error, lineSum) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400)
                        } else {
                            let totalCost = lineSum[0]["SUM(lineCost)"];

                            db.pool.query(updatePurchasesTotalQuery, [totalCost, purchaseID], function(error, rows, fields) {
                                if (error) {
                                    console.log(error);
                                    res.sendStatus(400);
                                } else {
                                    res.redirect('/alcohol-purchases');
                                }
                            })
                        }
                    })
        
                }
        })
    }
})})

// DELETE ALCOHOL PURCHASE
app.delete('/delete-alcohol-purchase/:alcoholPurchaseID', function(req,res,next){
    // Capture necessary data in variable
    let alcoholPurchaseID = parseInt(req.params.alcoholPurchaseID);

    // Declare necessary queries
    let deleteAlcoholPurchase = `DELETE FROM AlcoholPurchases WHERE alcoholPurchaseID = ?`;
    let purchaseIDQuery = `SELECT AlcoholPurchases.purchaseID FROM AlcoholPurchases WHERE alcoholPurchaseID = ?`;
    let sumLineCost = `SELECT SUM(lineCost) FROM AlcoholPurchases WHERE AlcoholPurchases.purchaseID = ?`;
    let updatePurchases = `UPDATE Purchases SET totalCost = ? WHERE purchaseID = ?`;

        // Get the purchaseID First
          db.pool.query(purchaseIDQuery, alcoholPurchaseID, function(error, purchaseIDResult){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                // Store PurchaseID and delete alcohol purchase line item
                let purchaseID = purchaseIDResult[0].purchaseID;
                db.pool.query(deleteAlcoholPurchase, alcoholPurchaseID, function(error){

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        // Get new total cost for purchase from alcoholPurchases
                        db.pool.query(sumLineCost, purchaseID, function(error, totalCostResult){
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            } else {
                                let totalCost = totalCostResult[0]["SUM(lineCost)"];
                                db.pool.query(updatePurchases, [totalCost, purchaseID], function(error){
                                    if (error) {
                                        console.log(error);
                                        res.sendStatus(400);
                                    } else {
                                        res.sendStatus(204);
                                    }
                                })
                            }
                        })
                    }
                })
            }
    })
});

// UPDATE AN ALCOHOL PURCHASE
app.put('/update-alcohol-purchase-ajax', function(req,res,next){
    // Capture requisite data in variables
    let data = req.body;
    let alcoholPurchaseID = parseInt(data.alcoholPurchaseID);
    let alcoholID = parseInt(data.alcoholID);

    // Declare queries
    let selectAlcoholPurchasesQuery = `SELECT * FROM AlcoholPurchases`;
    let unitCostQuery = `SELECT wholesalePrice FROM Alcohols WHERE alcoholID = ?`;
    let quantityQuery = `SELECT quantityPurchased FROM AlcoholPurchases WHERE alcoholPurchaseID = ?`;
    let updateAlcoholPurchaseQuery = `UPDATE AlcoholPurchases SET alcoholID = ?, lineCost = ? WHERE alcoholPurchaseID = ?`;
    let selectPurchaseIDQuery = `SELECT purchaseID FROM AlcoholPurchases WHERE alcoholPurchaseID = ?`;
    let purchaseSumQuery = `SELECT SUM(lineCost) FROM AlcoholPurchases where AlcoholPurchases.purchaseID = ?`
    let updatePurchasesQuery = `UPDATE Purchases SET totalCost = ? WHERE purchaseID = ?`;

    // Get unit cost of alcohol on alcohol-purchase being updated
    db.pool.query(unitCostQuery, alcoholID, function(error, unitCostResults){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Get quantity of alcohol units purchased from AlcoholPurchases query
            let unitCost = unitCostResults[0].wholesalePrice;
            db.pool.query(quantityQuery, alcoholPurchaseID, function(error, quantityResults){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Now, calculate line cost and use in update query for AlcoholPurchases table
                    let quantity = quantityResults[0].quantityPurchased;
                    let lineCost = quantity * unitCost;
                    db.pool.query(updateAlcoholPurchaseQuery, [alcoholID, lineCost, alcoholPurchaseID], function(error){
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            // Now, get the purchaseID associated with the updated alcohol-purchase record
                            db.pool.query(selectPurchaseIDQuery, alcoholPurchaseID, function(error, purchaseIDResult){
                                if (error) {
                                    console.log(error);
                                    res.sendStatus(400);
                                } else {
                                    let purchaseID = purchaseIDResult[0].purchaseID;
                                    db.pool.query(purchaseSumQuery, purchaseID, function(error, sumResult){
                                        if (error) {
                                            console.log(error);
                                            res.sendStatus(400);
                                        } else {
                                            // Update Purchases table with new totalCost accounting for update of line item (alcohol-purchase record)
                                            let totalCost = sumResult[0]["SUM(lineCost)"];
                                            db.pool.query(updatePurchasesQuery, [totalCost, purchaseID], function(error){
                                                if (error) {
                                                    console.log(error);
                                                    res.sendStatus(400);
                                                } else {
                                                    // Finally, run select query on AlcoholPurchases and display updated table
                                                    db.pool.query(selectAlcoholPurchasesQuery, function(error, rows, fields) {
                                                        if (error) {
                                                            console.log(error);
                                                            res.sendStatus(400);
                                                        } else {
                                                            res.send(rows);
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })

});


/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
