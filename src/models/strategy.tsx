export interface Strategy {
    id: string,
    name: string
}

export interface FinancialSummary {
    optionPrice: string | null
    estimatedMargin: string | null
}

export interface TickerMonitorData {
    operationsWatchingTicker: number,
    operationsId: string[]
}

export const createEmptyStrategy = () => {
    const strategy: Strategy = {
        id: "",
        name: ""
    }
    return strategy
}

export interface StockData {
    id: string,
    activeName: string,
    strategyId: string,
    stockName: string,
    orderType: OrderType,
    optionType: OptionType,
    quantity: string,
    workingDays: string,
    strike: string,
    strikes: string[]
    serie: string
    series: string[]
}

export type Order = {
    volatility: number;
    strPrice: string;
    strStrike: string;
    workingDays: string;
    fee: number;
    type: OptionType;
    direction: boolean;
};

export interface OptionData {
    id: string,
    optionIn: OptionIn,
    optionOut: OptionOut
    price: string
}

export interface OptionIn {
    costVolatility?: string,
    bandCost: string,
    cost: string,
}

export interface OptionOut {
    salesVolatility?: string,
    bandSales: string,
    sales: string,
}

export interface OptionGreek {
    delta: string,
    gama: string,
    theta: string,
    vega: string,
    rho: string,
}

export interface TickerData {
    rowId: string,
    ticker: string,
    type: OptionType,
    series?: string,
    price?: string
}

export const createOptionIn = (data?: Partial<OptionIn>): OptionIn => {
    return {
        costVolatility: data?.costVolatility || "0.0",
        bandCost: data?.bandCost || "0.0",
        cost: data?.cost || "0.0",
    };
}

export const createOptionOut = (data?: Partial<OptionOut>): OptionOut => {
    return {
        salesVolatility: data?.salesVolatility || "0.0",
        bandSales: data?.bandSales || "0.0",
        sales: data?.sales || "0.0",
    };
}

export const createOptionGreek = (data?: Partial<OptionGreek>): OptionGreek => {
    return {
        delta: data?.delta || "0.0",
        gama: data?.gama || "0.0",
        theta: data?.theta || "0.0",
        vega: data?.vega || "0.0",
        rho: data?.rho || "0.0",
    };
}

export const createStockData = (data?: Partial<StockData>): StockData => {
    return {
        id: data?.id || "",
        activeName: data?.activeName || "",
        strategyId: data?.strategyId || "",
        stockName: data?.stockName || "",
        orderType: data?.orderType || OrderTypeName.BUY,
        optionType: data?.optionType || "CALL",
        quantity: data?.quantity || "0",
        workingDays: data?.workingDays || "0",
        strike: data?.strike || "",
        serie: data?.serie || "",
        strikes: data?.strikes || [],
        series: data?.series || [],
        // volatility: data?.volatility || "0.0",
        // price: data?.price || "0.0",
        // result: data?.result || "0.0",
        // optionGreek: createOptionGreek(data?.optionGreek),
    };
}

export const createOptionData = (data?: Partial<OptionData>): OptionData => {
    return {
        id: data?.id || "",
        optionIn: createOptionIn(data?.optionIn),
        optionOut: createOptionOut(data?.optionOut),
        price: data?.price || "0"
    }
}

export type OptionType = "CALL" | "PUT" | "ACTIVE";
export type OrderType = OrderTypeName.BUY | OrderTypeName.SELL

export enum OrderTypeName {
    BUY = 'BUY',
    SELL = "SELL",
};

export enum OptionTypeName {
    CALL = "CALL",
    PUT = "PUT",
    ACTIVE = "ACTIVE"
}

