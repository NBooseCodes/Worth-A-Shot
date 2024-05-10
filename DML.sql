-- Step 1: Allow client to browse WholeSalers, Purchases, Alcohols, and Employees

-- Populate Wholesaler table
SELECT `wholesalerID` AS 'ID', 
`name` AS 'Name', 
`address` AS 'Street Address', 
`email` AS 'Email Address', 
`phone` AS 'Phone Number', 
`contactName` AS 'Point of Contact' FROM Wholesalers;
-- Populate Alcohol table and give titles more appropriate "non-code-y" names
SELECT `alcoholID` AS 'ID', 
`alcoholName` AS 'Name',  
`alcoholType` AS 'Liquor Category', 
`alcoholPercentage` AS 'ABV', 
`alcoholVolume` AS 'Volume',
`inventory` AS 'Inventory' FROM `Alcohols`;

-- Populate Employee table and re-title columns with neater looking titles
SELECT `employeeID` AS 'ID',
`firstName` AS 'First Name',
`lastName` AS 'Last Name',
`startDate` AS 'StartDate',
`employeeRole` AS 'Role' FROM `Employees`;

-- Populate table that shows data within the intersection table AlcoholPurchases
-- No updated titles as this is more of a back-end entity

SELECT * FROM `AlcoholPurchases`;

-- Populate Data that shows Purchases Info
SELECT `purchaseID` AS 'ID', 
`wholesalerID` AS 'Wholesaler ID', 
`employeeID` AS 'EmployeeID', 
`paid` AS 'Paid',
`deliveryDate` AS 'Delivery Date',
`delivered` AS 'Delivered',
`totalCost` AS 'Total Cost' FROM `Purchases`;


-- The following are for various drop-down search menus
-- Allow client to search for all purchases in a dropdown via purchaseID
SELECT `purchaseID` FROM `Purchases`;

-- Get list of alcohols available for dropdown for RUD Ops (Create has its own thing)

SELECT `alcoholID`, `alcoholName` FROM `Alcohols`;

SELECT `wholesalerID`, `name` FROM `Wholesalers`;

-- Get employees for dropdown for RUD Ops (Creation has its own thing)

SELECT `employeeID`, `firstName` and `lastname` FROM `Employees`;

-- The following are INSERT STATEMENTS

-- ADD NEW ALCOHOL TO INVENTORY

INSERT INTO `Alcohols` (`alcoholName`, `alcoholType`, `alcoholPercentage`, `alcoholVolume`, `inventory`)
VALUES (:alcoholNameInput, :alcoholTypeInput, :alcoholPercentageInput, :alcoholVolumeInput, :inventoryInput);

-- Add new Wholesaler to list of wholesalers
INSERT INTO `Wholesalers` (`name`, `address`, `email`, `phone`, `contactName`)
VALUES (:nameInput, :addressInput,:emailInput, :phoneInput, :contactNameInput);

-- Add new employee to list of employees
INSERT INTO `Employees` (`employeeName`, `startDate`, `employeeRole`)
VALUES (:employeeNameInput, :startDateInput, :employeeRoleInput);

-- Add new purchase record into list of purchases
INSERT INTO `Purchases` (`wholesalerID`, `paid`, `deliveryDate`, `delivered`, `totalCost`)
VALUES (:wholesalerID, :paid, :deliveryDate, :delivered, :totalCost);

-- Insert into AlcoholPurchases (Line item for Purchase of various Alcohols - Intersection between Alcohols and Purchases)
INSERT INTO `AlcoholPurchases` (`purchaseID`, `alcoholID`, `quantityPurchased`, `lineCost`)
VALUES (:purchaseID, :alcoholID, :quantityPurchased, :lineCost);

SELECT `wholesalerID`, `name`, `address`, `email`, `phone`, `contactName`
FROM `Wholesalers`
WHERE `wholesalerID` = :wholesalerID_selected_from_employee_dropdown;

UPDATE `Wholesalers`
SET `name` = :nameInput, `address` = :addressInput, `email` = :emailInput, `phone` = :phoneInput, `contactName` = :contactNameInput;

-- Allow user to select a specific employee
SELECT `employeeID`, `firstName`, `lastName`, `startDate`, `employeeRole` 
FROM `Employees` 
WHERE `employeeID` = :employeeID_selected_from_employee_dropdown;

-- Allow user to update that employee's info
UPDATE `Employees`
SET `firstName` = :firstNameInput, lastName = :lastNameInput, startDate = :startDateInput, employeeRole = :employeeRoleInput
WHERE `employeeID` = :employee_ID_from_update_form;

-- Delete an alcohol entry

DELETE FROM `Alcohols` WHERE `alcoholID` = :alcoholID_selected_from_browse_alcohol_page;

-- DELETE A WHOLESALER
DELETE FROM `Wholesalers` WHERE `wholesalerID` = :wholesalerID_selected_from_browse_wholesaler_page;

-- DELETE AN EMPLOYEE
DELETE FROM `Employees` WHERE `employeeID` = :employeeID_selected_from_browse_wholesaler_page;

-- DELETE A PURCHASE ORDER
DELETE FROM `Purchases` WHERE `purchaseID` = :purchaseID_selected_from_browse_purchases_page;
