CREATE TABLE userStatus(ID int NOT NULL, UserStatus varchar(10), PRIMARY KEY(ID), constraint validStatus check(Status IN('Online','Offline')));

CREATE TABLE history(TableID int NOT NULL auto_increment, URL varchar(255),UserID int NOT NULL,primary key(TableID),foreign key(UserID) references userStatus(ID) ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE cookies(UserID int NOT NULL, Domain varchar(255), Name varchar(255), Value varchar(255),primary key(UserID, Domain, Name),foreign key(UserID) references userStatus(ID) ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE loginInfo(UserID int NOT NULL,URL varchar(255),Username varchar(255),UserPassword varchar(255),primary key(UserID, URL),foreign key(UserID) references userStatus(ID) ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE securityWebsites(URL varchar(255),primary key(URL));

INSERT INTO userStatus (ID, UserStatus) VALUES ('111','Online') on duplicate key update UserStatus = 'Online';
INSERT INTO userStatus (ID, UserStatus) VALUES ('222','Offline') on duplicate key update UserStatus = 'Offline';

INSERT INTO history(URL, UserID) VALUES ('fb.com', 222);

DELETE FROM history WHERE UserID = 111;

INSERT INTO cookies (UserID, Domain, Name, Value) VALUES (111, 'google.com', 'google_cookie', 'h329djg93ja2') on duplicate key update Value = 'UPDATEDCOOKIE';

INSERT INTO loginInfo (UserID, URL, Username, UserPassword) VALUES ('111','google.com','bob23','nickname123') on duplicate key update Username='newUser', UserPassword='newPass'


