--
-- Group 80 “Worth A Shot”: Nicole Boose and Elsa Luthi
-- CS 340, Spring 2024
--

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- 
-- TABLE CREATION BELOW
-- 

-- Creates Wholesalers table that stores information on alcohol wholesalers.
CREATE OR REPLACE TABLE `Wholesalers` (
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
CREATE OR REPLACE TABLE `Alcohols` (
    `alcoholID` int(11) AUTO_INCREMENT,
	`alcoholName` varchar(255) NOT NULL,
    `alcoholType` varchar(255) NOT NULL,
    `alcoholPercentage` decimal(19,4) NOT NULL,
    `wholesalePrice` decimal(19,4) NOT NULL,
    `alcoholVolume` decimal(19,4) NOT NULL,
    `inventory` int(11),
    PRIMARY KEY (`alcoholID`)
);

-- Creates Emplpoyee table that stores information different employees in the organization.
CREATE OR REPLACE TABLE `Employees` (
    `employeeID` int(11) AUTO_INCREMENT,
	`firstName` varchar(255) NOT NULL,
    `lastName` varchar(255) NOT NULL,
    `startDate` date NOT NULL,
    `employeeRole` varchar(255) NOT NULL,
    PRIMARY KEY (`employeeID`)
);


-- Creates Purchases table that stores information on an alcohol purchasing event. EmployeeID CAN BE NULL WHEN UPDATED
CREATE OR REPLACE TABLE `Purchases` (
    `purchaseID` int(11) AUTO_INCREMENT,
    `wholesalerID` int(11) NOT NULL,
    `employeeID` int(11) DEFAULT NULL,
	  `paid` tinyint(1) DEFAULT 0,
    `deliveryDate` date NOT NULL,
    `delivered` tinyint(1) DEFAULT 0,
    `totalCost` decimal(19,4),
    PRIMARY KEY (`purchaseID`),
    FOREIGN KEY (`wholesalerID`) REFERENCES `Wholesalers`(`wholesalerID`) ON DELETE CASCADE,
    FOREIGN KEY (`employeeID`) REFERENCES `Employees`(`employeeID`) ON DELETE CASCADE
);

-- Creates AlcoholPurchases intersection table that stores information on the Purchases of the Alcohols.
CREATE OR REPLACE TABLE `AlcoholPurchases` (
	`alcoholPurchaseID` int(11) AUTO_INCREMENT,
    `purchaseID` int(11) NOT NULL,
	  `alcoholID` int(11) NOT NULL,
    `quantityPurchased` int(11) NOT NULL,
    `lineCost` decimal(19,4) NOT NULL,
    FOREIGN KEY (`alcoholID`) REFERENCES `Alcohols`(`alcoholID`) ON DELETE CASCADE,
    FOREIGN KEY (`purchaseID`) REFERENCES `Purchases`(`purchaseID`) ON DELETE CASCADE,
    PRIMARY KEY (`alcoholPurchaseID`)
);

--
-- DATA INSERTION BELOW
-- 

-- Insertion of Wholesalers 
INSERT INTO `Wholesalers` (`name`, `address`, `email`, `phone`, `contactName`)
VALUES ('Diageo', '1111 NW 11th St New York, NY 10001', 'diageo@alcohols.com', '111-111-1111', 'Diego Montoya'),
('Pernod Ricard', '14 West Ln Salt Lake City, UT 84106', 'pricard@alcohols.com', '206-206-2066', 'Richard Pernod'),
('Beam Suntory', '700 Big Cat Rd Las Vegas, NV 89107', 'beamyboy@notalcohols.com', '800-244-8482', 'Jim Beam');

-- Insertion of Alcohols
INSERT INTO `Alcohols` (`alcoholName`, `alcoholType`, `alcoholPercentage`, `wholesalePrice`, `alcoholVolume`, `inventory`)
VALUES ('Captain Morgan', 'Rum', '0.35', '12.80', '0.750', '200'),
('Don Julio', 'Tequila', '0.40', '43.50', '0.750', '143'),
('Malibu', 'Rum', '0.21', '19.20', '1.750', '70'),
('Jameson', 'Whiskey', '0.40', '11.65', '0.350', '52'),
('Jim Beam', 'Whiskey', '0.40', '16.00', '1.75', '104');

-- Insertion of Employees
INSERT INTO `Employees` (`firstName`, `lastName`, `startDate`, `employeeRole`)
VALUES ('Taquito', 'Sanders', '2021-01-01', 'Manager'),
('Tom', 'Sizemore', '1993-07-04', 'Sales Clerk'),
('Pierogi', "O'Hoolihan", '2024-02-24', 'Sales Clerk');

-- Insertion of Purchases
INSERT INTO `Purchases` (`wholesalerID`, `employeeID`, `paid`, `deliveryDate`, `delivered`, `totalCost`)
VALUES ((SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Diageo'), 
(SELECT `employeeID` FROM `Employees` WHERE `firstName` = 'Taquito' and `lastName` = 'Sanders'), '1', '2024-04-03', '1', '1101.50'),
((SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Pernod Ricard'), 
(SELECT `employeeID` FROM `Employees` WHERE `firstName` = 'Pierogi' and `lastName` = "O'Hoolihan"), '0', '2024-05-05', '1', '2032.00'),
((SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Beam Suntory'),
(SELECT `employeeID` FROM `Employees` WHERE `firstName` = 'Tom' and `lastName` = 'Sizemore'), '0', '2024-05-28', '0', '103.04');

-- Insertion of AlcoholPurchases
INSERT INTO `AlcoholPurchases` (`purchaseID`, `alcoholID`, `quantityPurchased`, `lineCost`)
VALUES (
  (SELECT `purchaseID` FROM `Purchases` WHERE `wholesalerID` = (SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Diageo')), 
  (SELECT `alcoholID` FROM `Alcohols` WHERE `alcoholName` = 'Captain Morgan'), '10', 
  (SELECT SUM(`wholesalePrice` * 10) FROM `Alcohols` WHERE `alcoholName` = 'Captain Morgan')),
((SELECT `purchaseID` FROM `Purchases` WHERE `wholesalerID` = (SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Diageo')), 
  (SELECT `alcoholID` FROM `Alcohols` WHERE `alcoholName` = 'Don Julio'), '20', 
  (SELECT SUM(`wholesalePrice` * 20) FROM `Alcohols` WHERE `alcoholName` = 'Don Julio')),
((SELECT `purchaseID` FROM `Purchases` WHERE `wholesalerID` = (SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Pernod Ricard')), 
  (SELECT `alcoholID` FROM `Alcohols` WHERE `alcoholName` = 'Malibu'), '10', 
  (SELECT SUM(`wholesalePrice` * 10) FROM `Alcohols` WHERE `alcoholName` = 'Malibu')),
((SELECT `purchaseID` FROM `Purchases` WHERE `wholesalerID` = (SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Pernod Ricard')), 
  (SELECT `alcoholID` FROM `Alcohols` WHERE `alcoholName` = 'Jameson'), '40', 
  (SELECT SUM(`wholesalePrice` * 40) FROM `Alcohols` WHERE `alcoholName` = 'Jameson')),
((SELECT `purchaseID` FROM `Purchases` WHERE `wholesalerID` = (SELECT `wholesalerID` FROM `Wholesalers` WHERE `name` = 'Beam Suntory')), 
  (SELECT `alcoholID` FROM `Alcohols` WHERE `alcoholName` = 'Jim Beam'), '30', 
  (SELECT SUM(`wholesalePrice` * 30) FROM `Alcohols` WHERE `alcoholName` = 'Jim Beam'));

SET FOREIGN_KEY_CHECKS=1;
COMMIT;


