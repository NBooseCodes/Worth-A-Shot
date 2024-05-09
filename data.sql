--
-- Group 80 “Worth A Shot”: Nicole Boose and Elsa Luthi
-- CS 340, Spring 2024
-- Description: This file is all of our insertions for our tables. 
-- 
--
-- DATA INSERTION BELOW
-- 

-- Insertion of Wholesalers 
INSERT INTO `Wholesalers` (`name`, `address`, `email`, `phone`, `contactName`)
VALUES ('Diageo', '1111 NW 11th St New York, NY 10001', 'diageo@alcohols.com', '111-111-1111', 'Diego Montoya');
INSERT INTO `Wholesalers` (`name`, `address`, `email`, `phone`, `contactName`)
VALUES ('Pernod Ricard', '14 West Ln Salt Lake City, UT 84106', 'pricard@alcohols.com', '206-206-2066', 'Richard Pernod');
INSERT INTO `Wholesalers` (`name`, `address`, `email`, `phone`, `contactName`)
VALUES ('Beam Suntory', '700 Big Cat Rd Las Vegas, NV 89107', 'beamyboy@notalcohols.com', '800-244-8482', 'Jim Beam');

-- Insertion of Alcohols
INSERT INTO `Alcohols` (`alcoholName`, `alcoholType`, `alcoholPercentage`, `wholesalePrice`, `alcoholVolume`, `retailPrice`, `inventory`)
VALUES ('Captain Morgan', 'Rum', '0.35', '12.80', '0.750', '15.99', '200');
INSERT INTO `Alcohols` (`alcoholName`, `alcoholType`, `alcoholPercentage`, `wholesalePrice`, `alcoholVolume`, `retailPrice`, `inventory`)
VALUES ('Don Julio', 'Tequila', '0.40', '43.50', '0.750', '58.00', '143');
INSERT INTO `Alcohols` (`alcoholName`, `alcoholType`, `alcoholPercentage`, `wholesalePrice`, `alcoholVolume`, `retailPrice`, `inventory`)
VALUES ('Malibu', 'Rum', '0.21', '19.20', '1.750', '24.00', '70');
INSERT INTO `Alcohols` (`alcoholName`, `alcoholType`, `alcoholPercentage`, `wholesalePrice`, `alcoholVolume`, `retailPrice`, `inventory`)
VALUES ('Jameson', 'Whiskey', '0.40', '11.65', '0.350', '14.20', '52');
INSERT INTO `Alcohols` (`alcoholName`, `alcoholType`, `alcoholPercentage`, `wholesalePrice`, `alcoholVolume`, `retailPrice`, `inventory`)
VALUES ('Jim Beam', 'Whiskey', '0.40', '16.00', '1.75', '21.00', '104');

-- Insertion of Employees
INSERT INTO `Employees` (`firstName`, `lastName`, `startDate`, `employeeRole`)
VALUES ('Taquito', 'Sanders', '2021-01-01', 'Manager');
INSERT INTO `Employees` (`employeeName`, `startDate`, `employeeRole`)
VALUES ('Tom', 'Sizemore', '1993-07-04', 'Sales Clerk');
INSERT INTO `Employees` (`employeeName`, `startDate`, `employeeRole`)
VALUES ('Pierogi', "O'Hoolihan", '2024-02-24', 'Sales Clerk');

-- Insertion of Purchases
INSERT INTO `Purchases` (`wholesalerID`, `paid`, `deliveryDate`, `delivered`, `totalCost`)
VALUES ((SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Diageo'), '1', '2024-04-03', '1', '1101.50');
INSERT INTO `Purchases` (`wholesalerID`, `paid`, `deliveryDate`, `delivered`, `totalCost`)
VALUES ((SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Pernod Ricard'), '0', '2024-05-05', '1', '2032.00');
INSERT INTO `Purchases` (`wholesalerID`, `paid`, `deliveryDate`, `delivered`, `totalCost`)
VALUES ((SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Beam Suntory'), '0', '2024-05-28', '0', '103.04');

-- Insertion of Sales
-- totalCost: needs to be ironed out more; using the number feels like hardcoding
-- We will have to update Alcohols after each event to update Alcohols(inventory)


-- Insertion of AlcoholPurchases
-- We will have to update Alcohols after each event to update Alcohols(inventory)
INSERT INTO `AlcoholPurchases` (`purchaseID`, `alcoholID`, `quantityPurchased`, `lineCost`)
VALUES (
  (SELECT `purchaseID` FROM `Purchases` WHERE `wholesalerID` = (SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Diageo')), 
  (SELECT `alcoholID` FROM `Alcohols` WHERE `alcoholName` = 'Captain Morgan'), '10', 
  (SELECT SUM(`wholesalePrice` * 10) FROM `Alcohols` WHERE `alcoholName` = 'Captain Morgan'));
INSERT INTO `AlcoholPurchases` (`purchaseID`, `alcoholID`, `quantityPurchased`, `lineCost`)
VALUES (
  (SELECT `purchaseID` FROM `Purchases` WHERE `wholesalerID` = (SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Diageo')), 
  (SELECT `alcoholID` FROM `Alcohols` WHERE `alcoholName` = 'Don Julio'), '20', 
  (SELECT SUM(`wholesalePrice` * 20) FROM `Alcohols` WHERE `alcoholName` = 'Don Julio'));
INSERT INTO `AlcoholPurchases` (`purchaseID`, `alcoholID`, `quantityPurchased`, `lineCost`)
VALUES (
  (SELECT `purchaseID` FROM `Purchases` WHERE `wholesalerID` = (SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Pernod Ricard')), 
  (SELECT `alcoholID` FROM `Alcohols` WHERE `alcoholName` = 'Malibu'), '10', 
  (SELECT SUM(`wholesalePrice` * 10) FROM `Alcohols` WHERE `alcoholName` = 'Malibu'));
INSERT INTO `AlcoholPurchases` (`purchaseID`, `alcoholID`, `quantityPurchased`, `lineCost`)
VALUES (
  (SELECT `purchaseID` FROM `Purchases` WHERE `wholesalerID` = (SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Pernod Ricard')), 
  (SELECT `alcoholID` FROM `Alcohols` WHERE `alcoholName` = 'Jameson'), '40', 
  (SELECT SUM(`wholesalePrice` * 40) FROM `Alcohols` WHERE `alcoholName` = 'Jameson'));
INSERT INTO `AlcoholPurchases` (`purchaseID`, `alcoholID`, `quantityPurchased`, `lineCost`)
VALUES (
  (SELECT `purchaseID` FROM `Purchases` WHERE `wholesalerID` = (SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Beam Suntory')), 
  (SELECT `alcoholID` FROM `Alcohols` WHERE `alcoholName` = 'Jim Beam'), '30', 
  (SELECT SUM(`wholesalePrice` * 30) FROM `Alcohols` WHERE `alcoholName` = 'Jim Beam'));
