'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');


const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const WebSocket = require('ws');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

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
wss.on('connection', function connection(ws) {
    
    console.log('Client connected'+ws.id);
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        //ws.send(message);
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(ws.uuid+message);
            }
        });


    });

    wss.on('close', () => console.log('Client disconnected'));
});
