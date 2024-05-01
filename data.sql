--
-- Group 80 “Worth A Shot”: Nicole Boose and Elsa Luthi
-- CS 340, Spring 2024
--
-- Description:
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


