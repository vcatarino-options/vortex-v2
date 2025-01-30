import { TickerMonitorData } from "../../models/strategy";
import StorageService from "../storage/StorageService";
import { stockList } from "../../utils/stockList";
export default class ManagerTickerMonitor {

    static updateTickerMonitorData = (currentTicker: string, newTicker: string, operationId: string) => {
        if (!stockList.includes(newTicker)) return;

        if (currentTicker) {
            ManagerTickerMonitor.deleteTickerOnTheMonitor(currentTicker, operationId);
        }
        ManagerTickerMonitor.addTickerOnTheMonitor(newTicker, operationId);
    }



    static deleteTickerOnTheMonitor = (ticker: string, operationId: string) => {
        const strTickerMonitor: string | null = StorageService.get(StorageService.KEYS.TOKENMONITOR)
        const tickerMonitor: Record<string, TickerMonitorData> = JSON.parse(strTickerMonitor as string)
        const opsId = tickerMonitor[ticker].operationsId
        const updatedOperations = opsId.filter(id => id !== operationId)
        tickerMonitor[ticker].operationsWatchingTicker = updatedOperations.length
        tickerMonitor[ticker].operationsId = updatedOperations

        const str = JSON.stringify(tickerMonitor)
        StorageService.set(StorageService.KEYS.TOKENMONITOR, str)
        return tickerMonitor
    }

    static addTickerOnTheMonitor = (ticker: string, operationId: string) => {
        const strTickerMonitor: string | null = StorageService.get(StorageService.KEYS.TOKENMONITOR)
        const tickerMonitor: Record<string, TickerMonitorData> | null = JSON.parse(strTickerMonitor as string)
        const isObserved = ManagerTickerMonitor.isTickerObserved(ticker)
        let updatedTickerMonitor = JSON.parse(JSON.stringify(tickerMonitor))
        if (!isObserved) {

            const newTickerMonitor = {
                [ticker]: {
                    operationsWatchingTicker: 1,
                    operationsId: [operationId]
                }
            }
            updatedTickerMonitor = { ...tickerMonitor, ...newTickerMonitor }
        } else {
            if (!ManagerTickerMonitor.isOperationIncluded(operationId, updatedTickerMonitor[ticker].operationsId)) {
                updatedTickerMonitor[ticker].operationsWatchingTicker++
                updatedTickerMonitor[ticker].operationsId.push(operationId)
            }
        }
        const str = JSON.stringify(updatedTickerMonitor)
        StorageService.set(StorageService.KEYS.TOKENMONITOR, str)
        return updatedTickerMonitor
    }

    static isTickerObserved = (ticker: string) => {
        const strTickerMonitor: string | null = StorageService.get(StorageService.KEYS.TOKENMONITOR)
        const tickerMonitor: Record<string, TickerMonitorData> | null = JSON.parse(strTickerMonitor as string)

        if (!tickerMonitor) return false

        const keys: string[] = Object.keys(tickerMonitor)
        return keys.includes(ticker)
    }

    static isOperationIncluded = (operationId: string, operationIdList: string[]) => {
        return operationIdList.includes(operationId)
    }



    static shouldKeepObservingTicker = (ticker: string) => {
        const strTickerMonitor: string | null = StorageService.get(StorageService.KEYS.TOKENMONITOR)
        if (!strTickerMonitor) return false

        const tickerMonitor: Record<string, TickerMonitorData> = JSON.parse(strTickerMonitor)
        if (Object.keys(tickerMonitor).length === 0) return false

        const stock = tickerMonitor[ticker]
        return stock.operationsWatchingTicker > 0 && stock.operationsId.length > 0
    }

    static updateStorage = (tickerMonitor: Record<string, TickerMonitorData>) => {
        const str = JSON.stringify(tickerMonitor)
        StorageService.set(StorageService.KEYS.TOKENMONITOR, str)
    }
} 