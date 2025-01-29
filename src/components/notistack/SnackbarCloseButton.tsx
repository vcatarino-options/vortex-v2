import React from "react";
import { useSnackbar } from 'notistack';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SnackbarCloseButtonProps {
    snackbarKey: React.ReactText;
}

const SnackbarCloseButton: React.FC<SnackbarCloseButtonProps> = ({ snackbarKey }) => {
    const { closeSnackbar } = useSnackbar();

    return (
        <IconButton
            onClick={() => closeSnackbar(snackbarKey)}
        >
            <CloseIcon sx={{
                color: '#FFF'
            }} />
        </IconButton>
    );
}

export default SnackbarCloseButton;
