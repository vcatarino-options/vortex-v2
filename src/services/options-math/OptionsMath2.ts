import { OptionType, Order, OrderType, OrderTypeName } from "../../models/strategy";
import OptionsMath from "./OptionsMath";

export default class OptionsMath2 {
    protected volatility: number
    protected price: number
    protected strike: number
    protected daysPerYear: number
    protected feePercent: number
    protected type: OptionType
    protected direction: OrderType

    constructor(order: Order) {
        this.volatility = order.volatility/100
        this.price = parseFloat(order.strPrice)
        this.strike = parseFloat(order.strStrike);
        this.daysPerYear = parseInt(order.workingDays) / 252
        this.feePercent = order.fee / 100
        this.type = order.type
        this.direction = order.direction ? OrderTypeName.BUY : OrderTypeName.SELL
        // console.log("ORDER ::", typeof(order.strStrike))
        // console.log("THIS.STRIKE ::", typeof(this.strike))
    }

    public setDirection(direction: boolean) {
        this.direction = direction ? OrderTypeName.BUY : OrderTypeName.SELL
        return this
    }

    public setStrike(strike: number) {
        this.strike = strike
        return this
    }

    public getStike() {
        return this.strike
    }

    public setDaysPerYear(workingDays: string) {
        this.daysPerYear = parseInt(workingDays) / 252
        return this
    }

    public getDirection() {
        return this.direction
    }

    public getOrder(): OptionsMath2 {
        return this;  // Retorna a própria instância
    }

    public getImpliedVolatility(optionPrice: number) {
        console.log("price: ", optionPrice)
        if (optionPrice === 0.00) {
            return NaN
        }
        const tolerance = 1e-6;
        let volatility = 0.2;
        const maxIterations = 1000;
        let iteration = 0;

        while (iteration < maxIterations) {
            console.log("estou no loop")
            const price = OptionsMath.blackScholesOptionPrice(volatility, this.price, this.strike, this.daysPerYear, this.feePercent, this.type);
            const vega = this.price * OptionsMath._stdNormal((Math.log(this.price / this.strike) + (this.feePercent + 0.5 * volatility ** 2) * this.daysPerYear) / (volatility * Math.sqrt(this.daysPerYear))) * Math.sqrt(this.daysPerYear);
            const priceDifference = price - optionPrice;

            if (Math.abs(priceDifference) < tolerance) {
                return volatility * 100;
            }
            volatility = volatility - priceDifference / vega;
            if (volatility <= 0) {
                volatility = 0.01;
            }

            iteration++;
        }
        return NaN;
    }

    public calculateOptionPrice = () => {
        return OptionsMath.blackScholesOptionPrice(
            this.volatility / 100,
            this.price,
            this.strike,
            this.daysPerYear,
            this.feePercent,
            this.type,
        );
    };
}

