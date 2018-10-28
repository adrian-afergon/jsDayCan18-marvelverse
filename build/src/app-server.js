"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express = require("express");
const SocketIo = require("socket.io");
class AppServer {
    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }
    createApp() {
        this.app = express();
    }
    createServer() {
        this.server = http_1.createServer(this.app);
    }
    config() {
        this.port = process.env.PORT || AppServer.PORT;
    }
    sockets() {
        this.io = SocketIo(this.server);
    }
    getNumberOfClients() {
        const clients = this.io.clients();
        const connectedClientIds = Object.keys(clients.connected);
        return connectedClientIds.length;
    }
    notifyPopulation() {
        this.io.sockets.emit('population', this.getNumberOfClients());
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on('connect', (socket) => {
            console.log('Connected client on port %s.', this.port);
            this.notifyPopulation();
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
            socket.on('snap', () => {
                const clients = this.io.clients();
                const connectedClientIds = Object.keys(clients.connected);
                connectedClientIds.forEach((id) => {
                    console.log('id:', id, connectedClientIds.indexOf(id) % 2 === 0);
                    if (connectedClientIds.indexOf(id) % 2 === 0) {
                        clients.connected[id].disconnect(true);
                    }
                });
                this.notifyPopulation();
            });
        });
    }
    getApp() {
        return this.app;
    }
}
AppServer.PORT = 8080;
exports.AppServer = AppServer;
//# sourceMappingURL=app-server.js.map