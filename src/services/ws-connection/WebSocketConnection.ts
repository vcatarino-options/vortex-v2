import { io, Socket } from 'socket.io-client'
import StorageService from '../storage/StorageService';
// const VORTEX_SERVER_HOST = 'http://34.121.205.167/'
const VORTEX_SERVER_HOST = import.meta.env.VITE_VORTEX_SERVER
// 'http://34.95.213.62:80'
// const VORTEX_SERVER_HOST = "f8be-200-201-185-202.ngrok-free.app"

export default class WebSocketConnection {
    private static instance: WebSocketConnection | null = null;
    private socket: Socket | null = null;

    private constructor() { }

    public static getInstance(): WebSocketConnection {
        if (!this.instance) {
            this.instance = new WebSocketConnection();
        }
        return this.instance;
    }

    public connect(): void {
        if (this.socket) {
            console.warn('WebSocket already connected.');
            return;
        }
        const userToken = StorageService.getUserToken()
        this.socket = io(`${VORTEX_SERVER_HOST}`, {
            path: '/pricer_server/',
            transports: ['websocket'],
            auth: {
                token: userToken,
            },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        this.registerEvents();
    }

    public disconnect(): void {
        if (!this.socket) {
            console.warn('No WebSocket connection to disconnect.');
            return;
        }

        this.socket.disconnect();
        this.socket = null;
    }

    private registerEvents(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('WebSocket connected.');
        });

        this.socket.on('connect_error', () => {
            console.log(`Unable to establish a WebSocket connection [${VORTEX_SERVER_HOST}/pricer_server/]`);
        });


        this.socket.on('disconnect', () => {
            console.log('WebSocket disconnected.');
        });

        this.socket.on('reconnect_attempt', (attemptNumber: number) => {
            console.log(`Reconnection attempt number: ${attemptNumber}`);
        });

        this.socket.on('reconnect', () => {
            console.log('WebSocket reconnected.');
        });

        this.socket.on('reconnect_error', (error: Error) => {
            console.error('Error while attempting to reconnect: ', error);
        });

        this.socket.on('reconnect_failed', () => {
            console.error('Failed to reconnect after multiple attempts');
        });
    }

    public getSocket(): Socket | null {
        return this.socket;
    }
}