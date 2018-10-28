import { createServer, Server } from 'http';
import * as express from 'express';
import * as SocketIo from 'socket.io';

export class AppServer {
    public static readonly PORT:number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIo.Server;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || AppServer.PORT;
    }

    private sockets(): void {
        this.io = SocketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });

            socket.on('snap', () => {
                const clients = this.io.clients();
                const connectedClientIds = Object.keys(clients.connected);
                connectedClientIds.forEach((id) => {
                    console.log('id:', id, connectedClientIds.indexOf(id) % 2 === 0);
                    if(connectedClientIds.indexOf(id) % 2 === 0) {
                        clients.connected[id].disconnect(true);
                    }
                });
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}