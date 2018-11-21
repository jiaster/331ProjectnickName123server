'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
var mysql = require('mysql');



const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const WebSocket = require('ws');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

var app = express();
const wss = new SocketServer({ server });
/*
wss.on('connection', function open() {



  console.log('Client connected');
  wss.on('close', () => console.log('Client disconnected'));
});

wss.on('message', function incoming(data) {
    console.log("WebSocket message received:", event);
    wss.clients.forEach((client) => {
        client.send(data);
    });
});
*/
mysql://b35b454793036b:91686762@us-cdbr-iron-east-01.cleardb.net/heroku_9059f11db120273?reconnect=true

var db_config = {
  host     : 'us-cdbr-iron-east-01.cleardb.net',
  user     : 'b35b454793036b',
  password : '91686762',
  database : 'heroku_9059f11db120273'
};

var connection;

function handleDisconnect() {
    console.log('1. connecting to db:');
    connection = mysql.createConnection(db_config); // Recreate the connection, since
													// the old one cannot be reused.

    connection.connect(function(err) {              	// The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('2. error when connecting to db:', err);
            setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
        }                                     	// to avoid a hot loop, and to allow our node script to
    });                                     	// process asynchronous requests in the meantime.
    											// If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('3. db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
            handleDisconnect();                      	// lost due to either server restart, or a
        } else {                                      	// connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();


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
            break;
        }
        console.log(message);
        ws.id = data.id;

        onlineClientsIDS.push(ws.id);//checks to see if client is on online list, if not add it to lsit
        if (onlineClientsIDS.indexOf(ws.id) === -1) 
            array.push(newItem)
        else
            console.log("id is already online");

        //var id  = data.id;
        var type = data.type;
        /*
        if (type == 'history')//history list

        if (type == 'cookie')//cookie

        if (type == 'username')//username

        if (type == 'password')//password
*/

        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });


    });

    wss.on('close', () => console.log('Client disconnected'));
});
