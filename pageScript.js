var HOST = 'wss://projectnickname123.herokuapp.com';
var ws = new WebSocket(HOST);  
var sites = new Array();
ws.onopen = function(event){
    var jsonPackage ={type:'getList'};
    ws.send(JSON.stringify(jsonPackage));
    var jsonPackage ={type:'getClients'};
    ws.send(JSON.stringify(jsonPackage));
    console.log("Request sent");
}
ws.onmessage = function(e){
    object = JSON.parse(e.data);
    switch(object.type){
        case 'blackList':
            sites = object.allSites;
            //console.log(object.allSites);
            //console.log("got something");
            sites.forEach(site => {
            node = document.getElementById("blacklist");
            aRow = document.createElement("li");
            aRow.classList.add("list-group-item");
            aCol = document.createTextNode(site);
            node.appendChild(aRow);
            aRow.appendChild(aCol);
            });
        case 'statusList':
            ids = object.ids;
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

window.addEventListener("hashchange", function() { scrollBy(0, -70) });

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