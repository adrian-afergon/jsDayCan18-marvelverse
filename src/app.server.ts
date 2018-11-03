import { createServer, Server } from 'http';
import * as express from 'express';
import * as SocketIo from 'socket.io';
import * as cors from 'cors';
import {AppRoutes} from "./app.routes";

export class AppServer {
    public static readonly PORT:number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIo.Server;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.setRoutes();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
        // AppRoutes.instanceRoutes(this.app);
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

    private setRoutes(): void {
        const options:cors.CorsOptions = {
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
            credentials: true,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            origin: true,
            preflightContinue: false
        };
        this.app.use(cors(options));
        AppRoutes.instanceRoutes(this.app);
        this.app.options("*", cors(options));
    }

    private getNumberOfClients() {
        const clients = this.io.clients();
        const connectedClientIds = Object.keys(clients.connected);
        return connectedClientIds.length;
    }

    private notifyPopulation () {
        this.io.sockets.emit('population', this.getNumberOfClients());
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {
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
                    if(connectedClientIds.indexOf(id) % 2 === 1) {
                        clients.connected[id].disconnect(true);
                    }
                });
                this.notifyPopulation();
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}