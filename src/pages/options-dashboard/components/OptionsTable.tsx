import * as React from 'react';
import { alpha } from '@mui/material/styles';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Paper,
    IconButton,
    Tooltip,
    Card,
    CardContent,
    Typography,
    Autocomplete,
    TextField,
    InputBase,
} from '@mui/material';
import { SwitchTextTrack } from '../../../layouts/mui-treasury/layout-core-v6';
import FeatherIcon from 'feather-icons-react';
import CustomCheckbox from '../../../components/custom-elements/CustomCheckbox';
import { OptionData, OptionTypeName, StockData, Direction, OptionType, OrderType, OrderTypeName } from '../../../models/strategy';
import { stockList } from '../../../utils/stockList';
import { useRouteLoaderData } from "react-router";
import OptionsMath3 from '../../../services/options-math/OptionsMath3';

interface EnhancedTableHeadProps {
    numSelected: number,
    onSelectAllClick: (e: any) => void,
    rowCount: number,
};

const EnhancedTableHead: React.FC<EnhancedTableHeadProps> = ({ onSelectAllClick, numSelected, rowCount }) => {
    return (
        <TableHead>
            <TableRow>
                <TableCell colSpan={8} />
                <TableCell colSpan={2} align={'center'} sx={{ backgroundColor: "#282C34" }}> Teórica</TableCell>
                <TableCell colSpan={2} align={'center'}> Entrada</TableCell>
                <TableCell colSpan={2} align={'center'} sx={{ backgroundColor: "#282C34" }}> Saída</TableCell>
                <TableCell colSpan={2} />
                {/* <TableCell align={'center'} sx={{ backgroundColor: "#282C34" }}>Gregas</TableCell> */}
            </TableRow>
            <TableRow>
                <TableCell padding="checkbox">
                    <CustomCheckbox
                        color="primary"
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputprops={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                <TableCell>
                    <Typography variant="h6" fontWeight="500">
                        Ativo
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="h6" fontWeight="500">Preço</Typography>
                    <Typography variant="h6" fontWeight="500">(R$)</Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="h6" fontWeight="500">
                        C/V
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="h6" fontWeight="500">
                        Qtd.
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="h6" fontWeight="500">
                        Série
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="h6" fontWeight="500">
                        Dias úteis
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="h6" fontWeight="500">
                        Strike/Papel
                    </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#282C34" }}>
                    <Typography variant="h6" fontWeight="500">
                        Volatilidade
                    </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#282C34" }}>
                    <Typography variant="h6" fontWeight="500">
                        Preço
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="h6" fontWeight="500">
                        Vol. Compra
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="h6" fontWeight="500">
                        Compra
                    </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#282C34" }}>
                    <Typography variant="h6" fontWeight="500">
                        Venda
                    </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#282C34" }}>
                    <Typography variant="h6" fontWeight="500" align='right' >
                        Vol. Venda
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="h6" fontWeight="500">
                        Resultado
                    </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#282C34" }}>
                    <Typography variant="h6" fontWeight="500">
                        Delta
                    </Typography>
                </TableCell>
                {/* <TableCell sx={{ backgroundColor: "#282C34" }}>
                    <Typography variant="h6" fontWeight="500">
                        Gama
                    </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#282C34" }}>
                    <Typography variant="h6" fontWeight="500">
                        Theta
                    </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#282C34" }}>
                    <Typography variant="h6" fontWeight="500">
                        Vega
                    </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#282C34" }}>
                    <Typography variant="h6" fontWeight="500">
                        Rho
                    </Typography>
                </TableCell> */}
            </TableRow>
        </TableHead >
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number
    deleteItens: (e: any) => void
};
const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({ numSelected, deleteItens }: EnhancedTableToolbarProps) => {
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 && (
                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
                    {numSelected} selecionado(s)
                </Typography>
            )}

            {numSelected > 0 && (
                <Tooltip title="Delete">
                    <IconButton onClick={deleteItens}>
                        <FeatherIcon icon="trash-2" size="18" />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

interface OptionsTableProps {
    stockDataList: StockData[],
    optionDataList: OptionData[],
    editableDataList: any[],
    selecteds: string[],
    deleteItens: (e: any) => void,
    setSelecteds: (e: any) => void
    getValueFromAutocomplete: (a: string, b: string, c: string) => void
    updateOption: (a: string, opt: Partial<StockData>) => void
    updateOptionPrice: (str: string, x: any) => void
    updatedImpliedVol: (var1: string, var2: any) => void
}

const OptionsTable: React.FC<OptionsTableProps> = ({
    stockDataList,
    optionDataList,
    editableDataList,
    selecteds,
    deleteItens,
    setSelecteds,
    getValueFromAutocomplete,
    updateOption,
    updateOptionPrice,
    updatedImpliedVol,
}: OptionsTableProps) => {
    const { selic } = useRouteLoaderData("optionsDashboard");

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = stockDataList.map((n) => n.id);
            setSelecteds(newSelecteds);
            return;
        }
        setSelecteds([]);
    };

    const getOptionsGreeks = (
        volatility: number,
        activePrice: number,
        strike: number,
        daysPerYear: number,
        selic: number,
        optionType: OptionType,
        direction: OrderType) => {
        return OptionsMath3.getOptionsGreeks(volatility, activePrice, strike, daysPerYear, selic, optionType, direction)

    }


    const handleClick = (_: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const selectedIndex = selecteds.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selecteds, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selecteds.slice(1));
        } else if (selectedIndex === selecteds.length - 1) {
            newSelected = newSelected.concat(selecteds.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selecteds.slice(0, selectedIndex),
                selecteds.slice(selectedIndex + 1),
            );
        }
        setSelecteds(newSelected);
    };

    const isSelected = (id: string) => selecteds.indexOf(id) !== -1;

    const formatValue = (value: string): string => {
        return Number.isNaN(value) ? '-' : value;
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Box>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <EnhancedTableToolbar numSelected={selecteds.length} deleteItens={deleteItens} />
                            <TableContainer>
                                <Table
                                    sx={{ minWidth: 750 }}
                                    aria-labelledby="tableTitle"
                                    size={'medium'}
                                >
                                    <EnhancedTableHead
                                        numSelected={selecteds.length}
                                        onSelectAllClick={handleSelectAllClick}
                                        rowCount={stockDataList.length}
                                    />
                                    <TableBody>
                                        {stockDataList.map((option, index) => {
                                            const editableItem = editableDataList?.[index]
                                            const optionItem = optionDataList?.[index];
                                            const result: number = parseFloat(editableItem.stockQtd) * parseFloat(optionItem.price)
                                            const isItemSelected = isSelected(option.id);
                                            const strike = parseFloat(option.strike.split(' ')[0].replace(/\./g, '').replace(',', '.'));
                                            const daysPerYear = editableItem?.workingDays ? editableItem.workingDays / 252 : 0
                                            const direction: OrderType = editableItem.direction ? OrderTypeName.BUY : OrderTypeName.SELL
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    // role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={option.id}
                                                    selected={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Box display="flex" alignItems={"center"}>
                                                            <CustomCheckbox
                                                                onClick={(event: React.ChangeEvent<HTMLInputElement>) => handleClick(event, option.id)}
                                                                color="primary"
                                                                checked={isItemSelected}
                                                                inputprops={{
                                                                    'aria-labelledby': labelId,
                                                                }}
                                                            />
                                                            <Typography variant="h6" fontWeight="700">{option.optionType.charAt(0)}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Autocomplete
                                                            value={option.activeName || null}
                                                            onChange={(_, newValue) => {
                                                                if (newValue && stockList.includes(newValue)) {
                                                                    console.log("activeName:: onchange:: ", newValue)
                                                                    getValueFromAutocomplete(newValue as string, option.activeName, option.id)
                                                                }
                                                            }}
                                                            // Esse aqui serve para trocar o value do input
                                                            onInputChange={(_, newInputValue) => {
                                                                if (newInputValue && stockList.includes(newInputValue)) {
                                                                    console.log("activeName:: onInputchange:: ", newInputValue)
                                                                    getValueFromAutocomplete(newInputValue as string, option.activeName, option.id)
                                                                }
                                                            }}
                                                            onClick={(event) => event.stopPropagation()}
                                                            options={stockList}
                                                            sx={{ width: 145 }}
                                                            size="small"
                                                            renderInput={(params) => <TextField {...params} label={option.activeName || "Ativo"} />}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                                                            {/* {optionItem.price} */}
                                                            {editableItem?.price.toLocaleString("pt-BR", {
                                                                style: "currency",
                                                                currency: "BRL"
                                                            })}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <SwitchTextTrack
                                                            checked={editableItem?.direction}
                                                            onChange={(_) => {
                                                                const updatedDir = !editableItem?.direction
                                                                const updatedObj = { direction: updatedDir }
                                                                updateOptionPrice(option.id, updatedObj)
                                                            }} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <InputBase
                                                            disabled={!option.activeName}
                                                            type="number"
                                                            size="small"
                                                            value={editableItem?.stockQtd}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                updatedImpliedVol(option.id, { stockQtd: e.target.value })
                                                            }}
                                                            inputProps={{ min: 0, step: 100 }}
                                                            sx={{
                                                                width: 90,
                                                                fontSize: "0.875rem",
                                                                padding: "5px 12px",
                                                                border: "1px solid #767e89",
                                                                borderRadius: "4px",
                                                                transition: "border-color 0.2s ease-in-out",
                                                                "&:hover": {
                                                                    borderColor: "#ccc", // Cor da borda ao passar o mouse
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    {
                                                        option.optionType === OptionTypeName.ACTIVE ?
                                                            (
                                                                <TableCell colSpan={3} />
                                                            ) : (
                                                                <>
                                                                    <TableCell>
                                                                        <Autocomplete
                                                                            disabled={!option.activeName}
                                                                            value={option.serie}
                                                                            onChange={(_, newValue) => {
                                                                                updateOption(option.id, { serie: newValue || option.serie })
                                                                            }}
                                                                            onClick={(event) => event.stopPropagation()}
                                                                            options={option.series}
                                                                            sx={{ width: 165 }}
                                                                            size="small"
                                                                            renderInput={(params) => <TextField {...params} />}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <TextField
                                                                            value={option.workingDays}
                                                                            size="small"
                                                                            slotProps={{
                                                                                input: {
                                                                                    readOnly: true,
                                                                                },
                                                                            }}
                                                                            sx={{
                                                                                width: 65,
                                                                                fontSize: "0.875rem",
                                                                                "& .MuiInputBase-input": {
                                                                                    textAlign: "center"
                                                                                }
                                                                            }}
                                                                        />
                                                                        {/* <InputBase
                                                                            disabled={!option.activeName}
                                                                            type="number"
                                                                            size="small"
                                                                            value={option.workingDays}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value
                                                                                updateOption(option.id, { workingDays: value })
                                                                                optionsMath.setDaysPerYear(value)
                                                                                const price = optionsMath.calculateOptionPrice()
                                                                                const updatedObj = { price }
                                                                                updateOptionPrice(option.id, updatedObj)
                                                                                const optionPriceBuy = parseFloat(optionItem?.optionIn?.cost)
                                                                                const optionPriceSale = parseFloat(optionItem?.optionOut?.sales)
                                                                                const costVolatility = optionsMath.getImpliedVolatility(optionPriceBuy)
                                                                                const salesVolatility = optionsMath.getImpliedVolatility(optionPriceSale)
                                                                                updatedImpliedVol(option.id, { costVolatility, salesVolatility })
                                                                            }}
                                                                            inputProps={{ min: 0 }}
                                                                            sx={{
                                                                                width: 65,
                                                                                fontSize: "0.875rem",
                                                                                padding: "5px 12px",
                                                                                border: "1px solid #767e89",
                                                                                borderRadius: "4px",
                                                                                transition: "border-color 0.2s ease-in-out",
                                                                                "&:hover": {
                                                                                    borderColor: "#ccc", // Cor da borda ao passar o mouse
                                                                                }
                                                                            }}
                                                                        /> */}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Autocomplete
                                                                            disabled={!option.activeName}
                                                                            value={option.strike.match(/(.*?)-/)?.[1].trim() || ""}

                                                                            onChange={(_, newValue) => {
                                                                                updateOption(option.id, { strike: newValue || option.strike })
                                                                            }}
                                                                            // onChange={(_, newValue) => {
                                                                            //     console.log("active name", newValue)
                                                                                // const newStrike = newValue || option.strike
                                                                                // updateOption(option.id, { strike: newStrike })

                                                                                // optionsMath.setStrike(parseFloat(newStrike.split(' ')[0].replace(/\./g, '').replace(',', '.')))
                                                                                // const price = optionsMath.calculateOptionPrice()
                                                                                // const updatedObj = { price }
                                                                                // updateOptionPrice(option.id, updatedObj)
                                                                                // const optionPriceBuy = parseFloat(optionItem?.optionIn?.bandCost)
                                                                                // const optionPriceSale = parseFloat(optionItem?.optionOut?.bandSales)
                                                                                // const costVolatility = optionsMath.getImpliedVolatility(optionPriceBuy)
                                                                                // const salesVolatility = optionsMath.getImpliedVolatility(optionPriceSale)
                                                                                // updatedImpliedVol(option.id, { costVolatility, salesVolatility })
                                                                            // }}
                                                                            onClick={(event) => event.stopPropagation()}
                                                                            options={option.strikes}
                                                                            getOptionLabel={(option) => String(option)}
                                                                            sx={{ width: 170 }}
                                                                            size="small"
                                                                            renderInput={(params) => <TextField {...params} label={option.strike.match(/-\s*(\S+)/)?.[1] || ""} />}
                                                                        />
                                                                    </TableCell>
                                                                </>
                                                            )

                                                    }


                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <InputBase
                                                            disabled={!option.activeName}
                                                            type="number"
                                                            size="small"
                                                            value={editableItem?.volatility}

                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                updateOptionPrice(option.id, { volatility: e.target.value })
                                                            }}
                                                            inputProps={{ min: 0, step: 0.01 }}
                                                            sx={{
                                                                width: 76,
                                                                fontSize: "0.875rem",
                                                                padding: "5px 12px",
                                                                border: "1px solid #767e89",
                                                                borderRadius: "4px",
                                                                transition: "border-color 0.2s ease-in-out",
                                                                "&:hover": {
                                                                    borderColor: "#ccc", // Cor da borda ao passar o mouse
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Typography variant="h6">
                                                                {editableItem?.direction ? Direction.BUY : Direction.SALES}
                                                            </Typography>
                                                            <Typography variant="h6">
                                                                {optionItem.price}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="h6">{optionItem?.optionIn?.costVolatility}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <Box
                                                                sx={{
                                                                    ml: 2,
                                                                }}
                                                            >
                                                                <Typography variant="h6">{optionItem?.optionIn?.cost || 0.0}</Typography>
                                                                <Typography color="textSecondary" variant="h6" fontWeight="400">
                                                                    {optionItem?.optionIn?.bandCost || 0.0}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Box display="flex" alignItems="center">
                                                            <Box
                                                                sx={{
                                                                    ml: 2,
                                                                }}
                                                            >
                                                                <Typography variant="h6">{optionItem?.optionOut?.sales || 0.0}</Typography>
                                                                <Typography color="textSecondary" variant="h6" fontWeight="400" align="right">
                                                                    {optionItem?.optionOut?.bandSales || 0.0}
                                                                </Typography>
                                                            </Box>
                                                        </Box>

                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6" align='right'>{optionItem?.optionOut?.salesVolatility}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Typography variant="h6">
                                                                {editableItem?.direction ? Direction.BUY : Direction.SALES}
                                                            </Typography>
                                                            <Typography variant="h6">
                                                                {result.toFixed(2)}
                                                            </Typography>
                                                        </Box>

                                                    </TableCell>
                                                    <TableCell align="center" sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">
                                                            {new Intl.NumberFormat('en-US', { signDisplay: "always" }).format(
                                                                getOptionsGreeks(
                                                                    editableItem?.volatility,
                                                                    26.16,
                                                                    strike,
                                                                    daysPerYear,
                                                                    selic,
                                                                    option?.optionType,
                                                                    direction).delta ?? 0)}
                                                        </Typography>
                                                    </TableCell>
                                                    {/* <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">gama</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">theta</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">vega</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">rho</Typography>
                                                    </TableCell> */}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Box>
                </CardContent>
            </Card>
        </>
    );
};

export default OptionsTable;
