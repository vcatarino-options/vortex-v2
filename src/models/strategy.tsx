interface Strategy {
    id: string,
    name: string
    tradeSetupWizard?: TradeSetupWizard,
    optionsTable?: OptionTable[],
}

interface TradeSetupWizard {
    id: string,
    strategyId: string,
    stockName?: string,
    rate?: string,
    price?: string,
    estimatedMargin?: string
}

interface OptionTable {
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

interface OptionIn {
    costVolatility: string,
    bandCost: string,
    cost: string,
}

interface OptionOut {
    salesVolatility: string,
    bandSales: string,
    sales: string,
}

interface OptionGreek {
    delta: string,
    gama: string,
    theta: string,
    vega: string,
    rho: string,
}



