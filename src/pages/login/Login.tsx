import { Grid, Box, Typography, Button, OutlinedInput, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router';

import bgImage from '../../assets/images/backgrounds/image.svg'
import useForm from '../../hooks/useForm';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import AuthService from '../../services/auth/AuthService';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Login() {
    const { formValue, setFormData } = useForm({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [_, setInputErro] = useState(false)
    let navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    async function doLogin() {
        setIsLoading(true)
        try {
            checkEmail(formValue.email);
            checkPassWord(formValue.password);
            await AuthService.basicAuth(formValue.email, formValue.password);
            navigate("/dashboard")
        } catch (e: unknown) {
            if (e instanceof Error) {
                enqueueSnackbar(e.message, { variant: "error" });
            } else {
                enqueueSnackbar("Ocorreu um erro inesperado. Fale com o administrador do sistema.", { variant: "error" });
            }
            setIsLoading(false)
        }
    }

    const checkEmail = (email: string) => {
        if (!email) {
            setInputErro(true)
            console.error(`O email é uma informação necessária.`);
            throw Error(
                "O email é uma informação necessária. Preencha o campo vazio."
            );
        }
        const emailPattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*(\+[_a-z0-9-]+)?@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        const emailIsValid =
            typeof email === "string" && emailPattern.test(email);
        if (!emailIsValid) {
            console.error("o valor do atributo email: ", email);
            throw Error(
                "Seu email parece não estar correto. Por favor, verifique e insira um email válido para que possamos continuar."
            );
        }
        return true;
    };

    const checkPassWord = (password: string) => {
        if (!password) {
            console.error(`O password é uma informação necessária.`);
            throw Error(
                "O password é uma informação necessária. Preencha o campo vazio."
            );
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            doLogin()
        }
    }

    return (
        <>
            {
                isLoading ? (
                    <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                        <CircularProgress color="inherit" size={100} />
                    </Box>)
                    :
                    (
                        <>
                            <Grid container spacing={0} sx={{ height: '100vh', justifyContent: 'center' }}>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    lg={6}
                                    sx={{
                                        background: (theme) => `${theme.palette.primary.main}`,
                                        height: '100vh'
                                    }}
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        height="100%"
                                    >
                                        <img
                                            src={bgImage}
                                            alt="bg"
                                            style={{
                                                width: '256.7px',
                                                height: '100px',
                                                top: '480px',
                                                left: '346px',
                                                maxWidth: '812px',
                                            }}
                                        />
                                    </Box>

                                </Grid>
                                <Grid item xs={12} sm={8} lg={6} display="flex" alignItems="center">
                                    <Grid container spacing={0} display="flex" justifyContent="center">
                                        <Grid item xs={12} lg={9} xl={6}>
                                            <Box
                                                onKeyDown={handleKeyDown}
                                                sx={{
                                                    p: 4,
                                                }}
                                            >
                                                <Typography fontWeight="700" variant="h2">
                                                    Login
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        mt: 1,
                                                    }}
                                                >
                                                    <OutlinedInput
                                                        autoFocus
                                                        name="email"
                                                        value={formValue.email}
                                                        placeholder="E-mail*"
                                                        fullWidth
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            // setInputErro(false)
                                                            setFormData(e)
                                                        }}
                                                    // endAdornment={
                                                    //     inputError && (
                                                    //         <InputAdornment
                                                    //             position="end"
                                                    //             sx={{ color: 'text.danger', fontSize: '12px' }}
                                                    //         >
                                                    //             <span> Campo Obrigatório</span>
                                                    //         </InputAdornment>
                                                    //     )}

                                                    />

                                                    <OutlinedInput
                                                        name="password"
                                                        value={formValue.password}
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Senha*"
                                                        fullWidth
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(e)}
                                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                            if (e.key === 'Enter') {
                                                                doLogin();
                                                            }
                                                        }}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label={
                                                                        showPassword ? 'hide the password' : 'display the password'
                                                                    }
                                                                    onClick={handleClickShowPassword}
                                                                    edge="end"
                                                                >
                                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                        sx={{
                                                            mb: 3,
                                                            mt: 2,
                                                        }}

                                                    />

                                                    <Button
                                                        variant="contained"
                                                        size="large"
                                                        fullWidth
                                                        component={Link}
                                                        to="/"
                                                        onClick={() => doLogin()}
                                                        sx={{
                                                            pt: '10px',
                                                            pb: '10px',
                                                            background: (theme) => `${theme.palette.primary.main}`,
                                                            color: (theme) => `${theme.palette.primary.contrastText}`
                                                        }}
                                                    >
                                                        ENTRAR
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    )
            }
        </>

    );
}

export default Login;
