import React, { useEffect, useState } from "react";
import FormDialog from "../../components/dialogs/FormDialog";
import { Box, Button, IconButton, Tab, TextField } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { UnderlineTabs } from "../../layouts/mui-treasury/mockup-tabs";
import CloseIcon from "@mui/icons-material/Close";
import { ButtonGroupOperation } from "./components/ButtonGroupOperation";
import OptionsTable from "./components/OptionsTable";
import { Strategy, createEmptyStrategy, createOptionTable, OptionType, OptionTable } from "../../models/strategy";
import { v4 as uuidv4 } from 'uuid';
import useForm from "../../hooks/useForm"
import { FinancialSummary } from "./components/FinancialSummary";
import WebSocketConnection from "../../services/ws-connection/WebSocketConnection";
import WebSocketService from "../../services/ws-service/WebSocketService";

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
    const [operationKeyValue, setOperationKeyValue] = useState<Record<string, OptionTable[]>>({})
    const [selecteds, setSelecteds] = React.useState<string[]>([]);

    useEffect(() => {
        console.log()
        webSocketService.getRiskFree((r: unknown) => {
            getFee(r)
        })
    }, [])

    const getFee = (r: unknown) => {
        const response: string = r as string
        setFee(response)
    }

    const handleCloseTab = (value: string) => {
        console.log(`Fechar a tabela de id ${value}`)
        const updatedStrategies = strategies.filter((strategy: Strategy) => strategy.id !== value);
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
        const clonedOperationsKeyValue = JSON.parse(JSON.stringify(operationKeyValue))
        const emptyOptionRow = createOptionTable({ id: uuidv4(), optionType: optiontype })
        let updatedOperationKeyValue = {}

        if (!operationKeyValue.hasOwnProperty(operationKey)) {
            const operations = [emptyOptionRow]
            const newOperation = { [operationKey]: operations }
            updatedOperationKeyValue = { ...clonedOperationsKeyValue, ...newOperation }
        } else {
            clonedOperationsKeyValue[operationKey].push(emptyOptionRow)
            updatedOperationKeyValue = clonedOperationsKeyValue
        }
        setOperationKeyValue(updatedOperationKeyValue)
    }

    const deletingOptionFromTable = () => {
        const key = strategies[tabIndex].id
        const clonedOperationsKeyValue = JSON.parse(JSON.stringify(operationKeyValue))
        const intersections = clonedOperationsKeyValue[key].filter((option: OptionTable) => !selecteds.includes(option.id));
        clonedOperationsKeyValue[key] = intersections
        setOperationKeyValue(clonedOperationsKeyValue)
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
                                            operationKeyValue[strategy.id] &&
                                            operationKeyValue[strategy.id].length > 0 &&
                                            <OptionsTable
                                                options={operationKeyValue[strategy.id]}
                                                selecteds={selecteds}
                                                setSelecteds={setSelecteds}
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