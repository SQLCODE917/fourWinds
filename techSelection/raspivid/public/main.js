var WSavcPlayer = require('../vendor');
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var uri = "ws://" + document.location.host;
var wsavc = new WSavcPlayer(canvas, "webgl", 1, 35);
wsavc.connect(uri);
window.wsavc = wsavc;     
