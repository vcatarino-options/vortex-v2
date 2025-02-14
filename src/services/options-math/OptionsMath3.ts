import { OptionType, OptionTypeName, ImpliedVolatilityOrder, OrderType, OrderTypeName } from "../../models/strategy";

export default class OptionsMath3 {

    // Order = {
    //     volatility: number;
    //     strPrice: string;
    //     strStrike: string;
    //     workingDays: string;
    //     fee: number;
    //     type: OptionType;
    //     direction: boolean;
    // };

    static getImpliedVolatility(optionPrice: number, order: ImpliedVolatilityOrder) {
        console.log("price: ", optionPrice)
        const { strike, daysPerYear, feePercent, type, activePrice } = OptionsMath3.prepareOrder(order)
        if (optionPrice === 0.00) {
            return NaN
        }
        const tolerance = 1e-6;
        let volatility = 0.2;
        const maxIterations = 1000;
        let iteration = 0;

        while (iteration < maxIterations) {
            console.log("estou no loop")
            const price = OptionsMath3.blackScholesOptionPrice(volatility, activePrice, strike, daysPerYear, feePercent, type);
            const vega = activePrice * OptionsMath3._stdNormal((Math.log(activePrice / strike) + (feePercent + 0.5 * volatility ** 2) * daysPerYear) / (volatility * Math.sqrt(daysPerYear))) * Math.sqrt(daysPerYear);
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

    static prepareOrder(order: ImpliedVolatilityOrder) {
        const WORKING_DAYS_ON_YEAR: number = 252
        const strike: number = parseFloat(order.strike.split(' ')[0].replace(/\./g, '').replace(',', '.'))
        const daysPerYear: number = parseFloat(order.workingDays) / WORKING_DAYS_ON_YEAR
        const feePercent: number = order.selic / 100
        const type = order.type
        const activePrice = order.activePrice
        return { strike, daysPerYear, feePercent, type, activePrice }
    }

    static blackScholesOptionPrice(
        volatility: number,
        s: number,
        k: number,
        t: number,
        r: number,
        optionType: OptionType) {
        const d1 = (Math.log(s / k) + (r + 0.5 * volatility ** 2) * t) / (volatility * Math.sqrt(t));
        const d2 = d1 - volatility * Math.sqrt(t);

        let optionPrice;
        if (optionType.toUpperCase() === OptionTypeName.CALL) {
            optionPrice = s * OptionsMath3._stdNormal(d1) - k * Math.exp(-r * t) * OptionsMath3._stdNormal(d2);
        } else if (optionType.toUpperCase() === 'PUT') {
            optionPrice = k * Math.exp(-r * t) * OptionsMath3._stdNormal(-d2) - s * OptionsMath3._stdNormal(-d1);
        } else {
            throw new Error("Invalid option_type. Use 'CALL' or 'PUT'.");
        }

        return optionPrice;
    }

    static _stdNormal(z: number) {
        var k, m, values, total, item, z2, z4, a, b;
        if (z < -6) { return 0; }
        if (z > 6) { return 1; }
        m = 1;        // m(k) == (2**k)/factorial(k)
        b = z;        // b(k) == z ** (2*k + 1)
        z2 = z * z;    // cache of z squared
        z4 = z2 * z2;  // cache of z to the 4th
        values = [];
        for (k = 0; k < 100; k += 2) {
            a = 2 * k + 1;
            item = b / (a * m);
            item *= (1 - (a * z2) / ((a + 1) * (a + 2)));
            values.push(item);
            m *= (4 * (k + 1) * (k + 2));
            b *= z4;
        }
        total = 0;
        for (k = 49; k >= 0; k--) {
            total += values[k];
        }
        return 0.5 + 0.3989422804014327 * total;
    }

    static getOptionsGreeks(
        volatility: number,
        activePrice: number,
        personOption: number,
        daysPerYear: number,
        selic: number,
        optionType: OptionType,
        orderType: OrderType) {
        const d1 = (Math.log(activePrice / personOption) + (selic + 0.5 * volatility ** 2) * daysPerYear) / (volatility * Math.sqrt(daysPerYear));
        const d2 = d1 - volatility * Math.sqrt(daysPerYear);
        let delta, gamma, theta, vega, rho;

        if (optionType.toUpperCase() === OptionTypeName.CALL) {
            delta = OptionsMath3._stdNormal(d1);
            rho = (personOption * daysPerYear * Math.exp(-selic * daysPerYear) * OptionsMath3._stdNormal(d2)) / 100;
            theta = ((-activePrice * Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI) * volatility) / (2 * Math.sqrt(daysPerYear))
                - (selic * personOption * Math.exp(-selic * daysPerYear) * OptionsMath3._stdNormal(d2))) / 252;
        } else if (optionType.toUpperCase() === OptionTypeName.PUT) {
            delta = OptionsMath3._stdNormal(d1) - 1;
            rho = (-personOption * daysPerYear * Math.exp(-selic * daysPerYear) * OptionsMath3._stdNormal(-d2)) / 100;
            theta = ((-activePrice * Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI) * volatility) / (2 * Math.sqrt(daysPerYear))
                + (selic * personOption * Math.exp(-selic * daysPerYear) * OptionsMath3._stdNormal(-d2))) / 252;
        } else {
            throw new Error("Invalid option_type. Use 'CALL' or 'PUT'.");
        }

        gamma = 1 / (activePrice * volatility * Math.sqrt(daysPerYear) * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * d1 * d1);
        vega = (activePrice * Math.sqrt(daysPerYear) * Math.exp(((d1) ** 2 / 2) * -1) / (Math.sqrt(2 * Math.PI))) / 100
        if (
            (orderType.toUpperCase() === OrderTypeName.SELL && optionType.toUpperCase() === OptionTypeName.CALL) ||
            (orderType.toUpperCase() === OrderTypeName.BUY && optionType.toUpperCase() === OptionTypeName.PUT)
        ) {
            delta = delta < 0 ? delta : delta * -1
            gamma = gamma < 0 ? gamma : gamma * -1
            theta = theta < 0 ? theta * -1 : theta
            vega = vega < 0 ? vega : vega * -1
            rho = rho < 0 ? rho : rho * -1
        } else if (
            (orderType.toUpperCase() === OrderTypeName.BUY && optionType.toUpperCase() === OptionTypeName.CALL) ||
            (orderType.toUpperCase() === OrderTypeName.SELL && optionType.toUpperCase() === OptionTypeName.PUT)
        ) {
            delta = delta > 0 ? delta : delta * -1
            gamma = gamma > 0 ? gamma : gamma * -1
            theta = theta > 0 ? theta * -1 : theta
            vega = vega > 0 ? vega : vega * -1
            rho = rho > 0 ? rho : rho * -1
        }
        return { delta, gamma, theta, vega, rho }
    }
}