import React, { useState } from "react";
import { LayoutV6AppAnalytics } from "../../layouts/mui-treasury/layout-v6-app-analytics/index"
import FormDialog from "../../components/dialogs/FormDialog";
import { Box, Button, Grid2, IconButton, Tab } from "@mui/material";
import { UnderlineTabs } from "../../layouts/mui-treasury/mockup-tabs";
import CloseIcon from "@mui/icons-material/Close";
import { TradeSetupWizard } from "./TradeSetupWizard";
import EnhancedTable from "./EnhancedTable";

const OptionsDashboard = () => {
    const [open, setOpen] = useState(false);
    const [strategyName, setStrategyName] = useState("")
    const [strategyList, setStrategyList] = useState<string[]>([])
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleCloseTab = (value: string) => {
        console.log(`Fechar a tabela ${value}`)
        const updatedStrategiesList = strategyList.filter((strategy: string) => strategy !== value);
        setStrategyList(updatedStrategiesList);
        const listSize = updatedStrategiesList.length
        if (listSize > 0) {
            const newIndex = listSize - 1 >= 0 ? listSize - 1 : 0
            setTabIndex(newIndex); // Seleciona a próxima aba
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
        console.log("O nome da estratégia é: ", strategyName)
        let clonedStrategyList = [...strategyList]
        clonedStrategyList.push(strategyName)
        console.log("NAMES: ", strategyList)
        setStrategyList(clonedStrategyList)
        handleClose();
    }

    const onchange = (event: React.FormEvent<HTMLInputElement>) => {
        const value = event.target.value
        setStrategyName(value)
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
            {/* <LayoutV6AppAnalytics
                tabsTitle={strategyList}
                handleCloseTab={handleCloseTab}
                tabIndex={tabIndex}
                setTabIndex={setTabIndex}
                handleClickOpen={handleClickOpen}
            /> */}

            <>
                <Box sx={{ px: 2, py: 2 }}>
                    <Button
                        variant="contained"
                        // color="info"
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
                </Box>
                {/* INÍCIO TABS */}
                <UnderlineTabs
                    value={tabIndex}
                    onChange={(event, index) => setTabIndex(index)}
                    sx={{
                        ...(strategyList.length === 0 && { display: "none" }),
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
                        strategyList.length > 0 && strategyList.map(strategy => (
                            <Tab
                                label={
                                    <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: "baseline" }}>
                                        <Box>
                                            {strategy}
                                        </Box>
                                        <Box>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Impede que o clique no botão "x" altere a aba
                                                    handleCloseTab(strategy);
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
                <Box sx={{ px: 2, pt: 1 }}>
                    <Grid2 container spacing={2}>
                        {/* <Grid2 size={{ xs: 12, sm: 6, md: 8 }} container spacing={2}> */}
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <TradeSetupWizard />
                        </Grid2>
                        {/* <Grid2 size={{ xs: 6 }}>
                <StatCardMockup />
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <StatCardMockup />
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <StatCardMockup />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <UserActiveCardMockup />
              </Grid2> */}
                        {/* </Grid2> */}
                        {/* <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <TopUsersCardMockup sx={{ height: "100%" }} />
            </Grid2> */}
                    </Grid2>
                </Box>
                {/* FIM INFORMAÇÕES DO ATIVO */}
                {/* INÍCIO TABELA */}
                <EnhancedTable />
                {/* FIM TABELA */}
                <Box
                    sx={{
                        height: "16vh",
                        minHeight: 240,
                        borderRadius: 2,
                        bgcolor: "rgba(0 0 0 / 0.12)",
                        m: 2,
                    }}
                />

                <br />
                <br />
                <br />
            </>
        </>
    )
}

export default OptionsDashboard