const http = require('http');
const express = require('express');
const raspivid = require('raspivid');
const WebSocketServer = require('ws').Server;
const Splitter = require('stream-split');

const NALseparator = new Buffer([0,0,0,1]);

class Server {
    constructor(server, _options) {
        this.RPiOptions = {
                    timeout:0,
                    profile:'baseline',
                    width:960,
                    height:540,
                    framerate:30,
                    vflip:'',
                    bitrate:8000000,
                    exposure:'auto'
        };

        if(_options) {
            this.RPiOptions = Object.assign(this.RPiOptions, _options);
        }

        this.webSocketServer = new WebSocketServer({server: server});
        this.webSocketServer.on('connection', (socket) => {
            this.newClient(socket);
        });
    }

    getFeed() {
        var video = raspivid(this.RPiOptions);
        return video;
    }
    
    startFeed() {
        var readStream = this.getFeed();
        this.readStream = readStream;
        readStream = readStream.pipe(new Splitter(NALseparator));
        readStream.on("data", (data) => {
            this.broadcast(data);
        });
    }
    
    newClient(socket) {
        console.log("\tServer.newClient");
        var self = this;

        socket.send(JSON.stringify({
            action: "init",
            width: self.RPiOptions.width,
            height: self.RPiOptions.height
        }));

        socket.on("message", (data) => {
            const action = data.split(' ')[0];
            console.log(`\tIncoming action: ${action}`);

            if(action === "REQUESTSTREAM") {
                self.startFeed();        
            } else if(action === "STOPSTREAM") {
                self.readStream.pause();
            }
        });

        socket.on("close", () => {
            self.readStream.end();
            console.log("\tStopping client interval");
        });
    }

    broadcast(data) {
        this.webSocketServer.clients.forEach((socket) => {
            if (socket.busy) {
                return;
            }

            socket.buzy = false;

            socket.send(Buffer.concat([NALseparator, data]),
            //socket.send(data,
                {binary: true},
                (error) => {
                    console.log("Socket Error!");
                    console.log(error);
                }
            );
        });
    }
}

const app = express();
app.use(express.static(__dirname + '/public'));
const server = http.createServer(app);
const fourWinds = new Server(server);
server.listen(8080);
