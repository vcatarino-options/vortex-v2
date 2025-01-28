import { Socket } from 'socket.io-client'
export default class WebSocketService {
    readonly socket: Socket | null = null;

    public constructor(socket: Socket | null) {
        if (!socket) return
        
        this.socket = socket
    }

    public getRiskFree(callback: (r: unknown) => void): void {
        if (!this.socket) {
            console.error("WebSocketService.ts - getRiskFree: socket is null")
            return;
        }
        this.socket.emit('get_risk_free');
        this.socket.once('risk_free', r => callback(r));
    };
}