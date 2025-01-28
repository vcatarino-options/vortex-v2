import * as React from 'react';
import PropTypes from 'prop-types';
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

const rows = [
    {
        id: '1',
        stockName: "PETR4",
        type: "venda",
        qtd: '1000',
        serie: "PETR4NNN",
        workingDays: '21',
        strike: 'papel',
        volatility: '0.1',
        price: '0.65',
        costVolatility: '0.1',
        costValue: '0.1',
        salesVolatility: '0.1',
        salesValue: '0.1',
        result: '1000',
        delta: '0.1',
        gama: '0.1',
        theta: '0.1',
        vega: '0.1',
        rho: '0.1',
    },

];

function EnhancedTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount } = props;
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

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
    const { numSelected } = props;

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
                    <IconButton>
                        <FeatherIcon icon="trash-2" width="18" />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

interface OptionsTableProps {
    options: OptionTable[]
}

const OptionsTable: React.FC<OptionsTableProps> = ({ options }: OptionsTableProps) => {
    const [selected, setSelected] = React.useState([]);

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    return (
        <>
            <Card>
                <CardContent>
                    <Box>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <EnhancedTableToolbar numSelected={selected.length} />
                            <TableContainer>
                                <Table
                                    sx={{ minWidth: 750 }}
                                    aria-labelledby="tableTitle"
                                    size={'medium'}
                                >
                                    <EnhancedTableHead
                                        numSelected={selected.length}
                                        onSelectAllClick={handleSelectAllClick}
                                        rowCount={options.length}
                                    />
                                    <TableBody>
                                        {options.map((row, index) => {
                                            const isItemSelected = isSelected(row.name);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    // role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.id}
                                                    selected={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <CustomCheckbox
                                                            onClick={(event) => handleClick(event, row.id)}
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
                                                            {row.type}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                                                            {row.qtd}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                                                            {row.serie}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography color="textSecondary" variant="body1" fontWeight="400">
                                                            {row.workingDays}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="h6">{row.strike}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{row.volatility}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{row.price}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <Box
                                                                sx={{
                                                                    ml: 2,
                                                                }}
                                                            >
                                                                <Typography variant="h6">{row.costVolatility}</Typography>
                                                                <Typography color="textSecondary" variant="h6" fontWeight="400">
                                                                    bandCost
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="h6">{row.costValue}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Box display="flex" alignItems="center">
                                                            <Box
                                                                sx={{
                                                                    ml: 2,
                                                                }}
                                                            >
                                                                <Typography variant="h6">{row.salesVolatility}</Typography>
                                                                <Typography color="textSecondary" variant="h6" fontWeight="400">
                                                                    bandSales
                                                                </Typography>
                                                            </Box>
                                                        </Box>

                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{row.salesValue}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="h6">{row.result}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{row.delta}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{row.gama}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{row.theta}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{row.vega}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: "#282C34" }}>
                                                        <Typography variant="h6">{row.rho}</Typography>
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
