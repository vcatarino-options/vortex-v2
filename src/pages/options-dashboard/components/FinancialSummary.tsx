import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";

interface FinancialSummaryProps extends BoxProps {
    setIputValue: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    editableDataList: any[]
    margin: any
}
export const FinancialSummary = (props: FinancialSummaryProps) => {
    let totalPrice = 0
    if (props.editableDataList && props.editableDataList.length > 0) {
        totalPrice = props.editableDataList.reduce((sum: number, item: { price: number }) => sum + (item.price || 0), 0);
    }
    return (
        <Box>
            <Typography variant="h5" fontWeight="500" pb={1.5}>Resumo:</Typography>
            <Box sx={{ display: "flex", justifyContent: "start" }}>
                <TextField
                    disabled
                    name="price"
                    label="Preço da op. (R$)"
                    size="small"
                    value={totalPrice.toFixed(2)}
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
                    value={props.margin.margin}
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
