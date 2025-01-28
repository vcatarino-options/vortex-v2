export interface Strategy {
    id: string,
    name: string
    tradeSetupWizard?: TradeSetupWizard,
    optionsTable?: OptionTable[],
}

export interface FinancialSummary {
    optionPrice: string | null
    estimatedMargin: string | null
}

export const createEmptyStrategy = () => {
    const strategy: Strategy = {
        id: "",
        name: ""
    }
    return strategy
}

export interface TradeSetupWizard {
    id: string,
    strategyId: string,
    stockName?: string,
    rate?: string,
    price?: string,
    estimatedMargin?: string
}

export interface OptionTable {
    id: string,
    strategyId: string,
    stockName: string,
    orderType: "buy" | "sell"
    quantity: string,
    workingDays: string,
    strike: string,
    volatility: string,
    price: string,
    optionIn: OptionIn,
    optionOut: OptionOut,
    result: string,
    optionGreek: OptionGreek
}

export interface OptionIn {
    costVolatility: string,
    bandCost: string,
    cost: string,
}

export interface OptionOut {
    salesVolatility: string,
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



