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
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import CustomCheckbox from '../../../components/custom-elements/CustomCheckbox';
import { OptionTable } from '../../../models/strategy';

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
                    <Typography variant="h6" fontWeight="500" >
                        Vol. Venda
                    </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#282C34" }}>
                    <Typography variant="h6" fontWeight="500">
                        Venda
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
    options: OptionTable[],
    selecteds: string[],
    deleteItens: (e: any) => void,
    setSelecteds: (e: any) => void

}

const OptionsTable: React.FC<OptionsTableProps> = ({ options, deleteItens, selecteds, setSelecteds }: OptionsTableProps) => {
    // const [selecteds, setSelecteds] = React.useState<string[]>([]);

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = options.map((n) => n.id);
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
                                        rowCount={options.length}
                                    />
                                    <TableBody>
                                        {options.map((option, index) => {
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
                                                        <Typography variant="h6" fontWeight="600">
                                                            <Autocomplete
                                                                // onChange={(event, newValue) => props.getValue(newValue)}
                                                                onClick={(event) => event.stopPropagation()}
                                                                options={["PETR4", "BOVA11", "CCCC34"]}
                                                                sx={{ width: 145 }}
                                                                size="small"
                                                                renderInput={(params) => <TextField {...params} label="Ativo" />}
                                                            />
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                                                            145,00
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                                                            {option.type}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                                                            {option.qtd}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                                                            {option.serie}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography color="textSecondary" variant="body1" fontWeight="400">
                                                            {option.workingDays}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="h6">{option.strike}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{option.volatility}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{option.price}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <Box
                                                                sx={{
                                                                    ml: 2,
                                                                }}
                                                            >
                                                                <Typography variant="h6">{option.costVolatility}</Typography>
                                                                <Typography color="textSecondary" variant="h6" fontWeight="400">
                                                                    bandCost
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="h6">{option.costValue}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Box display="flex" alignItems="center">
                                                            <Box
                                                                sx={{
                                                                    ml: 2,
                                                                }}
                                                            >
                                                                <Typography variant="h6">{option.salesVolatility}</Typography>
                                                                <Typography color="textSecondary" variant="h6" fontWeight="400">
                                                                    bandSales
                                                                </Typography>
                                                            </Box>
                                                        </Box>

                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{option.salesValue}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="h6">{option.result}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{option.delta}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{option.gama}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{option.theta}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{option.vega}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{option.rho}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {/* {emptyRows > 0 && (
                                            <TableRow
                                                style={{
                                                    height: (dense ? 33 : 53) * emptyRows,
                                                }}
                                            >
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )} */}
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
