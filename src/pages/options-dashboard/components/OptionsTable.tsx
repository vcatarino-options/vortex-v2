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
import { OptionData, StockData } from '../../../models/strategy';
import { stockList } from '../../../utils/stockList';

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
                <TableCell />
                <TableCell colSpan={5} align={'center'} sx={{ backgroundColor: "#282C34" }}>Gregas</TableCell>
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
                    <Typography variant="h6" fontWeight="500" >
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
                <TableCell sx={{ backgroundColor: "#282C34" }}>
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
                </TableCell>
            </TableRow>
        </TableHead>
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
                        <FeatherIcon icon="trash-2" width="18" />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

interface OptionsTableProps {
    stockDataList: StockData[],
    optionDataList: OptionData[],
    selecteds: string[],
    deleteItens: (e: any) => void,
    setSelecteds: (e: any) => void
    getValueFromAutocomplete: (a: string, b: string, c: string) => void
    updateOption: (a: string, opt?: Partial<StockData>) => void
    stockQtd: Record<string, number>,
    setStockQtd: (e: any) => void
}

const OptionsTable: React.FC<OptionsTableProps> = ({ stockDataList, optionDataList, selecteds, stockQtd, setStockQtd, deleteItens, setSelecteds, getValueFromAutocomplete, updateOption, }: OptionsTableProps) => {
    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = stockDataList.map((n) => n.id);
            setSelecteds(newSelecteds);
            return;
        }
        setSelecteds([]);
    };

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
                                            const optionItem = optionDataList?.[index];
                                            const isItemSelected = isSelected(option.id);
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
                                                        <CustomCheckbox
                                                            onClick={(event: React.ChangeEvent<HTMLInputElement>) => handleClick(event, option.id)}
                                                            color="primary"
                                                            checked={isItemSelected}
                                                            inputprops={{
                                                                'aria-labelledby': labelId,
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Autocomplete
                                                            value={option.activeName || null}
                                                            onChange={(event, newValue) => {
                                                                if (newValue && stockList.includes(newValue)) {
                                                                    getValueFromAutocomplete(newValue as string, option.activeName, option.id)
                                                                }
                                                            }}
                                                            onInputChange={(event, newInputValue) => {
                                                                if (newInputValue && stockList.includes(newInputValue)) {
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
                                                            {optionItem.price}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <SwitchTextTrack />
                                                    </TableCell>
                                                    <TableCell>
                                                        <InputBase
                                                            disabled={!option.activeName}
                                                            type="number"
                                                            size="small"
                                                            value={stockQtd[option.id]}
                                                            onChange={(e) => {
                                                                setStockQtd((prevStockQtd: Record<string, number>) => ({
                                                                    ...prevStockQtd,
                                                                    [option.id]: e.target.value
                                                                }));
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
                                                    <TableCell>
                                                        <Autocomplete
                                                            disabled={!option.activeName}
                                                            value={option.serie}
                                                            onChange={(e, newValue) => {
                                                                updateOption(option.id, { serie: newValue || option.serie })
                                                            }}
                                                            onClick={(event) => event.stopPropagation()}
                                                            options={option.series}
                                                            sx={{ width: 200 }}
                                                            size="small"
                                                            renderInput={(params) => <TextField {...params} />}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <InputBase
                                                            disabled={!option.activeName}
                                                            type="number"
                                                            size="small"
                                                            value={option.workingDays}
                                                            onChange={(e) => {
                                                                const value = e.target.value
                                                                updateOption(option.id, { workingDays: value })
                                                            }}
                                                            inputProps={{ min: 0 }}
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
                                                    <TableCell>
                                                        <Autocomplete
                                                            disabled={!option.activeName}
                                                            value={option.strike}
                                                            onChange={(e, newValue) => {
                                                                const newStrike = newValue || option.strike
                                                                updateOption(option.id, { strike: newStrike })
                                                            }}
                                                            onClick={(event) => event.stopPropagation()}
                                                            options={option.strikes}
                                                            getOptionLabel={(option) => String(option)}
                                                            sx={{ width: 200 }}
                                                            size="small"
                                                            renderInput={(params) => <TextField {...params} />}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">volatiliy</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">price</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <Box
                                                                sx={{
                                                                    ml: 2,
                                                                }}
                                                            >
                                                                <Typography variant="h6">costVolatility</Typography>
                                                                <Typography color="textSecondary" variant="h6" fontWeight="400">
                                                                    {optionItem?.optionIn?.bandCost || 0.0}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="h6">{optionItem?.optionIn?.cost || 0.0}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{optionItem?.optionOut?.sales || 0.0}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Box display="flex" alignItems="center">
                                                            <Box
                                                                sx={{
                                                                    ml: 2,
                                                                }}
                                                            >
                                                                <Typography variant="h6">salesVolatility</Typography>
                                                                <Typography color="textSecondary" variant="h6" fontWeight="400" align="right">
                                                                    {optionItem?.optionOut?.bandSales || 0.0}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Typography variant="h6">result</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">delta</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
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
                                                    </TableCell>

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
