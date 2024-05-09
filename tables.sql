SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

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


-- Creates Purchases table that stores information on an alcohol purchasing event.
-- Moved totalCost to AlcoholPurchases
-- TotalPrice: can be null for now add all of the AlcoholPurchases(linePrice) together for the specific purchase.
CREATE OR REPLACE TABLE `Purchases` (
    `purchaseID` int(11) AUTO_INCREMENT,
    `wholesalerID` int(11) NOT NULL,
    `employeeID` int(11) NOT NULL,
	`paid` tinyint(1) DEFAULT 0,
    `deliveryDate` date NOT NULL,
    `delivered` tinyint(1) DEFAULT 0,
    `totalCost` decimal(19,4),
    PRIMARY KEY (`purchaseID`),
    FOREIGN KEY (`wholesalerID`) REFERENCES `Wholesalers`(`wholesalerID`) ON DELETE SET NULL,
    FOREIGN KEY (`employeeID`) REFERENCES `Employees`(`employeeID`) ON DELETE SET NULL
);

-- Creates AlcoholPurchases intersection table that stores information on the Purchases of the Alcohols.
-- Removed AlcoholPurchaseID is it necissary?? 
-- QuantityPurchased: updated name for consistency
-- LineCost: need to figure out how to make this based on AlcoholPurchases(amount) * Alcohol(wholesalePrice)
CREATE OR REPLACE TABLE `AlcoholPurchases` (
	`alcoholPurchaseID` int(11) AUTO_INCREMENT,
    `purchaseID` int(11) NOT NULL,
	`alcoholID` int(11) NOT NULL,
    `quantityPurchased` int(11) NOT NULL,
    `lineCost` decimal(19,4) NOT NULL,
    FOREIGN KEY (`alcoholID`) REFERENCES `Alcohols`(`alcoholID`),
    FOREIGN KEY (`purchaseID`) REFERENCES `Purchases`(`purchaseID`) ON DELETE CASCADE,
    PRIMARY KEY (`alcoholPurchaseID`)
);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
