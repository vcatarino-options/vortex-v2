import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";

interface FinancialSummaryProps extends BoxProps {
    setIputValue: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}
export const FinancialSummary = (props: FinancialSummaryProps) => {
    return (
        <Box>
            <Typography variant="h5" fontWeight="500" pb={1.5}>Resumo:</Typography>
            <Box sx={{ display: "flex", justifyContent: "start" }}>
                <TextField
                    disabled
                    name="price"
                    label="Preço da op. (R$)"
                    size="small"
                    value={"100,00"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => props.setIputValue(e)}
                    sx={{ width: 130, mr: 2 }}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                        input: {
                            readOnly: true
                        }
                    }}
                />
                <TextField
                    disabled
                    name="estimatedMargin"
                    label="Margem aprox. (%)"
                    size="small"
                    value={"100,00"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => props.setIputValue(e)}
                    sx={{ width: 130 }}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                        input: {
                            readOnly: true
                        }
                    }}
                />
            </Box>
        </Box>
    );
};
