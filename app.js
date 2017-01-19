// Chargement de la page index.html
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ent = require('ent');
var fs = require('fs');

var server_port =  8000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP|| "127.0.0.1" ;

/*if (typeof  === "undefined") {
  //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
  //  allows us to run/test the app locally.
  console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
  self.ipaddress = "127.0.0.1";
}*/






/** ROUTAGE **/
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/html/index.html');
  app.use(express.static('public'));
});
app.get('/index', function (req, res) {
  res.sendFile(__dirname + '/html/index.html');
  app.use(express.static('public'));
});
app.get('/accueil', function (req, res) {
  res.sendFile(__dirname + '/html/index.html');
  app.use(express.static('public'));
});
app.get('/jouerAmi', function (req, res) {
  res.sendFile(__dirname + '/html/jouerAmi.html');
  app.use(express.static('public'));
});
app.get('/classement', function (req, res) {
  res.sendFile(__dirname + '/html/classement.html');
  app.use(express.static('public'));
});
app.get('/regles', function (req, res) {
  res.sendFile(__dirname + '/html/regles.html');
  app.use(express.static('public'));
});
app.get('/aPropos', function (req, res) {
  res.sendFile(__dirname + '/html/aPropos.html');
  app.use(express.static('public'));
});
/** FIN ROUTAGE **/



io.sockets.on('connection', function(socket){
  // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
  Pioche = new Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],[9,9,8,8,7,8,6,6,4,4,3,3,2,2,1,1]);
  socket.on('verifpseudo', function(pseudo){
    var regex = /^[^0-9][^@#]+$/;
    var found = pseudo.match(regex);
    if(pseudo.charAt(0) != pseudo.charAt(0).toUpperCase())
    {
      var pseudo2 = pseudo.charAt(0).toUpperCase() + pseudo.slice(1);
    }
    else
    {
      var pseudo2 = pseudo;
    }
    socket.emit('verifpseudo',found,pseudo2);

  });

  socket.on('pseudovalide',function(pseudo2){
    var userIndex = -1;
    var users = [];
    for (i = 0; i < users.length; i++) {
      if (users[i] === pseudo) {
        userIndex = i;
      }
    }
    if (pseudo2 !== undefined && userIndex === -1) { // S'il est bien nouveau
    // Sauvegarde de l'utilisateur et ajout à la liste des connectés
    users.push(pseudo2);
    console.log(users);
  }
});
socket.on('idelements', function(elemDropped, destination, value) {
  console.log("Event idelements send on server");
  console.log(value);
  socket.broadcast.emit('idelements',elemDropped,destination, value);

});
// Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
});

/*io.sockets.on('connection', function (socket, pseudo) {
// Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
socket.on('nouveau_client', function(pseudo) {
pseudo = ent.encode(pseudo);
socket.pseudo = pseudo;
socket.broadcast.emit('nouveau_client', pseudo);
});

// Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
socket.on('message', function (message) {
message = ent.encode(message);
socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
});
});*/

//server.listen(port,ip);
//console.log('Server running on http://%s:%s', ip, port);
server.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", port " + server_port )
});
server.exports = app ;
