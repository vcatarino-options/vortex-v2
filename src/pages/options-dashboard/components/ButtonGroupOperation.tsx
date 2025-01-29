import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, ButtonGroup } from "@mui/material";
import { OptionType } from "../../../models/strategy";

interface ButtonGroupOperationProps extends BoxProps {
    addingOperation: (str: OptionType) => void
}
export const ButtonGroupOperation = (props: ButtonGroupOperationProps) => {
    return (
        <Box>
            <Typography variant="h5" fontWeight="500" pb={1.5}>Adicionar Operações:</Typography>
            <ButtonGroup variant="contained" aria-label="Basic button group">
                <Button sx={{ background: (theme) => theme.palette.primary.light }} onClick={() => props.addingOperation("ACTIVE")}>ATIVO</Button>
                <Button sx={{ background: (theme) => theme.palette.primary.light }} onClick={() => props.addingOperation("CALL")} >CALL</Button>
                <Button sx={{ background: (theme) => theme.palette.primary.light }} onClick={() => props.addingOperation("PUT")} >PUT</Button>
            </ButtonGroup>
        </Box>
    );
};
