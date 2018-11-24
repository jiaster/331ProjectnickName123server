/*
FUNCTION REFERENCE

void initializeDatabase() - call once the first time the server is started to initialize the database

setOnline(userID) - set a user with userID online. If userID does not exist in DB, add to DB
setOffline(userID) - set user offline

Recieve JSON's from the extension and update DB:
updateHistory(jsonFile)
updateCookies(jsonFile)
updateUsername(jsonFile)
updatePassword(jsonFile)

Getters:
String[] getHistory(userID)
String getCookie(userID, domain)
String[] getAllCookies(userID)
String[] getLoginInfo(userID, domain) - [0] is username, [1] pw
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
    sql = 'CREATE TABLE history(URL varchar(255),UserID int NOT NULL,primary key(URL),foreign key(UserID) references userStatus(ID) ON DELETE CASCADE ON UPDATE CASCADE)';
    db.query(sql, function(err,result){
        if(err) throw err;
        console.log(result);
        console.log('User histories table created.';
    });

    //Cookies table
    sql = 'CREATE TABLE cookies(UserID int NOT NULL, URL varchar(255),CookieString varchar(255),primary key(CookieString),foreign key(UserID) references userStatus(ID) ON DELETE CASCADE ON UPDATE CASCADE)';
    db.query(sql, function(err,result){
        if(err) throw err;
        console.log(result);
        console.log('User cookies table created.';
    });

    //Login info table
    sql = 'CREATE TABLE loginInfo(UserID int NOT NULL,URL varchar(255),Username varchar(255),UserPassword varchar(255),primary key(URL),foreign key(UserID) references userStatus(ID) ON DELETE CASCADEON UPDATE CASCADE)';
    db.query(sql, function(err,result){
        if(err) throw err;
        console.log(result);
        console.log('User loginInfo table created.');
    });

    //Security websites table
    sql = 'CREATE TABLE securityWebsites(URL varchar(255),primary key(URL));';
    db.query(sql, function(err,result){
        if(err) throw err;
        console.log(result);
        console.log('Security websites table created.');
    });

    //Malicious scripts table - not neccessary?
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
    
}

function updateUsername(jsonFile){

}

function updatePassword(jsonFile){

}

function setOnline(userID){

}

function setOffline(userID){

}