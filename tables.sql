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
    `totalPrice` decimal(19,4) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (`employeeID`) REFERENCES `Employees`(`employeeID`),
    PRIMARY KEY (`saleID`)
);

-- Creates Purchases table that stores information on an alcohol purchasing transaction.
-- TotalPrice: add all of the AlcoholPurchases(lineCost) together for the specific purchase.
CREATE TABLE `Purchases` (
    `purchaseID` int(11) AUTO_INCREMENT,
    `wholesalerID` int(11) NOT NULL,
	`paid` tinyint(1) NOT NULL DEFAULT 0,
    `deliveryDate` date NOT NULL,
    `delivered` tinyint(1) NOT NULL DEFAULT 0,
    `totalCost` decimal(19,4) NOT NULL DEFAULT 0.00,
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
