import { Socket } from 'socket.io-client'
import { TickerData } from '../../models/strategy';
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

    public getTickerChangeData(tickerData: TickerData, callback: any) {
        if (!this.socket) return;

        this.socket.emit('get_ticker_change_data', tickerData.rowId, tickerData.ticker, tickerData.type, tickerData.series, null);
        this.socket.on('ticker_change', (r) => { callback(r) })
    }

    public unsubscribeTicker = (ticker: string) => {
        if (!this.socket) return;
        this.socket.emit('unsubscribe_ticker', ticker);
    };

    public listenBookInfo = (ticker: string, callback: (r: unknown) => void) => {
        if (!this.socket) return;
        this.socket.on(`book_info/${ticker}`, r => callback(r));
    }

    public getTickerMargin = (ticker: string, callback: (r: unknown) => void) => {
        if (!this.socket) return;
        
        this.socket.emit('get_ticker_margin', ticker);
        this.socket.once(`ticker_margin/${ticker}`, callback)
    }
}