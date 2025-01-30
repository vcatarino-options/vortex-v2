import { TickerMonitorData } from "../../models/strategy";
import StorageService from "../storage/StorageService";

export default class ManagerTickerMonitor {
    static isTickerObserved = (ticker: string) => {
        const strTickerMonitor: string | null = StorageService.get(StorageService.KEYS.TOKENMONITOR)
        const tickerMonitor: Record<string, TickerMonitorData> | null = JSON.parse(strTickerMonitor as string)

        if (!tickerMonitor) return false

        const keys: string[] = Object.keys(tickerMonitor)
        return keys.includes(ticker)
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
    static isOperationIncluded = (operationId: string, operationIdList: string[]) => {
        return operationIdList.includes(operationId)
    }

    static deleteTickerOnTheMonitor = (ticker: string, operationId: string, tickerMonitor: Record<string, TickerMonitorData>) => {
        const opsId = tickerMonitor[ticker].operationsId
        let clonedTickerMonitor = JSON.parse(JSON.stringify(tickerMonitor))
        const updatedOperations = opsId.filter(id => id !== operationId)
        clonedTickerMonitor[ticker].operationsWatchingTicker--
        clonedTickerMonitor[ticker].operationsId = updatedOperations
        return clonedTickerMonitor
    }

    static shouldKeepObservingTicker = (ticker: string, tickerMonitor: Record<string, TickerMonitorData>) => {
        const stock = tickerMonitor[ticker]
        return stock.operationsWatchingTicker > 0 && stock.operationsId.length > 0
    }

    static updateStorage = (tickerMonitor: Record<string, TickerMonitorData>) => {
        const str = JSON.stringify(tickerMonitor)
        StorageService.set(StorageService.KEYS.TOKENMONITOR, str)
    }
} 