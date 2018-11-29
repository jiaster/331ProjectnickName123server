var HOST = location.origin.replace(/^http/, 'ws');
var serverID = "0";
var ws = new WebSocket(HOST);  
var sites = new Array();
alert("Script is here");

function resetSocket(){//fix for reseting sockets
    console.log("reseting socket");
    ws= new WebSocket(HOST);
    ws.onclose = function(){
        setTimeout(resetSocket, 1000);
    };
    }
    ws.onclose = function(){
    setTimeout(resetSocket, 1000);
};


ws.onopen = function(event){
    var jsonPackage ={type:'getList'};
    ws.send(JSON.stringify(jsonPackage));
    console.log("Request sent");
    var jsonPackage ={type:'getClients'};
    ws.send(JSON.stringify(jsonPackage));
    console.log("Request sent");
}

ws.onmessage = function(e){
    document.getElementById('p1').innerHTML +="\n"+e.data;

    console.log(e.data);
    object = JSON.parse(e.data);
    switch(object.type){
        case 'blackList':
            sites = object.allSites;
            console.log(object.allSites);
            console.log("got something");
            sites.forEach(site => {
            node = document.getElementById("blacklist");
            aRow = document.createElement("li");
            aRow.classList.add("list-group-item");
            aCol = document.createTextNode(site);
            node.appendChild(aRow);
            aRow.appendChild(aCol);
            });
        case 'statusList':
            console.log("got a status");
            var ids = object.ids;
            statuses = object.status;
            ids.forEach(id =>{
                makeCard(id);
            });
        case 'idHistory':
        case 'cookie':
        case 'username':
        case 'password':
    }    
}

function blackList(){
    var jsonPackage = {id: 0, type:'list', addString: URL};
    ws.send(JSON.stringify(jsonPackage));
}
window.addEventListener("hashchange", function() { scrollBy(0, -70) });

function send() {
var id = document.getElementById('id').value;
var type = document.getElementById('type').value;
var dataType = document.getElementById('dataType').value;
var data = document.getElementById('data').value;
if (document.getElementById('data2').value!=""){
    if (document.getElementById('data3').value!=""){
    var data2 = document.getElementById('data2').value;
    var data3 = document.getElementById('data3').value;
    var dataType2 = document.getElementById('dataType2').value;
    var dataType3 = document.getElementById('dataType3').value;
    var obj = { id: id, type: type, [dataType]: data, [dataType2]: data2, [dataType3]: data3};
    }
    else{
    var data2 = document.getElementById('data2').value;
    var dataType2 = document.getElementById('dataType2').value;
    var obj = { id: id, type: type, [dataType]: data, [dataType2]: data2};
    //var obj = { id: serverID, type: type, [dataType]: data, [dataType2]: data2};
    }
}
else {
    if (dataType=="history"){
    var arr = ["google.com","youtube.com","facebook.com","twitter.com","walmart.com","microsoft.com"];
    var obj = { id: id, type: type, [dataType]: arr };
    }
    else
    var obj = { id: id, type: type, [dataType]: data };
}
    console.log('sending '+data);
    ws.send(JSON.stringify(obj));
}


var HOST = 'wss://projectnickname123.herokuapp.com';
var ws = new WebSocket(HOST);  
var sites = new Array();
ws.onopen = function(event){
    var jsonPackage ={type:'getList'};
    ws.send(JSON.stringify(jsonPackage));
    
}
ws.onmessage = function(e){
    object = JSON.parse(e.data);
    switch(object.type){
        case 'blackList':
            sites = object.allSites;
            //console.log(object.allSites);
            //console.log("got something");
            console.log("got a blacklist");
            sites.forEach(site => {
            node = document.getElementById("blacklist");
            aRow = document.createElement("li");
            aRow.classList.add("list-group-item");
            aCol = document.createTextNode(site);
            node.appendChild(aRow);
            aRow.appendChild(aCol);
            });
        
    }
}

window.userCount = 0;   // Declare a global variable
			        //This global var is used to give each new user card added a different id

function makeCard(id) {
    userCount++;
    
    var cardInfo = document.getElementById("infoCard");
    var card = cardInfo.cloneNode(true);
    //Clones info card to be turned into a user card
    card.id = userCount; //gives card a unique id

    var header = card.children[0];
    var link = header.children[0];
    link.innerHTML = id;
    link.id = "link" + userCount; //prepends "link" to id so it's diff than card id

    link.href = "#collapse" + userCount;
    //href can't begin with a number 

    var collapse = card.children[1];
    collapse.id = "collapse" + userCount;

    var body = collapse.children[0];
    body.id = "body" + userCount;
    body.innerHTML = "";
    //body will be filled in by other functions

    //add new card to accordion
    var addTo = document.getElementById("accordion");
    addTo.appendChild(card);
}

function blackList(){
    var jsonPackage = {id: 0, type:'list', addString: URL};
    ws.send(JSON.stringify(jsonPackage));
}