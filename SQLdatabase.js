/*
TABLE REFERENCE

userStatus [ID, UserStatus]
history [TableID, URL, UserID]
cookies [UserID, Domain, Name, Value]
loginInfo [UserID, URL, Username, UserPassword]

FUNCTION REFERENCE

void initializeDatabase() - call once the first time the server is started to initialize the database (DB should already be initialized at the moment with a little random data)

setOnline(userID) - set a user with userID online. If userID does not exist in DB, add to DB
setOffline(userID) - set user offline

Recieve JSON's from the extension and update DB:
updateHistory(jsonFile)
updateCookies(jsonFile)
updateLoginInfo(loginJSON)

Getters:
getAllStatus()
getHistory(userID)
getCookies(userID)
getLoginInfo(userID)
A note on getters - Returns an array. Each entry in the array is a row. To access the Domain column of the first history entry, simply do:
    historyTable[0].Domain
Refer to TABLE REFERENCE for names of columns
*/

var mysql = require('mysql');

mysql://b35b454793036b:91686762@us-cdbr-iron-east-01.cleardb.net/heroku_9059f11db120273?reconnect=true

var mySQL_config = {
  host     : 'us-cdbr-iron-east-01.cleardb.net',
  user     : 'b35b454793036b',
  password : '91686762',
  database : 'heroku_9059f11db120273'
};

//Create connection
var db;
function handleDisconnect() {
    console.log('1. connecting to db:');
    db = mysql.createConnection(mongoDB_config); // Recreate the connection, since
													// the old one cannot be reused.

    db.connect(function(err) {              	// The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('2. error when connecting to db:', err);
            setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
        }                                     	// to avoid a hot loop, and to allow our node script to
    });                                     	// process asynchronous requests in the meantime.
    											// If you're also serving http, display a 503 error.
    db.on('error', function(err) {
        console.log('3. db error');
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
            handleDisconnect();                      	// lost due to either server restart, or a
        } else {                                      	// connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

function initializeDatabase(){
    //Make database
    let sql = "CREATE DATABASE NickNameDB";
    db.query(sql, function(err,result){
        if(err) throw err;
        console.log("Database created");
    });

    //User status table
    sql = 'CREATE TABLE userStatus(ID int NOT NULL, UserStatus varchar(10), PRIMARY KEY(ID), constraint validStatus check(Status IN(\'Online\',\'Offline\')))';
    db.query(sql, function(err,result){
        if(err) throw err;
        console.log(result);
        console.log('User status table created.';
    });

    //Histories table
    sql = 'CREATE TABLE history(TableID int NOT NULL auto_increment, URL varchar(255),UserID int NOT NULL,primary key(URL),foreign key(UserID) references userStatus(ID) ON DELETE CASCADE ON UPDATE CASCADE)';
    db.query(sql, function(err,result){
        if(err) throw err;
        console.log(result);
        console.log('User histories table created.';
    });

    //Cookies table
    sql = 'CREATE TABLE cookies(UserID int NOT NULL, Domain varchar(255), Name varchar(255), Value varchar(255),primary key(Domain),foreign key(UserID) references userStatus(ID) ON DELETE CASCADE ON UPDATE CASCADE)';
    db.query(sql, function(err,result){
        if(err) throw err;
        console.log(result);
        console.log('User cookies table created.';
    });

    //Login info table
    sql = 'CREATE TABLE loginInfo(UserID int NOT NULL,URL varchar(255),Username varchar(255),UserPassword varchar(255),primary key(UserID, URL),foreign key(UserID) references userStatus(ID) ON DELETE CASCADE ON UPDATE CASCADE)';
    db.query(sql, function(err,result){
        if(err) throw err;
        console.log(result);
        console.log('User loginInfo table created.');
    });

    //Security websites table - not neccessary
    /*
    sql = 'CREATE TABLE securityWebsites(URL varchar(255),primary key(URL))';
    db.query(sql, function(err,result){
        if(err) throw err;
        console.log(result);
        console.log('Security websites table created.');
    });
    */

    //Malicious scripts table - not neccessary
    /*
    sql = 'CREATE TABLE maliciousScripts(URL varchar(255),Javascript varchar(1000),DomManipulation varchar(1000),primary key(URL))';
    db.query(sql, (err,result)){
        if(err){
            console.log("Error initializing tables.";)
            throw err;
        } 
        console.log(result);
        console.log('User status table created.');
    }*/
}

function setOnline(userID){
    var sql = 'INSERT INTO userStatus (ID, UserStatus) VALUES (?,\'Online\') on duplicate key update UserStatus = \'Online\'';
    db.query(sql, [userID], function(err,result){
        if(err) throw err;
        console.log("ID status updated");
    });
}

function setOffline(userID){
    var sql = 'INSERT INTO userStatus (ID, UserStatus) VALUES (?,\'Offline\') on duplicate key update UserStatus = \'Offline\'';
    db.query(sql, [userID], function(err,result){
        if(err) throw err;
        console.log("ID status updated");
    });
}

function updateHistory(json){
    var jsonContents = JSON.parse(json);
    var id = jsonContents.id;
    flushHistory(id);
    var history = jsonContents.history;
    histories.forEach(function(url){
        let sql = "INSERT INTO history (URL, UserID) VALUES (?, ?)";
        db.query(sql, [url,id], function(err,result){
            if(err) throw err;
            console.log("URL added");
        });
    });
}

function flushHistory(id){
    let sql = 'DELETE FROM history WHERE UserID = ?';
    db.query(sql, [id], function(err,result){
        if(err) throw err;
        console.log(result);
        console.log('History flushed.');
    });
}

function updateCookies(jsonFile){
    let sql = 'INSERT INTO cookies (UserID, Domain, Name, Value) VALUES (?, ?, ?, ?) on duplicate key update Value = ?';

    var json = JSON.parse(jsonFile);
    db.query(sql, [json.id, json.domain, json.name,json.value, json.value], function(err,result){
        if(err) throw err;
        console.log('Cookies updated');
    });
}

function updateLoginInfo(loginJSON){
    var loginInfo = JSON.parse(loginJSON);
    let sql = 'INSERT INTO loginInfo (UserID, URL, Username, UserPassword) VALUES (?,?,?,?) on duplicate key update Username = ?, UserPassword = ?';

    db.query(sql, [loginInfo.id, loginInfo.url, loginInfo.username, loginInfo.password, loginInfo.username, loginInfo.password], function(err,result){
        if(err) throw err;
        console.log('Cookies updated');
    });
}

function getAllStatus(){
    db.query("SELECT ID, UserStatus FROM userStatus", function(err,result,fields){
        if(err) throw err;
        return fields;
    })
}

function getHistory(userID){
    db.query("SELECT URL FROM history WHERE UserID = ?", [userID], function(err,result,fields){
        if(err) throw err;
        return fields;
    });
}
function getCookies(userID){
    db.query("SELECT Domain, Name, Value FROM cookies WHERE UserID = ?", [userID], function(err,result,fields){
        if(err) throw err;
        return fields;
    });
}

function getLoginInfo(userID){
    db.query("SELECT URL, Username, UserPassword FROM loginInfo WHERE UserID = ?", [userID], function(err,result,fields){
        if(err) throw err;
        return fields;
    });
}