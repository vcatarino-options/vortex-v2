import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

interface FormDialogProps {
    contentText: string
    inputLabel: string
    btCancelLabel: string
    btContinueLabel: string
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    open: boolean
    handleClose: () => void
}
const FormDialog: React.FC<FormDialogProps> = ({
    contentText,
    inputLabel,
    btCancelLabel,
    btContinueLabel,
    onSubmit,
    handleClose,
    open,
    value,
    onChange }: FormDialogProps) => {
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit,
                }}
            >
                <DialogContent>
                    <DialogContentText>
                        {contentText}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        name="name"
                        label={inputLabel}
                        value={value}
                        onChange={onChange}
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">{btCancelLabel}</Button>
                    <Button type="submit" variant="contained">{btContinueLabel}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default FormDialog
