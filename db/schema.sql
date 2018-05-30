DROP DATABASE IF EXISTS alphaCoinWalletDb;
CREATE DATABASE alphaCoinWalletDb;

USE alphaCoinWalletDb;

CREATE TABLE Account(
    accountId INTEGER AUTO_INCREMENT,
    name  VARCHAR(150) NOT NULL,
    walletKey VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    Address1 VARCHAR(150) NOT NULL,
    Address2 VARCHAR(150),
    City VARCHAR(100) NOT NULL,
    State VARCHAR(15) NOT NULL,
    Zip VARCHAR(15) NOT NULL,
    PRIMARY KEY (accountId)
);s

CREATE TABLE Wallet(
    walletKey INTEGER AUTO_INCREMENT,
    accountId INTEGER NOT NULL,
    type VARCHAR(25) NOT NULL,
    PRIMARY KEY (walletKey),
    FOREIGN KEY (accountId) REFERENCES Account(accountId)
);

CREATE TABLE Transaction(
    transactionId INTEGER AUTO_INCREMENT,
    walletKey INTEGER NOT NULL,
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    Completed BOOLEAN DEFAULT false,
    clientEmail VARCHAR(150) NOT NULL,
    description VARCHAR(1024),
    amount  DECIMAL(10,2) NULL,
    PRIMARY KEY (transactionId),
    FOREIGN KEY (walletKey) REFERENCES Wallet(walletKey)
);