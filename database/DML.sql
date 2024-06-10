-- SELECT STATEMENTS FOR POPULATING TABLES

-- Select all data from Alcohols table
SELECT * FROM `Alcohols`;

-- Select all data from AlcoholPurchases table and
-- join AlcoholPurchases with Purchases on purchaseID attribute and
-- join AlcoholPurchases with Alcohols on alcoholID attribute and
-- join Wholesalers table on Purchases table at wholesalerID attribute
SELECT * FROM `AlcoholPurchases`
INNER JOIN `Purchases` ON `AlcoholPurchases.purchaseID` = `Purchases.purchaseID`
INNER JOIN `Alcohols` ON `AlcoholPurchases.alcoholID` = `Alcohols.alcoholID`
INNER JOIN `Wholesalers` ON `Purchases.wholesalerID` = `Wholesalers.wholesalerID`
ORDER BY `AlcoholPurchases.alcoholPurchaseID` ASC;

-- Select all from Employees table
SELECT * FROM `Employees`;

-- Select all from Purchases table and
-- join Wholesalers with Purchases on wholesalerID attribute and
-- join Employees with Purchases on employeeID attribute
SELECT * FROM `Purchases`
INNER JOIN `Wholesalers` ON `Purchases.wholesalerID` = `Wholesalers.wholesalerID`
LEFT JOIN `Employees` ON `Purchases.employeeID` = `Employees.employeeID`
ORDER BY `purchaseID` ASC;

SELECT * FROM `Wholesalers`;


-- SELECT STATEMENTS MIMICKING DROPDOWN MENUS

-- Alcohol Update Dropdown
SELECT `alcoholID`, `alcoholName` FROM  `Alcohols` WHERE `alcoholID` = :alcoholID;

-- Alcohol Type Dropdown
SELECT `alcoholType` FROM `Alcohols`;

-- Employee Select Dropdown
SELECT `employeeID`, `firstName`, `lastName` FROM `Employees`;

-- Employee Role Dropdown
SELECT `employeeRole` FROM `Employees`;

-- Select Wholesaler Dropdown
SELECT `wholesalerID`, `wholesalerName` FROM `Wholesalers`

-- Select Purchase Dropdown
SELECT `purchaseID`, `wholesalerName`, `deliveryDate` FROM `Purchases`;

-- Select AlcoholPurchase Dropdown
SELECT `alcoholPurchaseID`, `wholesalerName`, `alcoholName` FROM `AlcoholPurchases`;


-- SELECT STATEMENT FOR ALCOHOL SEARCH
SELECT * FROM `Alcohols` WHERE `alcoholName` LIKE `%${:alcoholName}%`


-- SPECIFIC SELECT STATEMENTS TO CALCULATE LINE COST AND TOTAL PURCHASE COST

-- Select statement to find unit price
SELECT `wholesalePrice` FROM `Alcohols` WHERE `alcoholID` = :alcoholID;

-- Select statement to find quantity of alcohol purchased in given line item
SELECT `quantityPurchased` FROM `AlcoholPurchases` WHERE `alcoholPurchaseID` = :alcoholPurchaseID;

-- Calculate Purchases.totalCost using SELECT statement below
SELECT SUM(`lineCost`) FROM `AlcoholPurchases` WHERE `alcoholPurchaseID` = :alcoholPurchaseID;


-- INSERT STATEMENTS

-- Insert into Alcohols table
INSERT INTO `Alcohols` (`alcoholName`, `alcoholType`, `alcoholPercentage`, `alcoholVolume`, `inventory`)
VALUES (:alcoholNameInput, :alcoholTypeInput, :alcoholPercentageInput, :alcoholVolumeInput, :inventoryInput);

-- Insert into AlcoholPurchases (Line item for Purchase of various Alcohols - Intersection between Alcohols and Purchases)
INSERT INTO `AlcoholPurchases` (`purchaseID`, `alcoholID`, `quantityPurchased`, `lineCost`)
VALUES (:purchaseID, :alcoholID, :quantityPurchased, :lineCost);

-- Add new employee to list of employees
INSERT INTO `Employees` (`employeeName`, `startDate`, `employeeRole`)
VALUES (:employeeNameInput, :startDateInput, :employeeRoleInput);

-- Add new purchase record into list of purchases
INSERT INTO `Purchases` (`wholesalerID`, `paid`, `deliveryDate`, `delivered`, `totalCost`)
VALUES (:wholesalerID, :paid, :deliveryDate, :delivered, :totalCost);

-- Add new wholesaler record into list of wholesalers
INSERT INTO `Wholesalers` (`name`, `address`, `email`, `phone`, `contactName`)
VALUES (:nameInput, :addressInput,:emailInput, :phoneInput, :contactNameInput);


-- UPDATE STATEMENTS FOR EACH PAGE

-- Allow user to update an alcohol's info
UPDATE `Alcohols`
SET `alcoholType` = :alcoholType, `alcoholPercentage` = :alcoholPercentage, `wholesalePrice` = :wholesalePrice, `alcoholVolume` = :alcoholVolume, `inventory` = :inventory
WHERE `alcoholID` = :alcoholID;

-- Allow user to update an alcohol purchase
UPDATE `AlcoholPurchases`
SET `alcoholID` = :alcoholID, `lineCost` = :lineCost
WHERE `alcoholPurchaseID` = :alcoholPurchaseID;

-- Allow user to update a purchase
UPDATE `Purchases`
SET `wholesalerID` = :wholesalerID, `employeeID` = :employeeID, `paid` = :paid, `deliveryDate` = :deliveryDate, `delivered` = :delivered,  `totalCost` = :totalCost
WHERE `purchaseID` = :purchaseID;

-- Allow user to update an employee's role
UPDATE `Employees`
SET  `employeeRole` = :employeeRoleInput
WHERE `employeeID` = :employee_ID_from_update_form;

-- Allow user to update a wholesaler's info
UPDATE `Wholesalers`
SET `name` = :nameInput, `address` = :addressInput, `email` = :emailInput, `phone` = :phoneInput, `contactName` = :contactNameInput
WHERE `wholesalerID` = :wholesalerID;


-- DELETE STATEMENTS

-- Delete an alcohol entry
DELETE FROM `Alcohols` WHERE `alcoholID` = :alcoholID;

-- Delete from AlcoholPurchases
DELETE FROM `AlcoholPurchases` WHERE `alcoholPurchaseID` = :alcoholPurchaseID;

-- Delete from Employees
DELETE FROM `Employees` WHERE `employeeID` = :employeeID;

-- Delete from Purchases
DELETE FROM `Purchases` WHERE `purchaseID` = :purchaseID;

-- Delete from Wholesalers
DELETE FROM `Wholesalers` WHERE `wholesalerID` = :wholesalerID;