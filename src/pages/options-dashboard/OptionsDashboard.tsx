import React, { useState } from "react";
import { LayoutV6AppAnalytics } from "../../mui-treasury/layout-v6-app-analytics/index"
import FormDialog from "../../components/dialogs/FormDialog";

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
            <LayoutV6AppAnalytics
                tabsTitle={strategyList}
                handleCloseTab={handleCloseTab}
                tabIndex={tabIndex}
                setTabIndex={setTabIndex}
                handleClickOpen={handleClickOpen}
            />
        </>
    )
}

export default OptionsDashboard