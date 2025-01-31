import React, { useEffect, useState } from "react";
import FormDialog from "../../components/dialogs/FormDialog";
import { Box, Button, IconButton, Tab, TextField } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { UnderlineTabs } from "../../layouts/mui-treasury/mockup-tabs";
import CloseIcon from "@mui/icons-material/Close";
import { ButtonGroupOperation } from "./components/ButtonGroupOperation";
import OptionsTable from "./components/OptionsTable";
import { Strategy, createEmptyStrategy, createStockData, OptionType, StockData, TickerData, TickerMonitorData, OptionData, createOptionData, OptionIn, OptionOut } from "../../models/strategy";
import { v4 as uuidv4 } from 'uuid';
import useForm from "../../hooks/useForm"
import { FinancialSummary } from "./components/FinancialSummary";
import WebSocketConnection from "../../services/ws-connection/WebSocketConnection";
import WebSocketService from "../../services/ws-service/WebSocketService";
import { useSnackbar } from 'notistack';
import ManagerTickerMonitor from "../../services/manager-ticker-monitor/ManagerTickerMonitor";

const webSocketConnection = WebSocketConnection.getInstance()
webSocketConnection.connect()
const socket = webSocketConnection.getSocket()
const webSocketService = new WebSocketService(socket)

const OptionsDashboard = () => {
    const [fee, setFee] = useState<string>("")
    const [open, setOpen] = useState(false);
    const [strategyName, setStrategyName] = useState("")
    const [stockName, setStockName] = useState<string | null>("")
    const [tabIndex, setTabIndex] = React.useState(0);
    const { formValue, setFormData } = useForm({ rate: "", price: "", estimatedMargin: "" })
    const [strategies, setStrategies] = useState<Strategy[]>([])
    const [selecteds, setSelecteds] = React.useState<string[]>([]);

    const [stockDataKeyValue, setStockDataKeyValue] = useState<Record<string, StockData[]>>({})
    const [optionDataKeyValue, setOptionDataKeyValue] = useState<Record<string, OptionData[]>>({})
    const [stockQtdFromRow, setStockQtdFromRow] = React.useState<Record<string, number>>({});
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        webSocketService.getRiskFree((r: unknown) => {
            getFee(r)
        })
    }, [])

    const getFee = (r: unknown) => {
        const response: string = r as string
        setFee(response)
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
        const value = event.target.value
        setStrategyName(value)
    }

    const addingOperation = (optiontype: OptionType) => {
        const strategy = strategies[tabIndex]
        const operationKey = strategy.id
        const clonedStockDataKeyValue = JSON.parse(JSON.stringify(stockDataKeyValue))
        const clonedOperationsKeyValue = JSON.parse(JSON.stringify(optionDataKeyValue))
        const operationId = uuidv4()
        const emptyStockDataRow = createStockData({ id: operationId, optionType: optiontype })
        const emptyOptionDataRow = createOptionData({ id: operationId })

        let updatedStockDataKeyValue = {}
        let updatedOptionDataKeyValue = {}

        if (!stockDataKeyValue.hasOwnProperty(operationKey)) {
            const operations = [emptyStockDataRow]
            const newOperation = { [operationKey]: operations }
            updatedStockDataKeyValue = { ...clonedStockDataKeyValue, ...newOperation }
        } else {
            clonedStockDataKeyValue[operationKey].push(emptyStockDataRow)
            updatedStockDataKeyValue = clonedStockDataKeyValue
        }

        if (!optionDataKeyValue.hasOwnProperty(operationKey)) {
            const options = [emptyOptionDataRow]
            const newOption = { [operationKey]: options }
            updatedOptionDataKeyValue = { ...clonedOperationsKeyValue, ...newOption }
        } else {
            clonedOperationsKeyValue[operationKey].push(emptyOptionDataRow)
            updatedOptionDataKeyValue = clonedOperationsKeyValue
        }

        inicializeStockQtdFromRow(operationId)
        setStockDataKeyValue(updatedStockDataKeyValue)
        setOptionDataKeyValue(updatedOptionDataKeyValue)
    }

    const inicializeStockQtdFromRow = (operationId: string) => {
        const newStockQtd = { [operationId]: 100 }
        let hashedStockQtd = { ...stockQtdFromRow, ...newStockQtd }
        setStockQtdFromRow(hashedStockQtd)
    }

    const deletingOptionFromTable = () => {
        const key = strategies[tabIndex].id
        const clonedOperationsKeyValue = JSON.parse(JSON.stringify(stockDataKeyValue))
        const intersections = clonedOperationsKeyValue[key].filter((option: StockData) => !selecteds.includes(option.id));
        const listToDelete = clonedOperationsKeyValue[key].filter((option: StockData) => selecteds.includes(option.id));
        clonedOperationsKeyValue[key] = intersections
        setStockDataKeyValue(clonedOperationsKeyValue)
        listToDelete.forEach((op: StockData) => {
            const stock = op.activeName
            ManagerTickerMonitor.deleteTickerOnTheMonitor(stock, op.id)
            const isOkKeepObserveTicker = ManagerTickerMonitor.shouldKeepObservingTicker(stock)
            if (!isOkKeepObserveTicker) webSocketService.unsubscribeTicker(stock)
        })
    }

    const findActiveData = (newValue: string, currentValue: string, id: string) => {
        try {
            const operation = getStockDataById(id)
            const operationType = operation.optionType
            const tickerData: TickerData = {
                rowId: id,
                ticker: newValue,
                type: operationType,

            }

            webSocketService.getTickerChangeData(tickerData, (r: unknown) => {
                getTicker(r, id, newValue)
                ManagerTickerMonitor.updateTickerMonitorData(currentValue, newValue, id)
                if (currentValue && newValue) {
                    const isOkKeepObserveTicker = ManagerTickerMonitor.shouldKeepObservingTicker(currentValue)
                    if (!isOkKeepObserveTicker) webSocketService.unsubscribeTicker(currentValue)
                }
            })

            webSocketService.listenBookInfo(newValue, (r: any) => {
                const optionIn: OptionIn = {
                    cost: r[3],
                    bandCost: r[149]
                }
                const optionOut: OptionOut = {
                    sales: r[4],
                    bandSales: r[148]
                }

                const option: OptionData = getOptionDataById(id)
                option.optionIn = optionIn
                option.optionOut = optionOut

                const key = strategies[tabIndex].id
                const clonedOptionKeyValue = JSON.parse(JSON.stringify(optionDataKeyValue))

                const options = clonedOptionKeyValue[key].map((op: OptionData) => op.id === option.id ? option : op)
                clonedOptionKeyValue[key] = options
                setOptionDataKeyValue(clonedOptionKeyValue)
            })

        } catch (e) {
            console.error("OptionsDashboard - findActiveData", e)
            enqueueSnackbar('Não foi possível carregar os dados solicitados. O ticker é válido?', { variant: "error", preventDuplicate: true });
        }
    }

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
        if (!r.du || !r.option || !r.options || !r.serie || !r.series) {
            throw new Error("Dados recebidos do WebSocket estão incompletos");
        }
    }

    const updateStock = (optId: string, data: Partial<StockData>) => {
        try {
            const operation = getStockDataById(optId)
            const key = strategies[tabIndex].id
            const clonedOperationsKeyValue = JSON.parse(JSON.stringify(stockDataKeyValue))
            const _key = Object.keys(data)[0]
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
        const options = optionDataKeyValue[strategy.id]
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
                        value={fee}
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
                                onChange={(event, index) => setTabIndex(index)}
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
                                <FinancialSummary setIputValue={setFormData} />
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
                                                selecteds={selecteds}
                                                setSelecteds={setSelecteds}
                                                stockQtd={stockQtdFromRow}
                                                setStockQtd={setStockQtdFromRow}
                                                deleteItens={deletingOptionFromTable} />
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