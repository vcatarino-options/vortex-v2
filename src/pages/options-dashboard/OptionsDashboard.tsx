import React, { useEffect, useRef, useState } from "react";
import FormDialog from "../../components/dialogs/FormDialog";
import { Box, Button, IconButton, Tab, TextField } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { UnderlineTabs } from "../../layouts/mui-treasury/mockup-tabs";
import CloseIcon from "@mui/icons-material/Close";
import { ButtonGroupOperation } from "./components/ButtonGroupOperation";
import OptionsTable from "./components/OptionsTable";
import { Strategy, createEmptyStrategy, createStockData, OptionType, StockData, TickerData, OptionData, createOptionData, ImpliedVolatilityOrder } from "../../models/strategy";
import { v4 as uuidv4 } from 'uuid';
import useForm from "../../hooks/useForm"
import { FinancialSummary } from "./components/FinancialSummary";
import WebSocketConnection from "../../services/ws-connection/WebSocketConnection";
import WebSocketService from "../../services/ws-service/WebSocketService";
import { useSnackbar } from 'notistack';
import ManagerTickerMonitor from "../../services/manager-ticker-monitor/ManagerTickerMonitor";
import OptionStrategy from "../../services/option-strategy/OptionStrategy";
import OptionsMath3 from "../../services/options-math/OptionsMath3";
import { useLoaderData } from "react-router";

const webSocketConnection = WebSocketConnection.getInstance()
webSocketConnection.connect()
const socket = webSocketConnection.getSocket()
const webSocketService = new WebSocketService(socket)

const OptionsDashboard = () => {
    let loaderData = useLoaderData<{ selic: number }>();
    const [open, setOpen] = useState(false);
    const [strategyName, setStrategyName] = useState("")
    const [strategies, setStrategies] = useState<Strategy[]>([])
    const [tabIndex, setTabIndex] = React.useState(0);
    const { setFormData } = useForm({ rate: "", price: "", estimatedMargin: "" })
    const [selecteds, setSelecteds] = React.useState<string[]>([]);

    const [stockDataKeyValue, setStockDataKeyValue] = useState<Record<string, StockData[]>>({})
    const [optionDataKeyValue, setOptionDataKeyValue] = useState<Record<string, OptionData[]>>({})
    const [stockEditableDataV2, setStockEditableDataV2] = React.useState<Record<string, any[]>>({})

    const prevSerieMapRef = useRef<Record<string, string> | null>(null);
    const prevStrikeMapRef = useRef<Record<string, string> | null>(null);

    const [margin, setMargin] = useState<Record<string, { margin: string, opPrice: number }>>({});
    const stockDataRef = useRef(stockDataKeyValue);
    const optionDataRef = useRef(optionDataKeyValue);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        sincronizeState()

        const key = strategies[tabIndex]?.id
        const changedItemId = getChangedSerie(stockDataKeyValue, key)
        if (changedItemId) {
            const stockData: StockData = getStockDataById(changedItemId)
            const activeName: string = stockData.activeName
            findActiveData(activeName, activeName, changedItemId, stockData.serie)
        }
        const changedIdBecauseStrike = getChangedStrike(stockDataKeyValue, key)
        if (changedIdBecauseStrike) {
            console.log("O Strike mudou :: ", changedIdBecauseStrike)
            const stockData: StockData = getStockDataById(changedIdBecauseStrike)
            const strike = stockData.strike.match(/-\s*(\S+)/)?.[1]
            const activeName: string = stockData.activeName
            console.log("STRIKE :: ", strike)
            console.log("ACTIVE NAME :: ", activeName)

            if (!strike) {
                console.warn("strike undefined")
                return
            }

            webSocketService.listenBookInfo(strike, (d: any) => {
                updateOptionData(d, strike)
            })

            // webSocketService.listenOptInfo(strike, activeName, (d: any) => {
            //     updateOptionData(d, strike)
            // })
        }

    }, [stockDataKeyValue, optionDataKeyValue]);

    useEffect(() => {
        defineMargin()
        defineSumOpPrice()
    }, [selecteds])

    const sincronizeState = () => {
        console.debug("Ref atualizada. ",);
        stockDataRef.current = stockDataKeyValue;
        optionDataRef.current = optionDataKeyValue;
    }

    const defineSumOpPrice = () => {
        const key = strategies[tabIndex]?.id;

        if (!key || !optionDataKeyValue[key]) {
            console.warn("No data available for key:", key);
            return;
        }

        const itemsToSum = (optionDataKeyValue[key] || []).filter(item => selecteds.includes(item.id));

        const totalPrice = itemsToSum.reduce<number>(
            (sum, item) => sum + (Number(item.price) || 0),
            0
        );

        setMargin(prevMargin => ({
            ...prevMargin,
            [key]: {
                ...(prevMargin[key] || {}),
                opPrice: totalPrice
            }
        }));
    };


    const defineMargin = async () => {
        let positions: any[] | undefined = findPositions()
        if (!positions) return
        const strategy = OptionStrategy.identifyOptionStrategy(positions)
        await findMargin(positions, strategy)
    }


    const getChangedSerie = (stockDataKeyValue: Record<string, StockData[]>, key: string | undefined): string | null => {
        if (!key || !stockDataKeyValue[key]) return null;
        const currentSerieMap: Record<string, string> = {};
        let changedItemId: string | null = null;

        stockDataKeyValue[key].forEach(item => {
            currentSerieMap[item.id] = item.serie;
        });

        if (prevSerieMapRef.current) {
            for (const id in currentSerieMap) {
                if (prevSerieMapRef.current[id] !== currentSerieMap[id]) {
                    changedItemId = id;
                    break;
                }
            }
        }

        prevSerieMapRef.current = currentSerieMap;

        return changedItemId;
    }

    const getChangedStrike = (stockDataKeyValue: Record<string, StockData[]>, key: string | undefined): string | null => {
        if (!key || !stockDataKeyValue[key]) return null;
        const currentStrikeMap: Record<string, string> = {};
        let changedItemId: string | null = null;

        stockDataKeyValue[key].forEach(item => {
            currentStrikeMap[item.id] = item.strike;
        });

        if (prevStrikeMapRef.current) {
            for (const id in currentStrikeMap) {
                if (prevStrikeMapRef.current[id] !== currentStrikeMap[id]) {
                    changedItemId = id;
                    break;
                }
            }
        }

        prevStrikeMapRef.current = currentStrikeMap;

        return changedItemId;
    }

    const findPositions = () => {
        if (!strategies[tabIndex]?.id) return
        const key = strategies[tabIndex]?.id
        const stockDataList = stockDataKeyValue[key]
        const editableDataList = stockEditableDataV2[key]
        const selectedsStock: StockData[] = stockDataList.filter(stock => selecteds.includes(stock.id))
        const selectedsEditable: any[] = editableDataList.filter(editableData => selecteds.includes(editableData.id))

        let positions: any[] = []
        selectedsStock.forEach((stock: StockData, idx: number) => {
            const rowData = {
                type: stock.optionType,
                strike: parseFloat(stock.strike.split(' ')[0].replace(',', '.')),
                side: stock.orderType,
                quantidade: selectedsEditable[idx].stockQtd,
                ticker: stock.activeName
            }
            positions.push(rowData)
        })

        return positions
    }

    const findMargin = async (positions: any[], strategy: any) => {
        const result = await OptionStrategy.calculateMargin(webSocketService, positions, strategy)
        const formattedNumber = result?.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
        });

        const key = strategies[tabIndex]?.id

        setMargin(prevMargin => ({
            ...prevMargin,
            [key]: {
                ...(prevMargin[key] || {}),
                margin: formattedNumber || ''
            }
        }));
    }

    // [optionDataKeyValue, setOptionDataKeyValue]
    const updateDataKeyValue = (optionId: string, updatedObj: any) => {
        const key = strategies[tabIndex].id
        delete updatedObj.price
        const clonedEditableValue = JSON.parse(JSON.stringify(stockEditableDataV2))
        const updatedList = clonedEditableValue[key].map((op: any) => op.id === optionId ? { ...op, ...updatedObj } : op)
        clonedEditableValue[key] = updatedList
        setStockEditableDataV2(clonedEditableValue)
    }

    const updatedImpliedVol = (optionId: string, updatedObj: any) => {
        const key = strategies[tabIndex].id
        const clonedEditableValue = JSON.parse(JSON.stringify(stockEditableDataV2))
        const updatedList = clonedEditableValue[key].map((op: any) => op.id === optionId ? { ...op, ...updatedObj } : op)
        clonedEditableValue[key] = updatedList
        setStockEditableDataV2(clonedEditableValue)
    }

    const handleCloseTab = (strategyId: string) => {
        const updatedStrategies = strategies.filter((strategy: Strategy) => strategy.id !== strategyId);
        const operationsToUnsubscribe = stockDataKeyValue[strategyId]
        operationsToUnsubscribe.forEach(op => {
            const stock = op.activeName
            ManagerTickerMonitor.deleteTickerOnTheMonitor(stock, op.id)
            const isOkKeepObserveTicker = ManagerTickerMonitor.shouldKeepObservingTicker(stock)
            if (!isOkKeepObserveTicker) webSocketService.unsubscribeTicker(stock)
        })
        setStrategies(updatedStrategies)
        const listSize = updatedStrategies.length
        if (listSize > 0) {
            const newIndex = listSize - 1 >= 0 ? listSize - 1 : 0
            setTabIndex(newIndex);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newStrategy = createEmptyStrategy()
        newStrategy.id = uuidv4()
        newStrategy.name = strategyName
        let clonedStrategies = [...strategies]
        clonedStrategies.push(newStrategy)
        setStrategies(clonedStrategies)
        handleClose();
    }

    const onchange = (event: React.FormEvent<HTMLInputElement>) => {
        const value = (event.target as HTMLInputElement).value
        setStrategyName(value)
    }

    const addingOperation = (optiontype: OptionType) => {
        const strategy = strategies[tabIndex]
        const operationKey = strategy.id
        const operationId = uuidv4()
        const emptyStockDataRow = createStockData({ id: operationId, optionType: optiontype })
        const emptyOptionDataRow = createOptionData({ id: operationId })

        // console.log(`Adicionei operation: id[${operationId}]`)
        // console.log(`emptyStockDataRow: [${emptyStockDataRow}]`)
        // console.log(`emptyOptionDataRow: [${emptyOptionDataRow}]`)
        // Atualizando StockData
        setStockDataKeyValue(prevStockData => ({
            ...prevStockData,
            [operationKey]: prevStockData[operationKey] ? [...prevStockData[operationKey], emptyStockDataRow] : [emptyStockDataRow]
        }));

        // Atualizando OptionData
        setOptionDataKeyValue(prevOptionData => ({
            ...prevOptionData,
            [operationKey]: prevOptionData[operationKey] ? [...prevOptionData[operationKey], emptyOptionDataRow] : [emptyOptionDataRow]
        }));

        inicializeStockQtdFromRow(operationId)
    }

    const inicializeStockQtdFromRow = (operationId: string) => {
        const strategy = strategies[tabIndex]
        const operationKey = strategy.id

        const emptyEditableRow = { id: operationId, stockQtd: 100, direction: true, volatility: 0.0, price: 0.0, greekDictionary: { delta: 0.0 } }

        setStockEditableDataV2((prevStockEditableDataV2: Record<string, any[]>) => ({
            ...prevStockEditableDataV2,
            [operationKey]: prevStockEditableDataV2[operationKey] ? [...prevStockEditableDataV2[operationKey], emptyEditableRow] : [emptyEditableRow]
        }))
    }

    const deletingOptionFromTable = () => {
        const key = strategies[tabIndex].id
        const clonedStockDataKeyValue = JSON.parse(JSON.stringify(stockDataKeyValue))
        const clonedOptionsDataKeyValue = JSON.parse(JSON.stringify(optionDataKeyValue))
        const clonedStockEditableData = JSON.parse(JSON.stringify(stockEditableDataV2))

        const intersectionsStockData = clonedStockDataKeyValue[key].filter((stockData: StockData) => !selecteds.includes(stockData.id));
        const intersectionsOptionsData = clonedOptionsDataKeyValue[key].filter((optionData: OptionData) => !selecteds.includes(optionData.id));
        const intersectionsEditableData = clonedStockEditableData[key].filter((stockEditableData: any) => !selecteds.includes(stockEditableData.id));

        const listToDelete = clonedStockDataKeyValue[key].filter((option: StockData) => selecteds.includes(option.id));
        clonedStockDataKeyValue[key] = intersectionsStockData
        clonedOptionsDataKeyValue[key] = intersectionsOptionsData
        clonedStockEditableData[key] = intersectionsEditableData

        setStockDataKeyValue(clonedStockDataKeyValue)
        setOptionDataKeyValue(clonedOptionsDataKeyValue)
        setStockEditableDataV2(clonedStockEditableData)

        listToDelete.forEach((op: StockData) => {
            const stock = op.activeName
            ManagerTickerMonitor.deleteTickerOnTheMonitor(stock, op.id)
            const isOkKeepObserveTicker = ManagerTickerMonitor.shouldKeepObservingTicker(stock)
            if (!isOkKeepObserveTicker) webSocketService.unsubscribeTicker(stock)
        })
    }

    const findActiveData = (newValue: string, currentValue: string, id: string, serie?: string) => {
        try {
            const operation = getStockDataById(id)
            const operationType = operation.optionType
            const tickerData: TickerData = {
                rowId: id,
                ticker: newValue,
                type: operationType,
                serie: serie || undefined
            }

            webSocketService.getTickerChangeData(tickerData, (r: unknown) => {
                getTicker(r, id, newValue)
                ManagerTickerMonitor.updateTickerMonitorData(currentValue, newValue, id)
                if (currentValue && newValue) {
                    const isOkKeepObserveTicker = ManagerTickerMonitor.shouldKeepObservingTicker(currentValue)
                    if (!isOkKeepObserveTicker) webSocketService.unsubscribeTicker(currentValue)
                }


            })

            // webSocketService.listenBookInfo(newValue, (d: any) => {
            //     updateOptionData(id, d)
            // })
        } catch (e) {
            console.error("OptionsDashboard - findActiveData", e)
            enqueueSnackbar('Não foi possível carregar os dados solicitados. O ticker é válido?', { variant: "error", preventDuplicate: true });
        }
    }

    //INÍCIO DO UPDATE OPTION DATA
    const updateOptionData = (d: any, strike: string) => {
        const key = strategies[tabIndex]?.id;
        if (!key) return;

        const matchingStockItems = getMatchingStockItems(key, strike);
        if (matchingStockItems.length === 0) return;

        const optionMap = getOptionsMap(matchingStockItems);
        if (optionMap.size === 0) return;

        updateOptionValues(optionMap, d, matchingStockItems);
        updateOptionState(key, optionMap);
    };

    // Obtém os itens de estoque que possuem o strike informado
    const getMatchingStockItems = (key: string, strike: string): StockData[] => {
        const items = stockDataRef.current[key]?.filter((stock) => stock.strike.includes(strike)) || [];
        if (items.length === 0) {
            console.warn(`Nenhuma StockData encontrada para o strike: ${strike}`);
        } else {
            console.log(`Encontradas ${items.length} entradas para o strike ${strike}`);
        }
        return items;
    };

    // Obtém um Map com as opções associadas aos itens encontrados
    const getOptionsMap = (matchingStockItems: StockData[]): Map<string, OptionData> => {
        const optionMap = new Map<string, OptionData>();
        matchingStockItems.forEach((stockItem) => {
            const option = getOptionDataById(stockItem.id);
            if (option) {
                optionMap.set(stockItem.id, { ...option });
            }
        });
        return optionMap;
    };

    // Atualiza os valores das opções no Map
    const updateOptionValues = (optionMap: Map<string, OptionData>, d: any, matchingStockItems: StockData[]) => {
        matchingStockItems.forEach((stockItem) => {
            const option = optionMap.get(stockItem.id);
            if (!option) return;

            option.optionIn.cost = d[3];
            option.optionIn.bandCost = d[149];
            option.optionOut.sales = d[4];
            option.optionOut.bandSales = d[148];
            option.price = d[2];
            
            // const { bid_option, ask_option, tunel_upper_option, tunel_down_option, stock_last } = d
            // option.optionIn.cost = bid_option;
            // option.optionIn.bandCost = tunel_down_option;
            // option.optionOut.sales = ask_option;
            // option.optionOut.bandSales = tunel_upper_option;
            // option.price = stock_last;

            //O active price deve ser consumido via websocket também
            const order: ImpliedVolatilityOrder = {
                strike: stockItem.strike,
                workingDays: stockItem.workingDays,
                selic: loaderData.selic,
                type: stockItem.optionType,
                activePrice: 26.10
            }
            const costVol = OptionsMath3.getImpliedVolatility(parseFloat(option.optionIn.cost), order)
            const salesVol = OptionsMath3.getImpliedVolatility(parseFloat(option.optionOut.sales), order)

            console.log("costVol: ", costVol)
            console.log("salesVol: ", salesVol)
            // Calcula a volatilidade e atribui os valores
            option.optionIn.costVolatility = costVol.toString()
            option.optionOut.salesVolatility = salesVol.toString()
        })
    };

    // Atualiza o estado com os novos valores
    const updateOptionState = (key: string, optionMap: Map<string, OptionData>) => {
        const updatedList = optionDataRef.current[key]?.map((op: OptionData) =>
            optionMap.has(op.id) ? optionMap.get(op.id)! : op
        ) || [];

        setOptionDataKeyValue((prev) => ({
            ...prev,
            [key]: updatedList
        }));
    };

    //FIM DO UPDATE OPTION DATA

    const getTicker = (r: any, opId: string, activeName: string) => {
        try {
            checkTickerReceivedFromWebSocket(r)
            const updatedOp: StockData = getStockDataById(opId)

            updatedOp.workingDays = r.du
            updatedOp.strike = r.option
            updatedOp.strikes = r.options
            updatedOp.serie = r.serie
            updatedOp.series = r.series
            updatedOp.activeName = activeName

            const key = strategies[tabIndex].id
            const clonedOperationsKeyValue = JSON.parse(JSON.stringify(stockDataKeyValue))

            const updatedList = clonedOperationsKeyValue[key].map((op: StockData) => op.id === updatedOp.id ? updatedOp : op)
            clonedOperationsKeyValue[key] = updatedList
            setStockDataKeyValue(clonedOperationsKeyValue)

        } catch (e) {
            console.error("OptionsDashboard - getTicker", e)
            enqueueSnackbar('Não foi possível carregar os dados solicitados. O ticker é válido?', { variant: "error", preventDuplicate: true });
        }
    }

    const checkTickerReceivedFromWebSocket = (r: any) => {
        const requiredKeys = ['du', 'option', 'options', 'serie', 'series'];

        if (requiredKeys.some(key => !Object.prototype.hasOwnProperty.call(r, key))) {
            throw new Error("Dados recebidos do WebSocket estão incompletos");
        }
    };

    const updateStock = (optId: string, data: Partial<StockData>) => {
        try {
            const operation = getStockDataById(optId)
            const key = strategies[tabIndex].id
            const clonedOperationsKeyValue = JSON.parse(JSON.stringify(stockDataKeyValue))
            const _key = Object.keys(data)[0] as keyof StockData;
            operation[_key] = data?.[_key] !== undefined ? data[_key]! : operation[_key];

            const updatedList = clonedOperationsKeyValue[key].map((op: StockData) => op.id === operation.id ? operation : op)
            clonedOperationsKeyValue[key] = updatedList
            setStockDataKeyValue(clonedOperationsKeyValue)

        } catch (e) {

        }
    }

    const getStockDataById = (id: string) => {
        const strategy = strategies[tabIndex]
        const operations = stockDataKeyValue[strategy.id]
        const operation = operations.find(op => op.id === id)
        if (!operation) {
            throw new Error("OptionsDashboard: Não existe uma operação válida.");
        }
        return JSON.parse(JSON.stringify(operation))
    }

    const getOptionDataById = (id: string) => {
        const strategy = strategies[tabIndex]
        const options = optionDataRef.current[strategy.id]
        const option = options.find(op => op.id === id)
        if (!option) {
            throw new Error("OptionsDashboard: Não existe uma opção válida.");
        }
        return JSON.parse(JSON.stringify(option))
    }

    return (
        <>
            <FormDialog
                contentText={"Crie uma nova estratégia agora mesmo!"}
                inputLabel={"Comece pelo nome"}
                btCancelLabel={"Cancelar"}
                btContinueLabel={"Continuar"}
                value={strategyName}
                onChange={onchange}
                onSubmit={onSubmit}
                open={open}
                handleClose={handleClose}
            />

            <Box sx={{ px: 2, py: 2, display: "flex" }}>
                <Button
                    variant="contained"
                    onClick={handleClickOpen}
                    sx={{
                        color: (theme) => theme.palette.primary.contrastText,
                        background: (theme) => theme.palette.primary.light,
                        fontWeight: 700,
                        width: "200px"
                    }}
                >
                    NOVA ESTRATÉGIA
                </Button>
                <Box sx={{ pl: "15px" }}>
                    <TextField
                        disabled
                        name="rate"
                        label="Juros (%)"
                        size="small"
                        value={loaderData.selic}
                        sx={{ width: 90 }}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                </Box>
            </Box>
            {
                strategies.length > 0 && (
                    <>
                        <TabContext value={tabIndex}>
                            {/* INÍCIO TABS */}
                            <UnderlineTabs
                                value={tabIndex}
                                onChange={(_, index) => setTabIndex(index)}
                                sx={{
                                    ...(strategies.length === 0 && { display: "none" }),
                                    minHeight: { xs: 44, md: 48 },
                                    px: 2,
                                    "& .MuiTab-root": {
                                        minHeight: { xs: 44, md: 48 },
                                        minWidth: 0,
                                        fontSize: { md: 16 },
                                    },
                                }}
                            >
                                {
                                    strategies.length > 0 && strategies.map((strategy, id) => (
                                        <Tab
                                            key={strategy.id}
                                            value={id}
                                            label={
                                                <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: "baseline" }}>
                                                    <Box>
                                                        {strategy.name}
                                                    </Box>
                                                    <Box>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Impede que o clique no botão "x" altere a aba
                                                                handleCloseTab(strategy.id);
                                                            }}
                                                        >

                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            }
                                            disableTouchRipple
                                        />

                                    ))
                                }
                            </UnderlineTabs>
                            {/* FIM TABS */}
                            {/* INÍCIO INFORMAÇÕES DO ATIVO */}
                            <Box sx={{ px: 2, pt: 1, display: "flex", justifyContent: "space-between" }}>
                                <ButtonGroupOperation addingOperation={addingOperation} />
                                <FinancialSummary
                                    selecteds={selecteds}
                                    options={optionDataKeyValue[strategies[tabIndex]?.id]}
                                    editableItems={stockEditableDataV2[strategies[tabIndex]?.id]}
                                    margin={margin[strategies[tabIndex].id]}
                                    setIputValue={setFormData} />
                            </Box>
                            {/* FIM INFORMAÇÕES DO ATIVO */}
                            {/* INÍCIO DADOS PARA CADA TAB */}
                            {
                                strategies.map((strategy: Strategy, id) => (
                                    <TabPanel sx={{ padding: 0 }} key={strategy.id} value={id}>
                                        {
                                            stockDataKeyValue[strategy.id] &&
                                            stockDataKeyValue[strategy.id].length > 0 &&
                                            <OptionsTable
                                                updateOption={updateStock}
                                                getValueFromAutocomplete={findActiveData}
                                                stockDataList={stockDataKeyValue[strategy.id]}
                                                optionDataList={optionDataKeyValue[strategy.id]}
                                                editableDataList={stockEditableDataV2[strategy.id]}
                                                selecteds={selecteds}
                                                setSelecteds={setSelecteds}
                                                deleteItens={deletingOptionFromTable}
                                                updateOptionPrice={updateDataKeyValue}
                                                updatedImpliedVol={updatedImpliedVol}
                                            />
                                        }
                                    </TabPanel>
                                ))
                            }
                            {/* FIM DADOS PARA CADA TAB */}
                        </TabContext>
                    </>
                )
            }
        </>
    )
}

export default OptionsDashboard