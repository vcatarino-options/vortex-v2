import { OptionTypeName, OrderTypeName } from "../../models/strategy";
import WebSocketService from "../ws-service/WebSocketService";

export default class OptionStrategy {

    static calculateMargin = async (ws: WebSocketService, positions: any, strategy: any) => {
        if (['trava_baixa_calls', 'trava_alta_puts'].includes(strategy)) {
            let margin = positions[0].strike - positions[1].strike;
            margin = margin > 0 ? margin * -1 : margin;
            console.log(`Operação vai chamar de margem: R$${margin}`);
            return margin * positions[0].quantidade;

        } else if (strategy === 'seagull') {
            const ticker = positions.find((item: any) => item.type === OptionTypeName.PUT).ticker;
            const multiplier = positions.find((item: any) => item.type === OptionTypeName.PUT).quantidade;
            let localMargin: any
            const getMarginAsync = () => {
                return new Promise((resolve, reject) => {
                    ws.getTickerMargin(ticker, (r: any) => {
                        if (r) {
                            localMargin = parseFloat(r.replace(',', '.'))
                            resolve(parseFloat(localMargin));
                        } else {
                            reject('Erro ao obter margem');
                        }
                    });
                });
            };
            await getMarginAsync()
            console.log(`Operação vai chamar de margem: R$${localMargin * multiplier}`);
            return localMargin * multiplier;

        } else if (strategy === 'fence') {
            const ticker = positions.find((item: any) => item.type === OptionTypeName.CALL).ticker;
            const multiplier = positions.find((item: any) => item.type === OptionTypeName.CALL).quantidade;
            let localMargin: any
            const getMarginAsync = () => {
                return new Promise((resolve, reject) => {
                    ws.getTickerMargin(ticker, (r: any) => {
                        if (r) {
                            localMargin = parseFloat(r.replace(',', '.'))
                            resolve(parseFloat(localMargin));
                        } else {
                            reject('Erro ao obter margem');
                        }
                    });
                });
            };
            await getMarginAsync()
            console.log(`Operação vai chamar de margem: R$${localMargin * multiplier}`);
            return localMargin * multiplier;

        } else if (['short_strangle', 'short_straddle'].includes(strategy)) {
            const tickers: any = {};
            let localMargin: any
            for (const item of positions) {
                const getMarginAsync = () => {
                    return new Promise((resolve, reject) => {
                        ws.getTickerMargin(item.ticker, (r: any) => {
                            if (r) {
                                localMargin = parseFloat(r.replace(',', '.'))
                                resolve(parseFloat(localMargin));
                            } else {
                                reject('Erro ao obter margem');
                            }
                        });
                    });
                };
                await getMarginAsync()
                tickers[item.ticker] = localMargin
            }
            const chosenTicker = Object.keys(tickers).reduce((a, b) => tickers[a] < tickers[b] ? a : b);
            const quantidade = positions.find((item: any) => item.ticker === chosenTicker).quantidade;
            localMargin = tickers[chosenTicker] * quantidade;
            console.log(`Operação vai chamar de margem: R$${localMargin}`);
            return localMargin;

        } else if (['call_ratio', 'put_ratio'].includes(strategy)) {
            let quantidadeExtra = positions[0].quantidade - positions[1].quantidade;
            quantidadeExtra = quantidadeExtra < 0 ? quantidadeExtra * -1 : quantidadeExtra;
            const ticker = positions[0].quantidade > positions[1].quantidade ? positions[0].ticker : positions[1].ticker;
            let localMargin: any
            const getMarginAsync = () => {
                return new Promise((resolve, reject) => {
                    ws.getTickerMargin(ticker, (r: any) => {
                        if (r) {
                            localMargin = parseFloat(r.replace(',', '.'))
                            resolve(parseFloat(localMargin));
                        } else {
                            reject('Erro ao obter margem');
                        }
                    });
                });
            };
            await getMarginAsync()
            console.log(`Operação vai chamar de margem: R$${localMargin * quantidadeExtra}`);
            return localMargin * quantidadeExtra;

        } else if (strategy === 'solo') {
            const quantidade = positions[0].quantidade;
            const ticker = positions[0].ticker
            let localMargin: any
            const getMarginAsync = () => {
                return new Promise((resolve, reject) => {
                    ws.getTickerMargin(ticker, (r: any) => {
                        if (r) {
                            localMargin = parseFloat(r.replace(',', '.'))
                            resolve(parseFloat(localMargin));
                        } else {
                            reject('Erro ao obter margem');
                        }
                    });
                });
            };
            await getMarginAsync()
            console.log(`Operação vai chamar de margem: R$${localMargin * quantidade}`);
            return localMargin * quantidade;

        } else if (['trava_alta_calls', 'trava_baixa_puts'].includes(strategy)) {
            console.log('Operação não chama margem');
            return 0;

        } else {
            console.log('Operação não identificada');
            return null;
        }
    }

    static identifyOptionStrategy = (positions: any[]) => {
        const strategies = {
            "trava_baixa_calls": (pos: any[]) => (
                pos?.length === 2 &&
                pos.some(p => p.type === OptionTypeName.CALL && p.side === OrderTypeName.BUY && parseFloat(p.strike) === Math.max(...pos.map(p => parseFloat(p.strike)))) &&
                pos.some(p => p.type === OptionTypeName.CALL && p.side === OrderTypeName.SELL && parseFloat(p.strike) === Math.min(...pos.map(p => parseFloat(p.strike)))) &&
                Math.min(...pos.map(p => parseFloat(p.strike))) < Math.max(...pos.map(p => parseFloat(p.strike)))
            ),
            "trava_alta_puts": (pos: any[]) => (
                pos?.length === 2 &&
                pos.some(p => p.type === OptionTypeName.PUT && p.side === OrderTypeName.BUY && parseFloat(p.strike) === Math.min(...pos.map(p => parseFloat(p.strike)))) &&
                pos.some(p => p.type === OptionTypeName.PUT && p.side === OrderTypeName.SELL && parseFloat(p.strike) === Math.max(...pos.map(p => parseFloat(p.strike)))) &&
                Math.min(...pos.map(p => parseFloat(p.strike))) < Math.max(...pos.map(p => parseFloat(p.strike)))
            ),
            "seagull": (pos: any[]) => (
                pos?.length === 3 &&
                pos.some(p => p.type === OptionTypeName.CALL && p.side === OrderTypeName.BUY && Math.min(...pos.map(p => parseFloat(p.strike))) < parseFloat(p.strike) && parseFloat(p.strike) < Math.max(...pos.map(p => parseFloat(p.strike)))) &&
                pos.some(p => p.type === OptionTypeName.CALL && p.side === OrderTypeName.SELL && parseFloat(p.strike) === Math.max(...pos.map(p => parseFloat(p.strike)))) &&
                pos.some(p => p.type === OptionTypeName.PUT && p.side === OrderTypeName.SELL && parseFloat(p.strike) === Math.min(...pos.map(p => parseFloat(p.strike))))
            ),
            "fence": (pos: any[]) => (
                pos?.length === 3 &&
                pos.some(p => p.type === OptionTypeName.CALL && p.side === OrderTypeName.SELL && parseFloat(p.strike) === Math.max(...pos.map(p => parseFloat(p.strike)))) &&
                pos.some(p => p.type === OptionTypeName.PUT && p.side === OrderTypeName.SELL && parseFloat(p.strike) === Math.min(...pos.map(p => parseFloat(p.strike)))) &&
                pos.some(p => p.type === OptionTypeName.PUT && p.side === OrderTypeName.BUY && Math.min(...pos.map(p => parseFloat(p.strike))) < parseFloat(p.strike) && parseFloat(p.strike) < Math.max(...pos.map(p => parseFloat(p.strike))))
            ),
            "short_strangle": (pos: any[]) => (
                pos?.length === 2 &&
                pos.some(p => p.type === OptionTypeName.CALL && p.side === OrderTypeName.SELL && parseFloat(p.strike) === Math.max(...pos.map(p => parseFloat(p.strike)))) &&
                pos.some(p => p.type === OptionTypeName.PUT && p.side === OrderTypeName.SELL && parseFloat(p.strike) === Math.min(...pos.map(p => parseFloat(p.strike)))) &&
                Math.min(...pos.map(p => parseFloat(p.strike))) < Math.max(...pos.map(p => parseFloat(p.strike)))
            ),
            "short_straddle": (pos: any[]) => (
                pos?.length === 2 &&
                pos.some(p => p.type === OptionTypeName.CALL && p.side === OrderTypeName.SELL) &&
                pos.some(p => p.type === OptionTypeName.PUT && p.side === OrderTypeName.SELL) &&
                Math.min(...pos.map(p => parseFloat(p.strike))) === Math.max(...pos.map(p => parseFloat(p.strike)))
            ),
            "call_ratio": (pos: any[]) => (
                pos?.length === 2 &&
                pos.some(p => p.type === OptionTypeName.CALL && p.side === OrderTypeName.BUY && parseFloat(p.strike) === Math.min(...pos.map(p => parseFloat(p.strike))) && parseInt(p.quantidade) === Math.min(...pos.map(p => parseInt(p.quantidade)))) &&
                pos.some(p => p.type === OptionTypeName.CALL && p.side === OrderTypeName.SELL && parseFloat(p.strike) === Math.max(...pos.map(p => parseFloat(p.strike))) && parseInt(p.quantidade) === Math.max(...pos.map(p => parseInt(p.quantidade)))) &&
                Math.min(...pos.map(p => parseFloat(p.strike))) < Math.max(...pos.map(p => parseFloat(p.strike))) &&
                Math.min(...pos.map(p => parseInt(p.quantidade))) < Math.max(...pos.map(p => parseInt(p.quantidade)))
            ),
            "put_ratio": (pos: any[]) => (
                pos?.length === 2 &&
                pos.some(p => p.type === OptionTypeName.PUT && p.side === OrderTypeName.BUY && parseFloat(p.strike) === Math.max(...pos.map(p => parseFloat(p.strike))) && parseInt(p.quantidade) === Math.min(...pos.map(p => parseInt(p.quantidade)))) &&
                pos.some(p => p.type === OptionTypeName.PUT && p.side === OrderTypeName.SELL && parseFloat(p.strike) === Math.min(...pos.map(p => parseFloat(p.strike))) && parseInt(p.quantidade) === Math.max(...pos.map(p => parseInt(p.quantidade)))) &&
                Math.min(...pos.map(p => parseFloat(p.strike))) < Math.max(...pos.map(p => parseFloat(p.strike))) &&
                Math.min(...pos.map(p => parseInt(p.quantidade))) < Math.max(...pos.map(p => parseInt(p.quantidade)))
            ),
            "trava_alta_calls": (pos: any[]) => (
                pos?.length === 2 &&
                pos.some(p => p.type === OptionTypeName.CALL && p.side === OrderTypeName.BUY && parseFloat(p.strike) === Math.min(...pos.map(p => parseFloat(p.strike)))) &&
                pos.some(p => p.type === OptionTypeName.CALL && p.side === OrderTypeName.SELL && parseFloat(p.strike) === Math.max(...pos.map(p => parseFloat(p.strike)))) &&
                Math.min(...pos.map(p => parseFloat(p.strike))) < Math.max(...pos.map(p => parseFloat(p.strike))) &&
                Math.min(...pos.map(p => parseInt(p.quantidade))) == Math.max(...pos.map(p => parseInt(p.quantidade)))
            ),
            "trava_baixa_puts": (pos: any[]) => (
                pos?.length === 2 &&
                pos.some(p => p.type === OptionTypeName.PUT && p.side === OrderTypeName.BUY && parseFloat(p.strike) === Math.max(...pos.map(p => parseFloat(p.strike)))) &&
                pos.some(p => p.type === OptionTypeName.PUT && p.side === OrderTypeName.SELL && parseFloat(p.strike) === Math.min(...pos.map(p => parseFloat(p.strike)))) &&
                Math.min(...pos.map(p => parseFloat(p.strike))) < Math.max(...pos.map(p => parseFloat(p.strike))) &&
                Math.min(...pos.map(p => parseInt(p.quantidade))) === Math.max(...pos.map(p => parseInt(p.quantidade)))
            ),
            "solo": (pos: any[]) => (
                pos?.length === 1 && pos.some(p => p.side === OrderTypeName.SELL)
            )
        };
        
        for (const [strategyName, criteria] of Object.entries(strategies)) {
            if (criteria(positions)) {
                return strategyName;
            }
        }

        return "Desconhecida";
    }
}