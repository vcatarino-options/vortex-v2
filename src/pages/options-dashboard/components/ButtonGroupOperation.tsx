import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, ButtonGroup } from "@mui/material";

interface ButtonGroupOperationProps extends BoxProps {
    addingOperation: (str: string) => void
}
export const ButtonGroupOperation = (props: ButtonGroupOperationProps) => {
    return (
        <Box>
            <Typography variant="h5" fontWeight="500" pb={1.5}>Adicionar Operações:</Typography>
            <ButtonGroup variant="contained" aria-label="Basic button group">
                <Button sx={{ background: (theme) => theme.palette.primary.light }} onClick={() => props.addingOperation("active")}>ATIVO</Button>
                <Button sx={{ background: (theme) => theme.palette.primary.light }} onClick={() => props.addingOperation("call")} >CALL</Button>
                <Button sx={{ background: (theme) => theme.palette.primary.light }} onClick={() => props.addingOperation("put")} >PUT</Button>
            </ButtonGroup>
        </Box>
    );
};
