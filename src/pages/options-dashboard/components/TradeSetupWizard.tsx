import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getLightestGrey, getLightGrey } from "../../../layouts/mui-treasury/mockup-utils";
import { Autocomplete, Button, ButtonGroup, Divider, TextField } from "@mui/material";

export const TradeSetupWizard = (props: BoxProps) => {
    return (
        <Box
            {...props}
            sx={{
                borderRadius: 1,
                border: "1px solid",
                borderColor: getLightGrey,
                bgcolor: getLightestGrey,
                p: 1.5,
                boxShadow: "0 2px 6px 0 rgba(0,0,0,0.08)",
                ...props.sx,
                display: "flex"
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-around", height: "18vh" }}>
                <Autocomplete
                    options={["teste1"]}
                    sx={{ width: 200 }}
                    size="small"
                    renderInput={(params) => <TextField {...params} label="Ativo" />}
                />
                <Box>
                    <Typography variant="h5" fontWeight="500" pb={0.5}>Adicionar Operações:</Typography>
                    <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Button sx={{ background: (theme) => theme.palette.primary.light }} >ATIVO</Button>
                        <Button sx={{ background: (theme) => theme.palette.primary.light }} >CALL</Button>
                        <Button sx={{ background: (theme) => theme.palette.primary.light }} >PUT</Button>
                    </ButtonGroup>
                </Box>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mr: '50px', ml: "50px" }} />

            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-around", width: "100%" }}>
                <TextField
                    label="Juros"
                    type="number"
                    size="small"
                    sx={{ width: 200 }}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <TextField
                        label="Preço"
                        type="number"
                        size="small"
                        sx={{ width: 200 }}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                    <TextField
                        label="Margem aproximada"
                        type="number"
                        size="small"
                        sx={{ width: 200 }}
                        slotProps={{
                            input: {
                                readOnly: true,
                            }
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};
