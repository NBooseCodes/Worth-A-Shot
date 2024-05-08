-- Step 1: Allow client to browse WholeSalers, Purchases, Alcohols, and Employees

-- Populate Wholesaler table
SELECT Wholesalers.wholesalerID, name, address, email, phone, contactName FROM Wholesalers;
-- Populate Alcohol table
SELECT Alcohols.alcoholID, 
Alcohols.alcoholName AS Name,  
Alcohols.alcoholType AS 'Liquor Category', 
Alcohols.alcoholPercentage AS ABV, 
Alcohols.alcoholVolume AS Volume,
inventory FROM Alcohols;
-- Populate Employee table
SELECT Employees.employeeID AS 'ID',
Employees.employeeName as 'Full Name',
startDate,
Employees.employeeRole AS 'Role' FROM Employees;

SELECT Purchases.purchaseID FROM Purchases;

-- Get list of alcohols available for dropdown for RUD Ops (Create has its own thing)
SELECT alcoholID, alcoholName FROM Alcohols;

SELECT wholesalerID, wholesalerName FROM Wholesalers;
-- Get employees for dropdown for RUD Ops (Creation has its own thing)
SELECT employeeID, employeeName FROM Employees;
-- INSERT STATEMENTS

-- ADD NEW ALCOHOL TO INVENTORY

INSERT INTO Alcohols (alcoholName, alcoholType, alcoholPercentage, alcoholVolume, inventory)
VALUES (:alcoholNameInput, :alcoholTypeInput, :alcoholPercentageInput, :alcoholVolumeInput, :inventoryInput);

INSERT INTO Wholesalers (name, address, email, phone, contactName)
VALUES (:nameInput, :addressInput,:emailInput, :phoneInput, :contactNameInput);

INSERT INTO Employees (employeeName, startDate, employeeRole)
VALUES (:employeeNameInput, :startDateInput, :employeeRoleInput);

-- ADD PURCHASES INFO WHEN YOU SORT THE ERROR

-- Delete an alcohol entry

DELETE FROM Alcohols WHERE alcoholID = :alcoholIDSelectedFromBrowseAlcoholPage;
-- DELETE A WHOLESALER
DELETE FROM Wholesalers WHERE wholesalerID = :wholesalerIDSelectedFromBrowseWholesalersPage;
-- DELETE AN EMPLOYEE
DELETE FROM Employees WHERE employeeID = :employeeIDSelectedFromBrowseEmployeePage;
-- DELETE A PURCHASE ORDER
DELETE FROM Purchases WHERE purchaseID = :purchaseIDSelectedFromBrowsePurchasesPage;
