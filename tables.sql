--
-- Group 80 “Worth A Shot”: Nicole Boose and Elsa Luthi
-- CS 340, Spring 2024
--

--
-- Description:
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
    UNIQUE(name),
    PRIMARY KEY (`wholesalerID`)
);

-- Creates Alcohols table that stores information different types of alcohol.
-- inventory: has to be updated with every sale and purchase, but unsure how to do that atm
CREATE TABLE `Alcohols` (
    `alcoholID` int(11) AUTO_INCREMENT NOT NULL,
    `alcoholName` varchar(255) NOT NULL,
    `alcoholType` varchar(255) NOT NULL,
    `alcoholPercentage` decimal(19,4) NOT NULL,
    `wholesalePrice` decimal(19,4) NOT NULL,
    `alcoholVolume` decimal(19,4) NOT NULL,
    `retailPrice` decimal(19,4) NOT NULL,
    `inventory` int(11),
    PRIMARY KEY (`alcoholID`)
);

-- Creates Emplpoyee table that stores information different employees in the organization.
CREATE TABLE `Employees` (
    `employeeID` int(11) AUTO_INCREMENT,
	`employeeName` varchar(255) NOT NULL,
    `startDate` date NOT NULL,
    `role` varchar(255) NOT NULL,
    PRIMARY KEY (`employeeID`)
);

-- Creates Sales table that stores information on an alcohol sale event.
-- Removed alcoholSalesID as it does not seem to be needed  if we can reference with Alcohols and Sales
-- Removed totalPrice becuase it was already in AlcoholSales(linePrice)
-- TotalCost: can be null for now, add all of the AlcoholSale(lineCost) together for the specific sale
CREATE TABLE `Sales` (
    `saleID` int(11) AUTO_INCREMENT,
    `employeeID` int(11) NOT NULL,
    `saleDate` date NOT NULL, -- Maybe do something like 'DEFAULT GETDATE()'
    `saleTime` time NOT NULL, -- Same as above but w/GETTIME()
    `totalCost` decimal(19,4),
    FOREIGN KEY (`employeeID`) REFERENCES `Employees`(`employeeID`),
    PRIMARY KEY (`saleID`)
);

-- Creates Purchases table that stores information on an alcohol purchasing event.
-- Moved totalCost to AlcoholPurchases
-- TotalPrice: can be null for now add all of the AlcoholPurchases(linePrice) together for the specific purchase.
CREATE TABLE `Purchases` (
    `purchaseID` int(11) AUTO_INCREMENT,
    `wholesalerID` int(11) NOT NULL,
    `paid` tinyint(1) NOT NULL DEFAULT 0,
    `deliveryDate` date NOT NULL,
    `delivered` tinyint(1) NOT NULL DEFAULT 0,
    `totalPrice` decimal(19,4),
    FOREIGN KEY (`wholesalerID`) REFERENCES `Wholesalers`(`wholesalerID`),
    PRIMARY KEY (`purchaseID`)
);

-- Creates AlcoholSales intersection table that stores information on the Sales of the Alcohols. 
-- Removed AlcoholSalesID is it necissary??
-- LinePrice: need to figure out how to make this based on AlcoholSales(quantitySold) * Alcohol(retailPrice)
-- renamed for consistency, for now it can be null until we figure it out
CREATE TABLE `AlcoholSales` ( 
    `saleID` int(11) NOT NULL,
    `alcoholID` int(11) NOT NULL,
    `quantitySold` int(11) NOT NULL,
    `linePrice` decimal(19,4) ,
    FOREIGN KEY (`alcoholID`) REFERENCES `Alcohols`(`alcoholID`),
    FOREIGN KEY (`saleID`) REFERENCES `Sales`(`saleID`),
    PRIMARY KEY (`saleID`, `alcoholID`)
);

-- Creates AlcoholPurchases intersection table that stores information on the Purchases of the Alcohols.
-- Removed AlcoholPurchaseID is it necissary?? 
-- QuantityPurchased: updated name for consistency
-- LineCost: need to figure out how to make this based on AlcoholPurchases(amount) * Alcohol(wholesalePrice)
CREATE TABLE `AlcoholPurchases` (
    `purchaseID` int(11) NOT NULL,
	`alcoholID` int(11) NOT NULL,
    `quantityPurchased` int(11) NOT NULL,
    `lineCost` decimal(19,4) NOT NULL,
    FOREIGN KEY (`alcoholID`) REFERENCES `Alcohols`(`alcoholID`),
    FOREIGN KEY (`purchaseID`) REFERENCES `Purchases`(`purchaseID`),
    PRIMARY KEY (`purchaseID`, `alcoholID`)
);
