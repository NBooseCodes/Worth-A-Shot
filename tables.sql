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
CREATE TABLE `Alcohols` (
    `alcoholID` int(11) AUTO_INCREMENT,
	`alcoholName` varchar(255) NOT NULL,
    `alcoholType` varchar(255) NOT NULL,
    `alcoholPercentage` decimal(19,4) NOT NULL,
    `wholesalePrice` decimal(19,4) NOT NULL,
    `alcoholVolume` int(11) NOT NULL,
    `retailPrice` decimal(19,4) NOT NULL,
    -- has to be updated with every sale and purchase, but unsure how to do that atm
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
CREATE TABLE `Sales` (
    `saleID` int(11) AUTO_INCREMENT,
    -- Removed alcoholSalesID as it does not seem to be needed  if we can reference with Alcohols and Sales
	`employeeID` int(11) NOT NULL,
    -- Removed totalPrice becuase it was already in AlcoholSales(linePrice)
    `saleDate` date NOT NULL,
    `saleTime` time NOT NULL,
    -- can be null for now
    -- add all of the AlcoholSale(lineCost) together for the specific sale
    `totalCost` decimal(19,4),
    FOREIGN KEY `employeeID` REFERENCES `Employees`(`employeeID`),
    PRIMARY KEY (`saleID`)
);

-- Creates Purchases table that stores information on an alcohol purchasing event.
CREATE TABLE `Purchases` (
    `purchaseID` int(11) AUTO_INCREMENT,
    `wholesalerID` int(11) NOT NULL,
    -- Moved totalCost to AlcoholPurchases
	`paid` tinyint(1) NOT NULL,
    `deliveryDate` date NOT NULL,
    `delivered` tinyint(1) NOT NULL,
    -- can be null for now
    -- add all of the AlcoholPurchases(linePrice) together for the specific purchase.
    `totalPrice` decimal(19,4),
    FOREIGN KEY (`wholesalerID`) REFERENCES `Wholesalers`(`wholesalerID`),
    PRIMARY KEY (`purchaseID`)
);

-- Creates AlcoholSales intersection table that stores information on the Sales of the Alcohols. 
CREATE TABLE `AlcoholSales` (
    -- Removed AlcoholSalesID is it necissary?? 
    `saleID` int(11) NOT NULL,
	`alcoholID` int(11) NOT NULL,
    `quantitySold` int(11) NOT NULL,
    -- need to figure out how to make this based on AlcoholSales(quantitySold) * Alcohol(retailPrice)
    -- renamed for consistency, for now it can be null until we figure it out
    `linePrice` decimal(19,4) ,
    FOREIGN KEY (`alcoholID`) REFERENCES `Alcohols`(`alcoholID`),
    FOREIGN KEY (`saleID`) REFERENCES `Sales`(`saleID`),
    PRIMARY KEY (`saleID`, `alcoholID`)
);

CREATE TABLE `AlcoholPurchases` (
    -- Removed AlcoholPurchaseID is it necissary?? 
    `purchaseID` int(11) NOT NULL,
	`alcoholID` int(11) NOT NULL,
    -- updated name for consistency
    `quantityPurchased` int(11) NOT NULL,
    -- need to figure out how to make this based on AlcoholPurchases(amount) * Alcohol(wholesalePrice)
    `lineCost` decimal(19,4) NOT NULL,
    FOREIGN KEY (`alcoholID`) REFERENCES `Alcohols`(`alcoholID`),
    FOREIGN KEY (`purchaseID`) REFERENCES `Purchases`(`purchaseID`),
    PRIMARY KEY (`purchaseID`, `alcoholID`)
);
