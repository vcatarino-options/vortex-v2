import { OptionType, OptionTypeName, OrderType, OrderTypeName } from "../../models/strategy";

export default class OptionsMath {

    static getOptionsGreeks(
        volatility: number,
        activePrice: number,
        personOption: number,
        daysPerYear: number,
        fee: number,
        optionType: OptionType,
        orderType: OrderType) {
        const d1 = (Math.log(activePrice / personOption) + (fee + 0.5 * volatility ** 2) * daysPerYear) / (volatility * Math.sqrt(daysPerYear));
        const d2 = d1 - volatility * Math.sqrt(daysPerYear);
        let delta, gamma, theta, vega, rho;

        if (optionType.toUpperCase() === OptionTypeName.CALL) {
            delta = OptionsMath._stdNormal(d1);
            rho = (personOption * daysPerYear * Math.exp(-fee * daysPerYear) * OptionsMath._stdNormal(d2)) / 100;
            theta = ((-activePrice * Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI) * volatility) / (2 * Math.sqrt(daysPerYear))
                - (fee * personOption * Math.exp(-fee * daysPerYear) * OptionsMath._stdNormal(d2))) / 252;
        } else if (optionType.toUpperCase() === OptionTypeName.PUT) {
            delta = OptionsMath._stdNormal(d1) - 1;
            rho = (-personOption * daysPerYear * Math.exp(-fee * daysPerYear) * OptionsMath._stdNormal(-d2)) / 100;
            theta = ((-activePrice * Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI) * volatility) / (2 * Math.sqrt(daysPerYear))
                + (fee * personOption * Math.exp(-fee * daysPerYear) * OptionsMath._stdNormal(-d2))) / 252;
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
}