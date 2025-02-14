import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import { OptionData, StockData } from "../../../models/strategy";

interface FinancialSummaryProps extends BoxProps {
    setIputValue: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    selecteds: string[]
    options: OptionData[]
    editableItems: any[]
    margin: any
}
export const FinancialSummary = (props: FinancialSummaryProps) => {
    if (!props.options || !props.editableItems) {
        console.warn("No data available.");
        return;
    }

    const itemsToSum = (props.options || [])
        .filter(item => props.selecteds.includes(item.id))
        .map(item => {
            const stock = props.editableItems.find((stock: any) => stock.id === item.id);
            const price = typeof item.price === "number" ? item.price : parseFloat(item.price);

            return {
                ...item,
                price: stock?.direction ? price * -1 : price
            };
        });


    const totalPrice = itemsToSum.reduce((sum, item) => sum + (item.price || 0), 0);

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
                    value={props?.margin?.margin}
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
