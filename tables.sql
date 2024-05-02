--
-- Group 80 “Worth A Shot”: Nicole Boose and Elsa Luthi
-- CS 340, Spring 2024
-- Description: This file is the creation of our database for a company that sells alcohol. 
--

-- 
-- TABLE CREATION BELOW
-- 

-- Creates Wholesalers table that stores information on alcohol wholesalers.
CREATE TABLE `Wholesalers` (
    `wholesalerID` int(11) AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `address` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `phone` varchar(255) NOT NULL,
    `contactName` varchar(255),
    UNIQUE(`name`),
    PRIMARY KEY (`wholesalerID`)
);

-- Creates Alcohols table that stores information different types of alcohol.
-- inventory: has to be updated with every sale and purchase
CREATE TABLE `Alcohols` (
    `alcoholID` int(11) AUTO_INCREMENT,
    `alcoholName` varchar(255) NOT NULL,
    `alcoholType` varchar(255) NOT NULL,
    `alcoholPercentage` decimal(19,4) NOT NULL,
    `wholesalePrice` decimal(19,4) NOT NULL,
    `alcoholVolume` decimal(19,4) NOT NULL,
    `retailPrice` decimal(19,4) NOT NULL,
    `inventory` int(11) NOT NULL DEFAULT 0,
    PRIMARY KEY (`alcoholID`)
);

-- Creates Emplpoyee table that stores information different employees in the organization.
CREATE TABLE `Employees` (
    `employeeID` int(11) AUTO_INCREMENT,
	`employeeName` varchar(255) NOT NULL,
    `startDate` date NOT NULL,
    `employeeRole` varchar(255) NOT NULL,
    PRIMARY KEY (`employeeID`)
);

-- Creates Sales table that stores information on an alcohol sale transaction.
-- totalCost: adds up all of the AlcoholSales(linePrice) for the specific sale.
CREATE TABLE `Sales` (
    `saleID` int(11) AUTO_INCREMENT,
	`employeeID` int(11) NOT NULL,
    `saleDate` date NOT NULL,
    `saleTime` time NOT NULL,
    `totalCost` decimal(19,4) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (`employeeID`) REFERENCES `Employees`(`employeeID`),
    PRIMARY KEY (`saleID`)
);

-- Creates Purchases table that stores information on an alcohol purchasing transaction.
-- TotalPrice: add all of the AlcoholPurchases(lineCrice) together for the specific purchase.
CREATE TABLE `Purchases` (
    `purchaseID` int(11) AUTO_INCREMENT,
    `wholesalerID` int(11) NOT NULL,
	`paid` tinyint(1) NOT NULL DEFAULT 0,
    `deliveryDate` date NOT NULL,
    `delivered` tinyint(1) NOT NULL DEFAULT 0,
    `totalPrice` decimal(19,4) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (`wholesalerID`) REFERENCES `Wholesalers`(`wholesalerID`),
    PRIMARY KEY (`purchaseID`)
);

-- Creates AlcoholSales intersection table that stores information on the Sales of the Alcohols. 
-- linePrice: the quanitity sold * Alcohols(retailPrice)
CREATE TABLE `AlcoholSales` ( 
	`alcoholSaleID` int(11) AUTO_INCREMENT,
    `saleID` int(11) NOT NULL,
	`alcoholID` int(11) NOT NULL,
    `quantitySold` int(11) NOT NULL,
    `linePrice` decimal(19,4) NOT NULL,
    FOREIGN KEY (`alcoholID`) REFERENCES `Alcohols`(`alcoholID`),
    FOREIGN KEY (`saleID`) REFERENCES `Sales`(`saleID`),
	PRIMARY KEY (`alcoholSaleID`)
);

-- Creates AlcoholPurchases intersection table that stores information on the Purchases of the Alcohols.
-- lineCost: the quanitity purchased * Alcohols(wholesalePrice)
CREATE TABLE `AlcoholPurchases` (
	`alcoholPurchaseID` int(11) AUTO_INCREMENT,
    `purchaseID` int(11) NOT NULL,
	`alcoholID` int(11) NOT NULL,
    `quantityPurchased` int(11) NOT NULL,
    `lineCost` decimal(19,4) NOT NULL,
    FOREIGN KEY (`alcoholID`) REFERENCES `Alcohols`(`alcoholID`),
    FOREIGN KEY (`purchaseID`) REFERENCES `Purchases`(`purchaseID`),
    PRIMARY KEY (`alcoholPurchaseID`)
);

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
INSERT INTO `Employees` (`employeeName`, `startDate`, `role`)
VALUES ('Taquito', '2021-01-01', 'Manager');
INSERT INTO `Employees` (`employeeName`, `startDate`, `role`)
VALUES ('Tom', '1993-07-04', 'Sales Clerk');
INSERT INTO `Employees` (`employeeName`, `startDate`, `role`)
VALUES ('Pierogi', '2024-02-24', 'Sales Clerk');

-- Insertion of Purchases
INSERT INTO `Purchases` (`wholesalerID`, `paid`, `deliveryDate`, `delivered`, `totalPrice`)
VALUES (
  (SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Diageo'), '1', '2024-04-03', '1', 
  (SELECT SUM(`lineCost`) FROM `AlcoholPurchases` WHERE `wholesalerID` = (SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Diageo'))
  );
INSERT INTO `Purchases` (`wholesalerID`, `paid`, `deliveryDate`, `delivered`, `totalPrice`)
VALUES (
  (SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Pernod Ricard'), '0', '2024-05-05', '1', 
  (SELECT SUM(`lineCost`) FROM `AlcoholPurchases` WHERE `wholesalerID` = (SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Pernod Ricard'))
  );
INSERT INTO `Purchases` (`wholesalerID`, `paid`, `deliveryDate`, `delivered`, `totalPrice`)
VALUES (
  (SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Beam Suntory'), '0', '2024-05-28', '0', 
  (SELECT SUM(`lineCost`) FROM `AlcoholPurchases` WHERE `wholesalerID` = (SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Beam Suntory'))
  );

-- Insertion of Sales
-- totalCost: needs to be ironed out more; using the number feels like hardcoding
-- We will have to update Alcohols after each event to update Alcohols(inventory)
INSERT INTO `Sales` (`employeeID`, `saleDate`, `saleTime`)
VALUES ((SELECT `employeeID` FROM `Employees` WHERE `employeeName` = 'Taquito'), '2024-04-30', '14:23:19',
	(SELECT SUM(`linePrice`) FROM `AlcoholSales` WHERE `saleID` = 1)
	);
INSERT INTO `Sales` (`employeeID`, `saleDate`, `saleTime`)
VALUES ((SELECT `employeeID` FROM `Employees` WHERE `employeeName` = 'Tom'), '1999-12-31', '09:01:02',
	(SELECT SUM(`linePrice`) FROM `AlcoholSales` WHERE `saleID` = 2)
	);
INSERT INTO `Sales` (`employeeID`, `saleDate`, `saleTime`)
VALUES ((SELECT `employeeID` FROM `Employees` WHERE `employeeName` = 'Pierogi'), '2024-04-29', '17:54:55',
	(SELECT SUM(`linePrice`) FROM `AlcoholSales` WHERE `saleID` = 3)
	);

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


-- Insertion of AlcoholSales
-- May need to update how we plan to grab the sale maybe need unique sale identifier?; using the number feels like hardcoding
INSERT INTO `AlcoholSales` (`saleID`, `alcoholID`, `quantitySold`, `linePrice`)
VALUES (
  (SELECT `saleID` FROM `Sales` WHERE `saleID` = 1),
  (SELECT `alcoholID` FROM `Alcohols` WHERE `alcoholName` = 'Captain Morgan'), '1',
  (SELECT SUM(`retailPrice` * 1) FROM `Alcohols` WHERE `alcoholName` = 'Captain Morgan')
);
INSERT INTO `AlcoholSales` (`saleID`, `alcoholID`, `quantitySold`, `linePrice`)
VALUES (
  (SELECT `saleID` FROM `Sales` WHERE `saleID` = 2),
  (SELECT `alcoholID` FROM `Alcohols` WHERE `alcoholName` = 'Don Julio'), '1',
  (SELECT SUM(`retailPrice` * 1) FROM `Alcohols` WHERE `alcoholName` = 'Don Julio')
);
INSERT INTO `AlcoholSales` (`saleID`, `alcoholID`, `quantitySold`, `linePrice`)
VALUES (
  (SELECT `saleID` FROM `Sales` WHERE `saleID` = 2),
  (SELECT `alcoholID` FROM `Alcohols` WHERE `alcoholName` = 'Malibu'), '1',
  (SELECT SUM(`retailPrice` * 1) FROM `Alcohols` WHERE `alcoholName` = 'Malibu')
);
INSERT INTO `AlcoholSales` (`saleID`, `alcoholID`, `quantitySold`, `linePrice`)
VALUES (
  (SELECT `saleID` FROM `Sales` WHERE `saleID` = 3),
  (SELECT `alcoholID` FROM `Alcohols` WHERE `alcoholName` = 'Jim Beam'), '1',
  (SELECT SUM(`retailPrice` * 1) FROM `Alcohols` WHERE `alcoholName` = 'Jim Beam')
);
INSERT INTO `AlcoholSales` (`saleID`, `alcoholID`, `quantitySold`, `linePrice`)
VALUES (
  (SELECT `saleID` FROM `Sales` WHERE `saleID` = 3),
  (SELECT `alcoholID` FROM `Alcohols` WHERE `alcoholName` = 'Jameson'), '2',
  (SELECT SUM(`retailPrice` * 2) FROM `Alcohols` WHERE `alcoholName` = 'Jameson')
);
