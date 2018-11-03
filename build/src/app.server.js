"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express = require("express");
const SocketIo = require("socket.io");
const cors = require("cors");
const app_routes_1 = require("./app.routes");
class AppServer {
    constructor() {
        this.createApp();
        this.config();
        this.cors();
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
    cors() {
        const options = {
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
            credentials: true,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            preflightContinue: false
        };
        this.app.use(cors(options));
        app_routes_1.AppRoutes.instanceRoutes(this.app);
        this.app.options("*", cors(options));
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
                    if (connectedClientIds.indexOf(id) % 2 === 1) {
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
//# sourceMappingURL=app.server.js.map